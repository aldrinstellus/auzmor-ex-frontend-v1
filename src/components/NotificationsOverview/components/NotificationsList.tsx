import Divider from 'components/Divider';
import NotificationProps from './Notification';
import Notification from './Notification';
import { IMedia } from 'interfaces';
import NotificationsOverviewSkeleton from './NotificationsOverviewSkeleton';
import { forwardRef } from 'react';
import NoNotification from 'images/noNotification.svg';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

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
  SCHEDULE_POST_PUBLISH = 'SCHEDULE_POST_PUBLISH',
  POST_PRE_PUBLISH = 'POST_PRE_PUBLISH',
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
    const { getApi } = usePermissions();
    const useInfiniteNotifications = getApi(ApiEnum.GetNotifications);
    const { data, isLoading, isError } = useInfiniteNotifications({
      limit: 20,
      ...(mentions ? { mentions: true } : undefined),
    });

    const notificationData = data?.pages?.flatMap((page: any) =>
      page.data.result.data.map((item: any) => item),
    );
    return isLoading ? (
      <NotificationsOverviewSkeleton />
    ) : (
      <div>
        {!isError && notificationData?.length ? (
          <div className={`flex flex-col overflow-y-auto ${className}`}>
            {notificationData?.map(
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
