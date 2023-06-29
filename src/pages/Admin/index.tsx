import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import SSOSettings from 'components/SSOSettings';
import React, { ReactNode, useState } from 'react';
interface IAdminProps {}

interface ISetting {
  label: string;
  icon: string;
  key: string;
  component: ReactNode;
  disabled: boolean;
  hidden: boolean;
  dataTestId?: string;
}

const Admin: React.FC<IAdminProps> = () => {
  const settings = [
    {
      label: 'General',
      icon: 'gear',
      key: 'general-settings',
      component: <div>General Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-general',
    },
    {
      label: 'User Management',
      icon: 'userManagement',
      key: 'user-management-settings',
      component: <div>User Management Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-user-management',
    },
    {
      label: 'Branding',
      icon: 'branding',
      key: 'branding-settings',
      component: <div>Branding Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-branding',
    },
    {
      label: 'Single Sign-on',
      icon: 'link',
      key: 'single-sign-on-settings',
      component: <SSOSettings />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-sso',
    },
    {
      label: 'Marketplace',
      icon: 'marketplace',
      key: 'marketplace-settings',
      component: <div>Marketplace Settings Page</div>,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-marketplace',
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
    settings[3],
  );

  return (
    <div
      className="flex justify-between w-full gap-x-14"
      data-testid="admin-settings"
    >
      <Card
        className="min-w-[300px] max-h-[400px]"
        dataTestId="admin-settings-controls"
      >
        <p className="text-neutral-900 text-base font-bold p-4">
          Admin Settings
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
      <div className="flex flex-col w-full gap-y-4">
        <Card className="max-h-14 text-neutral-900 text-base font-bold py-4 pl-6">
          {activeSettingsPage.label}
        </Card>
        {activeSettingsPage.component}
      </div>
    </div>
  );
};

export default Admin;
