import { ReactNode, useState } from 'react';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import AccountSecurity from './components/AccountSecurity';
import clsx from 'clsx';
import BasicSettings from './components/BasicSettings';
import NotificationSettings from './components/NotificationSettings';

interface ISetting {
  label: string;
  icon: string;
  key: string;
  component: ReactNode;
  disabled: boolean;
  hidden: boolean;
  dataTestId?: string;
}

const UserSettings = () => {
  const [_, setIsHeaderVisible] = useState(false);

  const settings = [
    {
      label: 'Basic Settings',
      icon: 'gear',
      key: 'basic-settings',
      component: <BasicSettings />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-basic-settings',
    },
    {
      label: 'Notifications',
      icon: 'notification',
      key: 'notifications-settings',
      component: <NotificationSettings />,
      disabled: true,
      hidden: true,
      dataTestId: 'settings-notifications',
    },
    {
      label: 'Integration',
      icon: 'integration',
      key: 'integration-settings',
      component: <div>Integration</div>,
      disabled: true,
      hidden: true,
      dataTestId: 'settings-profile',
    },
    {
      label: 'Sign in & Security',
      icon: 'security',
      key: 'account-security-settings',
      component: <AccountSecurity setIsHeaderVisible={setIsHeaderVisible} />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-account-security',
    },
  ];

  const visibleSettings = settings.filter((item) => !item.hidden);

  const [activeSettingsPage, setActiveSettingsPage] = useState<ISetting>(
    visibleSettings[0],
  );

  return (
    <div
      className="flex justify-between w-full gap-x-14"
      data-testid="admin-settings"
    >
      <Card className="w-[25%] h-full" dataTestId="admin-settings-controls">
        <p className="text-neutral-900 text-base font-bold p-4">
          User Settings
        </p>
        <Divider className="border-neutral-500" />
        <div className="flex flex-col">
          {visibleSettings.map((item, index) => (
            <div
              key={item.key}
              className={clsx(
                'hover:bg-primary-50 cursor-pointer bg-white',
                {
                  '!bg-primary-50': item.key === activeSettingsPage.key,
                },
                { '!bg-gray-100 !cursor-not-allowed': item.disabled },
                { 'rounded-b-9xl': index === visibleSettings.length - 1 },
              )}
              onClick={() => !item.disabled && setActiveSettingsPage(item)}
              data-testid={item.dataTestId}
            >
              <div
                className={`${
                  item.key === activeSettingsPage.key
                    ? 'text-neutral-900'
                    : 'text-neutral-500'
                } text-sm font-medium p-4 flex items-center gap-x-3`}
              >
                <Icon
                  name={item.icon}
                  color={
                    item.key === activeSettingsPage.key
                      ? 'text-neutral-900'
                      : undefined
                  }
                />
                {item.label}
              </div>
              {index !== visibleSettings.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>
      <div className="w-[75%]">{activeSettingsPage.component}</div>
    </div>
  );
};

export default UserSettings;
