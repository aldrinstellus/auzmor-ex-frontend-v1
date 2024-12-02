import React, { forwardRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Divider from 'components/Divider';
import EventNotificationCard from './EventNotificationCard';
import { NOTIFICATION_ACTION_TYPES } from '../utils/constants';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import { isLearnerRoute } from '../utils/learnNotification';
import useAuth from 'hooks/useAuth';
import { UserRole } from 'interfaces';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import NoNotification from 'images/noNotification.svg';
import { useTranslation } from 'react-i18next';
import NotificationSkeleton from './NotificationSkeleton';

type Notifications = {
  isSocial?: boolean;
};

const Notifications = forwardRef(
  ({ isSocial = false }: Notifications, viewAllRef: any) => {
    const { getApi } = usePermissions();
    const useInfiniteNotifications = getApi(ApiEnum.GetNotifications);
    const { t } = useTranslation('notifications');
    const { ref, inView } = useInView({
      root: document.getElementById('notification-body'),
      rootMargin: '20%',
    });

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
      onSuccess: () => {
        queryClient.invalidateQueries(['get-notifications']);
        queryClient.invalidateQueries(['unread-count']);
        queryClient.refetchQueries(['notifications-page']);
        queryClient.refetchQueries(['get-learner-notifications']);
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

    if (isLoading) {
      return (
        <div className=" w-full">
          <NotificationSkeleton loaderCount={6} />
        </div>
      );
    }

    return (
      <>
        {!isError && notificationData?.length ? (
          <div
            id="notification-body"
            className="flex flex-col h-[394px] overflow-y-auto mt-[10px] gap-2 "
          >
            {notificationData.map((notification: any, index: number) => (
              <React.Fragment key={notification.id}>
                <EventNotificationCard
                  ref={viewAllRef}
                  source={
                    NOTIFICATION_ACTION_TYPES.SystemGenerated.includes(
                      notification.additional_info.action.type,
                    )
                      ? 'system'
                      : 'user'
                  }
                  periods={notification.periods}
                  isRead={notification.is_read}
                  id={notification.id}
                  actionType={notification.additional_info.action.type}
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
                  <Divider className="!bg-neutral-200 my-[10px] flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
            <div>
              {hasNextPage && isFetchingNextPage && (
                <NotificationSkeleton loaderCount={3} />
              )}
              {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center py-12">
            <div className="flex">
              <img
                src={NoNotification}
                alt="Notifications Not Found"
                height={140}
                width={165}
              />
            </div>
            <p className="text-neutral-900 font-semibold text-lg mt-2">
              {t('emptyMessageTitle')}
            </p>
            <p className="text-neutral-500 text-sm font-medium text-center mt-2.5">
              {t('emptyMessage1')}
              <br /> {t('emptyMessage2')}
            </p>
          </div>
        )}
      </>
    );
  },
);
Notifications.displayName = 'Notifications';

export default Notifications;
