import React, { ReactNode, useState } from 'react';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import AccountSecurity from './AccountSecurity';
import clsx from 'clsx';
interface IUserSettingsProps {}

interface ISetting {
  label: string;
  icon: string;
  key: string;
  component: ReactNode;
  disabled: boolean;
  hidden: boolean;
  dataTestId?: string;
}

const UserSettings: React.FC<IUserSettingsProps> = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const settings = [
    {
      label: 'My Settings',
      icon: 'gear',
      key: 'my-settings',
      component: <div>My Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-my-settings',
    },
    {
      label: 'General',
      icon: 'userManagement',
      key: 'user-management-settings',
      component: <div>General Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-general',
    },
    {
      label: 'Profile Settings',
      icon: 'branding',
      key: 'branding-settings',
      component: <div>Profile Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-profile',
    },
    {
      label: 'Out of Office',
      icon: 'link',
      key: 'single-sign-on-settings',
      component: <div>Out of Office Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-out-of-office',
    },
    {
      label: 'Account',
      icon: 'marketplace',
      key: 'marketplace-settings',
      component: <div>Account Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-account',
    },
    {
      label: 'Account Security',
      icon: 'notification',
      key: 'account-security-settings',
      component: <AccountSecurity setIsHeaderVisible={setIsHeaderVisible} />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-account-security',
    },
    {
      label: 'Notifications',
      icon: 'notification',
      key: 'notifications-settings',
      component: <div>Notifications Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-notifications',
    },
  ];

  const [activeSettingsPage, setActiveSettingsPage] = useState<ISetting>(
    settings[0],
  );

  const componentStyle = clsx({
    'border-1 border-neutral-100 p-6 rounded-3xl w-[100%]': !isHeaderVisible,
  });

  return (
    <div
      className="flex justify-between w-full gap-x-14"
      data-testid="admin-settings"
    >
      <Card
        className="w-[25%] max-h-[400px]"
        dataTestId="admin-settings-controls"
      >
        <p className="text-neutral-900 text-base font-bold p-4">
          User Settings
        </p>
        <Divider className="border-neutral-500" />
        <div className="flex flex-col">
          {settings.map((item, index) => (
            <div
              key={item.key}
              className={`hover:bg-primary-50 cursor-pointer ${
                item.key === activeSettingsPage.key
                  ? 'bg-primary-50'
                  : 'bg-white'
              }`}
              onClick={() => setActiveSettingsPage(item)}
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
                  hover={false}
                  stroke={
                    item.key === activeSettingsPage.key ? '#171717' : undefined
                  }
                />
                {item.label}
              </div>
              {index !== settings.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>
      <div className="flex flex-col w-[75%] gap-y-4">
        <Card className="py-4 px-6 space-y-4">
          {!isHeaderVisible && (
            <>
              <div className="text-neutral-900 text-base font-bold">
                {activeSettingsPage.label}
              </div>
              <Divider />
            </>
          )}
          <div className={componentStyle}>{activeSettingsPage.component}</div>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
