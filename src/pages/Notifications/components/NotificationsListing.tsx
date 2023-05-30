import Divider from 'components/Divider';
import Notification from 'components/NotificationsOverview/components/Notification';
import Spinner from 'components/Spinner';
import { useInfiniteNotifications } from 'queries/notifications';
import React, { ReactElement, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

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
  workLocation?: string;
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
  image?: string | null;
};

export type Target = {
  type: string;
  content: string;
  entityId: string;
  image?: string | null;
};

export type NotificationProps = {
  actor: Actor;
  action: Action;
  target: Target[];
  isRead: boolean;
  createdAt: string;
  id: string;
};

const NotificationsListing: React.FC<NotificationsListing> = ({
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

  return (
    <div>
      {!isLoading && !isError && (
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
      )}
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex items-center justify-center p-6">
          <Spinner color="#059669" />
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center p-6">
          Error loading notifications
        </div>
      )}
    </div>
  );
};

export default NotificationsListing;
