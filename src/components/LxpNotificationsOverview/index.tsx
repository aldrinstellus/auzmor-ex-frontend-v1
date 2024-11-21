import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { FC, useRef, useState } from 'react';
import Spinner from 'components/Spinner';
import Popover from 'components/Popover';
import Tabs from 'components/Tabs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { NavLink } from 'react-router-dom';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getLearnUrl } from 'utils/misc';
import { useTranslation } from 'react-i18next';
import Notifications from './components/Notifications';
import useRole from 'hooks/useRole';

const LxpNotificationsOverview: FC = () => {
  const { isAdmin } = useRole();
  const { t } = useTranslation('notifications');
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
    (category: string) => markAllNotificationsAsRead({ category }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['unread-count']);
        queryClient.invalidateQueries(['get-notifications']);
        queryClient.invalidateQueries(['get-learner-notifications']);
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
          className={`font-semibold text-[13px] w-[53px] text-center ${
            isActive
              ? 'text-neutral-900'
              : 'text-neutral-500 group-hover:text-neutral-900 group-focus:text-neutral-900'
          }`}
        >
          {t('learn')}
        </p>
      ),
      tabContent: <Notifications isSocial={false} ref={viewAllRef} />,
      dataTestId: 'learn-notification',
    },
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <p
          className={`font-bold text-[13px] w-[53px] text-center ${
            isActive
              ? 'text-neutral-900'
              : 'text-neutral-500 group-hover:text-neutral-900 group-focus:text-neutral-900'
          }`}
        >
          {t('social')}
        </p>
      ),
      tabContent: <Notifications isSocial={true} ref={viewAllRef} />,
      dataTestId: 'social-notification',
    },
  ];
  const notificationCountData = data?.data?.result?.data;
  // notification field
  const notificationField = isAdmin
    ? 'notification_count'
    : 'notification_learners_count';
  const notificationCount =
    notificationCountData?.[notificationField] +
    notificationCountData?.lxp_notifications_count;
  return (
    <Popover
      triggerNode={
        <div className="font-bold flex flex-row justify-center items-center border-none relative px-[13px] py-[9px] hover:bg-neutral-100 rounded-md cursor-pointer outline-none">
          {!isLoading && !isError && notificationCount > 0 && (
            <div
              className="absolute text-[8px] tracking-[0.3px] 
             h-[15px] min-w-[15px] 
            font-semibold font-lato text-light opacity-100
             no-underline rounded-full bg-primary-500 border border-white text-white 
               leading-[10px] p-[3px] top-1 right-2.5 flex  items-center justify-center"
            >
              {notificationCount > 99
                ? t('notificationCount')
                : notificationCount || ''}
            </div>
          )}
          {isLoading && (
            <Spinner className="absolute top-1 right-2.5 fill-primary-500 !w-4 !h-4 !m-0" />
          )}

          <Icon
            name="notification"
            size={23}
            dataTestId="office-notification-page"
            ariaLabel="notifications"
            hover={false}
          />
        </div>
      }
      ref={viewAllRef}
      triggerNodeClassName="outline-none"
    >
      <Card className="fixed w-[390px] min-h-[100px] max-h-[482px] right-0 border border-neutral-200 !rounded-[10px]">
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between">
          <p className="text-gray-900 font-extrabold text-[13px]">
            {t('notifications')}
          </p>
          {/* Mark all as read */}
          <div className="flex items-center gap-1 text-sm font-normal">
            <p
              onClick={handleMarkAllAsRead}
              role="button"
              title="mark all as read"
              tabIndex={0}
              onKeyUp={(e) =>
                e.code === 'Enter' ? markReadMutation.mutate(category) : ''
              }
              data-testid="notifications-mark-all-read"
              className="text-primary-500 cursor-pointer text-xs"
            >
              {t('markAsRead')}
            </p>
            <span className="text-gray-300">|</span>
            <p
              onClick={() =>
                window.location.assign(
                  `${getLearnUrl()}/settings/notifications`,
                )
              }
              data-testid="notification-setting"
              className="text-primary-500  cursor-pointer text-xs"
            >
              {t('settings')}{' '}
            </p>
          </div>
        </div>
        {/* Content */}
        <Divider />
        <Tabs
          tabs={notifTabs}
          tabContentClassName=""
          tabSwitcherClassName="!py-1 text-[13px]"
          underlineOffset={2}
          className="flex justify-start gap-x-1 px-2 border-b-1 border-neutral-200 w-full h-10"
          onTabChange={(index) => setActiveTabIndex(index)}
        />
      </Card>
    </Popover>
  );
};

export default LxpNotificationsOverview;
