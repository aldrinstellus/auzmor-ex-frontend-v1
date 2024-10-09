import React, { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import NotificationsOverviewSkeleton from './NotificationsOverviewSkeleton';
import Divider from 'components/Divider';
import EventNotificationCard from './LearnEventNotificationCard';
import { NOTIFICATION_ACTION_TYPES } from '../utils/constants';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import Spinner from 'components/Spinner';
import { isLearnerRoute } from '../utils/learnNotification';
import useAuth from 'hooks/useAuth';
import { UserRole } from 'interfaces';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import NoNotification from 'images/noNotification.svg';

type LearnNotificationTab = {
  isSocial?: boolean;
};

const LearnNotificationTab: FC<LearnNotificationTab> = ({
  isSocial = false,
}) => {
  const { getApi } = usePermissions();
  const useInfiniteNotifications = getApi(ApiEnum.GetNotifications);

  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteNotifications({
    limit: 20,
    category: isSocial ? 'LXP' : 'LEARN',
  });

  const markNotificationAsReadById = getApi(ApiEnum.MarkNotificationAsRead);
  const markNotificationAsReadMutation = useMutation({
    mutationKey: ['mark-notification-as-read'],
    mutationFn: (id: string) => markNotificationAsReadById(id),
    onSuccess: (response) => {
      console.log(
        'Notification successfully marked as read: ',
        JSON.stringify(response),
      );
      queryClient.invalidateQueries(['get-notifications']);
      queryClient.invalidateQueries(['unread-count']);
      queryClient.refetchQueries(['notifications-page']);
    },
    onError: (response) => {
      console.log(
        'Error in marking notification as read: ',
        JSON.stringify(response),
      );
    },
  });

  const isLearn = isLearnerRoute();

  const { user } = useAuth();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const notificationData = data?.pages?.flatMap((page: any) =>
    page.data.result.data.map((item: any) => item),
  );

  const handleMarkAsRead = (id: string) => {
    markNotificationAsReadMutation.mutate(id);
  };

  if (isLoading) return <NotificationsOverviewSkeleton />;

  return (
    <>
      {!isError && notificationData?.length ? (
        <div className="flex flex-col mt-2 mb-4 gap-y-2 h-[470px] overflow-y-auto">
          {notificationData.map((notification: any, index: number) => (
            <React.Fragment key={notification.id}>
              <EventNotificationCard
                source={
                  NOTIFICATION_ACTION_TYPES.SystemGenerated.includes(
                    notification.action_type,
                  )
                    ? 'system'
                    : 'user'
                }
                periods={notification.periods}
                isRead={notification.is_read}
                id={notification.id}
                actionType={notification.action_type}
                actor={notification.actor}
                createdAt={notification.created_at}
                deletedTargetName={notification.deleted_target_name}
                target1Type={notification.target_1_type}
                target2Type={notification.target_2_type}
                targetId1={notification.target_id_1}
                isLearn={isLearn}
                viewInline={true}
                isManager={user?.role == UserRole.Manager}
                additionalInfo={notification.additional_info}
                onMarkAsRead={handleMarkAsRead}
              />
              {index < notificationData.length - 1 && (
                <Divider className="bg-neutral-200" />
              )}
            </React.Fragment>
          ))}
          {(hasNextPage || isFetchingNextPage) && (
            <div ref={ref} className="h-10" />
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center py-12">
          <div className="flex">
            <img
              src={NoNotification}
              alt="Apps Not Found"
              height={140}
              width={165}
            />
          </div>
          <p className="text-neutral-900 font-semibold text-lg mt-2">
            No Notifications yet
          </p>
          <p className="text-neutral-500 text-sm font-medium text-center mt-2.5">
            We will notify you once we have <br /> something for you
          </p>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="w-full flex items-center justify-center p-4">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default LearnNotificationTab;
