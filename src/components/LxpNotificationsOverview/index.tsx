import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { FC, useRef, useState } from 'react';
import Spinner from 'components/Spinner';
import Popover from 'components/Popover';
import Tabs from 'components/Tabs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LearnNotificationTab from './components/LearnNotificationTab';
// import { NavLink } from 'react-router-dom';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getLearnUrl } from 'utils/misc';

export enum NotificationType {
  ALL = 'All',
  MENTIONS = 'Mentions',
}

const LxpNotificationsOverview: FC = () => {
  const { getApi } = usePermissions();

  const useGetUnreadNotificationsCount = getApi(
    ApiEnum.GetNotificationsUnreadCount,
  );
  const { data, isLoading, isError } = useGetUnreadNotificationsCount();

  const viewAllRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const markAllNotificationsAsRead = getApi(ApiEnum.MarkAllNotificationsAsRead);

  const markReadMutation = useMutation(
    (category: string) => markAllNotificationsAsRead(category),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['unread-count']);
        queryClient.invalidateQueries(['get-notifications']);
      },
    },
  );
  const category = activeTabIndex === 0 ? 'LEARN' : 'LXP';

  const handleMarkAllAsRead = () => {
    markReadMutation.mutate(category);
  };

  const notifTabs = [
    {
      id: 0,
      tabLabel: (isActive: boolean) => (
        <p
          className={`font-bold text-sm pb-2 w-[53px] text-center ${
            isActive
              ? 'text-neutral-900'
              : 'text-neutral-500 group-hover:text-neutral-900 group-focus:text-neutral-900'
          }`}
        >
          Learn
        </p>
      ),
      tabContent: <LearnNotificationTab isSocial={false} />,
      dataTestId: 'notifications-learn',
    },
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <p
          className={`font-bold text-sm pb-2 w-[53px] text-center ${
            isActive
              ? 'text-neutral-900'
              : 'text-neutral-500 group-hover:text-neutral-900 group-focus:text-neutral-900'
          }`}
        >
          Social
        </p>
      ),
      tabContent: <LearnNotificationTab isSocial={true} />,
      dataTestId: 'notifications-social',
    },
  ];
  return (
    <Popover
      triggerNode={
        <div className="font-bold flex flex-row justify-center items-center p-3 border-none relative">
          {!isLoading &&
            !isError &&
            data?.data?.result?.data?.notification_count > 0 && (
              <div className="absolute rounded-full bg-red-600 border border-white text-white antialiased text-xs font-bold leading-4 top-2 right-2.5 flex w-4 h-4 items-center justify-center">
                {/* Get unread notif count here */}
                {(data?.data?.result?.data?.notification_count > 10
                  ? '9+'
                  : data?.data?.result?.data?.notification_count) || ''}
              </div>
            )}
          {isLoading && (
            <Spinner className="absolute top-1.5 right-2.5 fill-red-600 !w-4 !h-4 !m-0" />
          )}

          <Icon
            name="notification"
            size={25}
            dataTestId="office-notification-page"
            ariaLabel="notifications"
          />
        </div>
      }
      ref={viewAllRef}
    >
      <Card className=" rounded absolute w-[455px] right-0 top-4 border border-neutral-200">
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between">
          <p className="text-gray-900 font-extrabold text-base">
            Notifications
          </p>
          {/* Mark all as read */}

          <div className="flex items-center gap-1 text-sm">
            <p
              onClick={handleMarkAllAsRead}
              role="button"
              title="mark all as read"
              tabIndex={0}
              onKeyUp={(e) =>
                e.code === 'Enter' ? markReadMutation.mutate(category) : ''
              }
              className="text-primary-500 cursor-pointer"
            >
              Mark all as read
            </p>
            <span className="text-gray-300">|</span>
            <p
              onClick={() =>
                window.location.assign(
                  `${getLearnUrl()}/settings/notifications`,
                )
              }
              className="text-primary-500  cursor-pointer"
            >
              Settings{' '}
            </p>
          </div>
        </div>
        {/* Content */}
        <Divider />
        <Tabs
          tabs={notifTabs}
          tabContentClassName=""
          className="flex justify-start gap-x-1 mb-2 px-4 border-b-1 border-neutral-200 w-full "
          itemSpacing={4}
          onTabChange={(index) => setActiveTabIndex(index)}
        />
        <Divider />
        {/* see All */}
      </Card>
    </Popover>
  );
};

export default LxpNotificationsOverview;
