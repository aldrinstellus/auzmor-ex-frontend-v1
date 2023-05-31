import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Spinner from 'components/Spinner';
import Popover from 'components/Popover';
import { useGetUnreadNotificationsCount } from 'queries/notifications';
import Tabs from 'components/Tabs';
import NotificationsList from './components/NotificationsList';

export enum NotificationType {
  ALL = 'All',
  MENTIONS = 'Mentions',
}

const NotificationsOverview: React.FC = () => {
  const { data, isLoading, isError } = useGetUnreadNotificationsCount();

  const notifTabs = [
    {
      tabLable: (isActive: boolean) => (
        <p
          className={`font-bold text-sm pb-2 ${
            isActive ? 'text-neutral-900' : 'text-neutral-500'
          }`}
        >
          All
        </p>
      ),
      tabContent: <NotificationsList key="All" className="max-h-96" />,
    },
    {
      tabLable: (isActive: boolean) => (
        <p
          className={`font-bold text-sm pb-2 ${
            isActive ? 'text-neutral-900' : 'text-neutral-500'
          }`}
        >
          Mentions
        </p>
      ),
      tabContent: (
        <NotificationsList
          key="Mentions"
          mentions={true}
          className="max-h-96"
        />
      ),
    },
  ];

  return (
    <Popover
      triggerNode={
        <div className="font-bold flex flex-row justify-center items-center p-1 gap-4 border-none relative">
          {!isLoading && !isError && data?.data?.result?.unread > 0 && (
            <div className="absolute rounded-full bg-red-600 text-white text-xxs -top-1 -right-1.5 flex w-4 h-4 items-center justify-center">
              {/* Get unread notif count here */}
              {(data.data.result.unread > 10
                ? '9+'
                : data.data.result.unread) || ''}
            </div>
          )}
          {isLoading && (
            <Spinner
              className="absolute -top-1 -right-1.5 w-3 h-3 border-2"
              color="#dc2626"
            />
          )}

          <Icon name="notification" size={26} disabled={true} />
        </div>
      }
    >
      <Card className="absolute w-[500px] right-0 top-6 ">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-gray-900 font-extrabold text-base">
            Notifications
          </p>
          {/* Mark all as read */}
          {/* <div className="flex items-center gap-x-1 cursor-pointer">
            <Icon name="checkbox" stroke="#059669" size={18} />
            <p className="text-primary-600 font-bold text-sm">
              Mark all as read
            </p>
          </div> */}
        </div>
        {/* Content */}
        <Divider />
        <Tabs
          tabs={notifTabs}
          tabContentClassName=""
          className="flex justify-start gap-x-1 px-4 border-b-1 border border-neutral-200"
          itemSpacing={4}
        />
        <Divider />
        <div className="px-6 bg-blue-100 text-sm font-normal flex items-center justify-start py-4 rounded-b-9xl">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? 'text-primary-500' : 'text-neutral-500'
            }
          >
            <p className="text-neutral-900 font-bold text-base cursor-pointer">
              View All
            </p>
          </NavLink>
        </div>
      </Card>
    </Popover>
  );
};

export default NotificationsOverview;
