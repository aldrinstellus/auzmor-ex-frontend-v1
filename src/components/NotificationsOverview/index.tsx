import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { FC, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Spinner from 'components/Spinner';
import Popover from 'components/Popover';
import {
  markAllNotificationsAsRead,
  useGetUnreadNotificationsCount,
} from 'queries/notifications';
import Tabs from 'components/Tabs';
import NotificationsList from './components/NotificationsList';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export enum NotificationType {
  ALL = 'All',
  MENTIONS = 'Mentions',
}

const NotificationsOverview: FC = () => {
  const { data, isLoading, isError } = useGetUnreadNotificationsCount();
  const viewAllRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const markReadMutation = useMutation(() => markAllNotificationsAsRead(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['unread-count']);
      queryClient.invalidateQueries(['get-notifications']);
    },
  });

  const notifTabs = [
    {
      tabLabel: (isActive: boolean) => (
        <p
          className={`font-bold text-sm pb-2 w-[53px] text-center ${
            isActive ? 'text-neutral-900' : 'text-neutral-500'
          }`}
        >
          All
        </p>
      ),
      tabContent: (
        <NotificationsList key="All" className="max-h-96" ref={viewAllRef} />
      ),
      dataTestId: 'notifications-all',
    },
    {
      tabLabel: (isActive: boolean) => (
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
          ref={viewAllRef}
        />
      ),
      dataTestId: 'notifications-mentions',
    },
  ];
  console.log(data?.data?.result?.unread);
  return (
    <Popover
      triggerNode={
        <div className="font-bold flex flex-row justify-center items-center p-3 border-none relative">
          {!isLoading && !isError && data?.data?.result?.unread > 0 && (
            <div className="absolute rounded-full bg-red-600 border border-white text-white antialiased text-xs font-bold leading-4 top-2 right-2.5 flex w-4 h-4 items-center justify-center">
              {/* Get unread notif count here */}
              {(data.data.result.unread > 10
                ? '9+'
                : data.data.result.unread) || ''}
            </div>
          )}
          {isLoading && (
            <Spinner className="absolute top-1.5 right-2.5 fill-red-600 !w-4 !h-4 !m-0" />
          )}

          <Icon
            name="notification"
            size={25}
            dataTestId="office-notification-page"
          />
        </div>
      }
      ref={viewAllRef}
    >
      <Card className="absolute w-[455px] right-0 top-4 border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-gray-900 font-extrabold text-base">
            Notifications
          </p>
          {/* Mark all as read */}
          {!!data?.data.result.unread && (
            <div
              className="flex items-center gap-x-1 cursor-pointer"
              onClick={() => markReadMutation.mutate()}
            >
              <Icon
                name="checkboxOutline"
                color="!text-primary-600"
                size={18}
              />
              <p className="text-primary-600 font-bold text-sm cursor-pointer">
                Mark all as read
              </p>
            </div>
          )}
        </div>
        {/* Content */}
        <Divider />
        <Tabs
          tabs={notifTabs}
          tabContentClassName=""
          className="flex justify-start gap-x-1 px-4 border-b-1 border-neutral-200 w-full mb-2"
          itemSpacing={4}
        />
        <Divider />
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? 'text-primary-500' : 'text-neutral-500'
          }
        >
          <div
            className="px-6 bg-blue-100 text-sm font-normal flex items-center justify-start py-4 rounded-b-9xl"
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

export default NotificationsOverview;
