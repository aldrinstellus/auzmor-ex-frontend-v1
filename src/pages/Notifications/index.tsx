import UserCard from 'components/UserWidget';
import { FC, ReactElement, ReactNode, useState } from 'react';
import NotificationSettingsCard from './components/NotificationSettingsCard';
import Card from 'components/Card';
import Button, { Variant } from 'components/Button';
import NotificationsListing from './components/NotificationsListing';
import { useShouldRender } from 'hooks/useShouldRender';
import { usePageTitle } from 'hooks/usePageTitle';

enum NotificationType {
  ALL = 'ALL',
  MENTIONS = 'MENTIONS',
  CHANNELS = 'CHANNELS',
}

type NotificationButtonGroup = {
  label: string;
  type: NotificationType;
  component: ReactNode;
  disabled: boolean;
};

const buttonGroup = [
  {
    label: 'All',
    type: NotificationType.ALL,
    component: <NotificationsListing />,
    disabled: false,
  },
  {
    label: 'Mentions',
    type: NotificationType.MENTIONS,
    component: <NotificationsListing mentions />,
    disabled: false,
  },
];

const Notifications: FC = (): ReactElement => {
  usePageTitle('notifications');
  const [notificationsList, setNotificationsList] =
    useState<NotificationButtonGroup>(buttonGroup[0]);

  const shouldRender = useShouldRender('NotificationSettingsCard');

  return (
    <>
      <div className="mb-12 space-x-8 flex w-full">
        <div className="sticky top-10 z-10 w-[293px]">
          <UserCard />
        </div>
        <div className="flex-grow w-0">
          <Card className="p-6">
            <div className="flex flex-col">
              <h1 className="text-2xl text-neutral-900 font-bold">
                Notifications
              </h1>
              <div className="flex gap-x-3 pt-6">
                {buttonGroup.map((button, index) => (
                  <Button
                    label={button.label}
                    variant={Variant.Secondary}
                    key={button.type}
                    disabled={button.disabled}
                    onClick={() => setNotificationsList(buttonGroup[index])}
                    className={`${
                      notificationsList.type === button.type
                        ? '!text-primary-600'
                        : ''
                    } ${button.disabled ? 'cursor-not-allowed' : undefined}`}
                  />
                ))}
              </div>
            </div>
          </Card>
          <div className="mt-4">{notificationsList.component}</div>
        </div>
        {shouldRender && (
          <div className="w-[293px]">
            <NotificationSettingsCard />
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
