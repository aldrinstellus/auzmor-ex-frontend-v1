import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { FC, useRef, useState } from 'react';
import Spinner from 'components/Spinner';
import Popover from 'components/Popover';
import {
  markAllNotificationsAsRead,
  useGetUnreadNotificationsCount,
} from 'queries/notifications';
import Tabs from 'components/Tabs';
import NotificationsList from './components/NotificationsList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LearnNotificationTab from './components/LearnNotificationTab';
import {
  markAllLearnNotificationsAsRead,
  useGetLearnUnreadNotificationsCount,
} from 'queries/learn';
import { NavLink } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';

export enum NotificationType {
  ALL = 'All',
  MENTIONS = 'Mentions',
}

const LxpNotificationsOverview: FC = () => {
  const { data, isLoading, isError } = useGetUnreadNotificationsCount();
  const {
    data: learnCountData,
    isLoading: learnLoading,
    isError: learnError,
  } = useGetLearnUnreadNotificationsCount();
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const markReadMutation = useMutation(() => markAllNotificationsAsRead(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['unread-count']);
      queryClient.invalidateQueries(['get-notifications']);
    },
  });

  const learnMarkReadMutation = useMutation(
    () => markAllLearnNotificationsAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['unread-count']);
        queryClient.invalidateQueries(['get-notifications']);
      },
    },
  );

  const handleMarkAllAsRead = () => {
    if (activeTabIndex === 0) {
      learnMarkReadMutation.mutate();
    } else {
      markReadMutation.mutate();
    }
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
      tabContent: <LearnNotificationTab />,
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
      tabContent: (
        <NotificationsList key="All" className="max-h-96" ref={viewAllRef} />
      ),
      dataTestId: 'notifications-social',
    },
  ];
  return (
    <Popover
      triggerNode={
        <div className="font-bold flex flex-row justify-center items-center p-3 border-none relative">
          {!isLoading &&
            !learnLoading &&
            !isError &&
            !learnError &&
            data?.data?.result?.unread > 0 && (
              <div className="absolute rounded-full bg-red-600 border border-white text-white antialiased text-xs font-bold leading-4 top-2 right-2.5 flex w-4 h-4 items-center justify-center">
                {/* Get unread notif count here */}
                {(data.data.result.unread +
                  learnCountData?.data?.result?.data?.notification_count >
                10
                  ? '9+'
                  : data.data.result.unread +
                    learnCountData?.data?.result?.data?.notification_count) ||
                  ''}
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
            LXp Notifications
          </p>
          {/* Mark all as read */}
          {!!data?.data.result.unread && (
            <div className="flex items-center gap-1 text-sm">
              <p
                onClick={handleMarkAllAsRead}
                role="button"
                title="mark all as read"
                tabIndex={0}
                onKeyUp={(e) =>
                  e.code === 'Enter' ? markReadMutation.mutate() : ''
                }
                className="text-primary-500 cursor-pointer"
              >
                Mark all as read
              </p>
              <span className="text-gray-300">|</span>
              <p className="text-primary-500  cursor-pointer">Settings </p>
            </div>
          )}
        </div>
        {/* Content */}
        <Divider />
        <Tabs
          tabs={notifTabs}
          tabContentClassName=""
          className="flex justify-start gap-x-1 px-4 border-b-1 border-neutral-200 w-full "
          itemSpacing={4}
          onTabChange={(index) => setActiveTabIndex(index)}
        />
        <Divider />
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? 'text-primary-500' : 'text-neutral-500'
          }
        >
          <div
            className="  rounded-5xl bg-white text-sm font-normal flex items-center justify-center py-4 "
            onClick={() => viewAllRef.current?.click()}
            data-testid="notifications-view-all"
          >
            <p className="text-neutral-900 font-bold text-base cursor-pointer">
              View All
            </p>
          </div>
        </NavLink>
      </Card>
    </Popover>
  );
};

export default LxpNotificationsOverview;
