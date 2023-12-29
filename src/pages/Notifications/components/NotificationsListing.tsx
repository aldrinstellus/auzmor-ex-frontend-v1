import Divider from 'components/Divider';
import Notification from 'components/NotificationsOverview/components/Notification';
import Spinner from 'components/Spinner';
import { IMedia } from 'contexts/CreatePostContext';
import { useInfiniteNotifications } from 'queries/notifications';
import { FC, ReactElement, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import NotificationSkeleton from './SkeletonLoader';
import NoNotification from 'images/noNotification.svg';
import { Card } from 'antd';

type NotificationsListing = {
  mentions?: boolean;
  className?: string;
};

export enum ActionType {
  REACTION = 'REACTION',
  COMMENT = 'COMMENT',
  MENTION = 'MENTION',
}

export enum TargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export type Actor = {
  fullName: string;
  profileImage?: {
    blurHash?: string;
    original?: string;
  };
  workLocation?: Record<string, string>;
  userId?: string;
  department?: string;
  designation?: string;
  status: string;
};

export type Action = {
  type: string;
  content: string;
  actedAt: string;
  entityId: string;
  image?: IMedia;
};

export type Target = {
  type: string;
  content: string;
  entityId: string;
  image?: IMedia;
};

export type NotificationProps = {
  actor: Actor;
  action: Action;
  target: Target[];
  isRead: boolean;
  createdAt: string;
  id: string;
  interactionCount?: number;
};

const NotificationsListing: FC<NotificationsListing> = ({
  mentions = false,
  className,
}): ReactElement => {
  const { ref, inView } = useInView();
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteNotifications({
    limit: 20,
    ...(mentions ? { mentions: true } : undefined),
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (isError) console.log({ error });
  }, [isError]);

  const notifications = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((notification: any) => {
      try {
        return notification;
      } catch (e) {
        console.log('Error', { notification });
      }
    });
  }) as NotificationProps[];

  return isLoading ? (
    <NotificationSkeleton />
  ) : (
    <>
      {!isError &&
        (notifications?.length ? (
          <div className={`flex flex-col overflow-y-auto ${className}`}>
            {notifications?.length > 0 &&
              notifications[0] !== undefined &&
              notifications.map(
                (notification: NotificationProps, index: number) => (
                  <div key={index}>
                    <Notification
                      action={notification.action}
                      actor={notification.actor}
                      target={notification.target}
                      isRead={notification.isRead}
                      createdAt={notification.createdAt}
                      interactionCount={notification.interactionCount}
                      id={notification.id}
                    />
                    <Divider className="bg-gray-200" />
                  </div>
                ),
              )}
            <Divider />
            <div className="text-neutral-500 text-sm font-normal flex justify-center py-4">
              That&apos;s all for now
            </div>
          </div>
        ) : (
          <Card>
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
          </Card>
        ))}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center p-6">
          <Spinner />
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center p-6">
          Error loading notifications
        </div>
      )}
    </>
  );
};

export default NotificationsListing;
