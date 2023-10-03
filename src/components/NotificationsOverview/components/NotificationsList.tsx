import Divider from 'components/Divider';
import { useGetNotifications } from 'queries/notifications';
import NotificationProps from './Notification';
import Notification from './Notification';
import { IMedia } from 'contexts/CreatePostContext';
import NotificationsOverviewSkeleton from './NotificationsOverviewSkeleton';
import { forwardRef } from 'react';

type NotificationsList = {
  mentions?: boolean;
  className?: string;
};

export enum ActionType {
  REACTION = 'REACTION',
  COMMENT = 'COMMENT',
  MENTION = 'MENTION',
  SCHEDULE_POST = 'SCHEDULE_POST',
  SHOUTOUT = 'SHOUT_OUT',
  NEW_MEMBERS_TO_TEAM = 'NEW_MEMBERS_TO_TEAM',
  ACKNOWLEDGEMENT_REMINDER = 'ACKNOWLEDGEMENT_REMINDER',
}

export enum TargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  TEAM = 'TEAM',
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
  entityName?: string;
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

const NotificationsList = forwardRef(
  ({ mentions, className }: NotificationsList, ref: any) => {
    const { data, isLoading, isError } = useGetNotifications(mentions);

    return (
      <div>
        {!isLoading && !isError && (
          <div className={`flex flex-col overflow-y-auto ${className}`}>
            {data.data?.result?.data?.map(
              (notification: NotificationProps, index: number) => (
                <div key={index} onClick={() => ref?.current?.click()}>
                  <Notification
                    action={notification.action}
                    actor={notification.actor}
                    target={notification.target}
                    isRead={notification.isRead}
                    createdAt={notification.createdAt}
                    id={notification.id}
                    interactionCount={notification.interactionCount}
                  />
                  <Divider className="bg-neutral-200" />
                </div>
              ),
            )}
            <Divider />
            <div className="text-neutral-500 text-sm font-normal flex justify-center py-4">
              That&apos;s all for now
            </div>
          </div>
        )}
        {isLoading && <NotificationsOverviewSkeleton />}
        {isError && (
          <div className="flex items-center justify-center p-6">
            Error loading notifications
          </div>
        )}
      </div>
    );
  },
);

NotificationsList.displayName = 'NotificationsList';

export default NotificationsList;
