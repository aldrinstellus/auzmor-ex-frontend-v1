import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import SSOSettings from 'pages/Admin/SSOSettings';
import { FC, useEffect, useState } from 'react';
import GeneralSettings from './GeneralSettings';
import BrandingSettings from './BrandingSettings';
import useURLParams from 'hooks/useURLParams';
import useRole from 'hooks/useRole';

const Admin: FC = () => {
  const { updateParam, searchParams } = useURLParams();
  const { isAdmin, isSuperAdmin } = useRole({ exact: true });
  const [activeSettingsIndex, setActiveSettingsIndex] = useState<number>(0);
  const parsedTab = searchParams.get('tab');
  const settings = [
    {
      label: 'General settings',
      icon: 'gearOutline',
      key: 'general-settings',
      component: <GeneralSettings />,
      disabled: false,
      hidden: false,
      hideDefaultLabelCard: false,
      dataTestId: 'adminsettings-generalsetting',
      allowOnlySuperAdmin: true,
    },
    {
      label: 'User Management',
      icon: 'userManagement',
      key: 'user-management-settings',
      component: <div>User Management Settings Page</div>,
      disabled: false,
      hidden: true,
      hideDefaultLabelCard: false,
      dataTestId: 'settings-user-management',
      allowOnlySuperAdmin: false,
    },
    {
      label: 'Branding',
      icon: 'branding',
      key: 'branding-settings',
      component: <BrandingSettings />,
      disabled: false,
      hidden: false,
      hideDefaultLabelCard: true,
      dataTestId: 'generalsettings-branding',
      allowOnlySuperAdmin: true,
    },
    {
      label: 'Single Sign-on',
      icon: 'link',
      key: 'single-sign-on-settings',
      component: <SSOSettings />,
      disabled: false,
      hidden: false,
      hideDefaultLabelCard: false,
      dataTestId: 'settings-sso',
      allowOnlySuperAdmin: false,
    },
    {
      label: 'Marketplace',
      icon: 'marketplace',
      key: 'marketplace-settings',
      component: <div>Marketplace Settings Page</div>,
      disabled: false,
      hidden: true,
      hideDefaultLabelCard: false,
      dataTestId: 'settings-marketplace',
      allowOnlySuperAdmin: false,
    },
    {
      label: 'Notifications',
      icon: 'notification',
      key: 'notifications-settings',
      component: <div>Notifications Settings Page</div>,
      disabled: false,
      hidden: true,
      hideDefaultLabelCard: false,
      dataTestId: 'settings-notifications',
      allowOnlySuperAdmin: false,
    },
  ].filter(
    (item) =>
      !item.hidden && (isSuperAdmin || (isAdmin && !item.allowOnlySuperAdmin)),
  );

  useEffect(() => {
    const parsedTabIndex = settings.findIndex((item) => item.key === parsedTab);
    if (parsedTabIndex !== -1) {
      setActiveSettingsIndex(parsedTabIndex);
    } else {
      updateParam('tab', settings[0].key, true);
    }
  }, [parsedTab]);

  return (
    <div
      className="flex justify-between w-full gap-x-14"
      data-testid="admin-settings"
    >
      <Card
        className="min-w-[300px] h-full"
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
                item.key === settings[activeSettingsIndex].key
                  ? 'bg-primary-50'
                  : 'bg-white'
              } ${index === settings.length - 1 ? 'rounded-b-9xl' : ''}`}
              onClick={() => {
                setActiveSettingsIndex(index);
                updateParam('tab', item.key, true);
              }}
              data-testid={item.dataTestId}
            >
              <div
                className={`${
                  item.key === settings[activeSettingsIndex].key
                    ? 'text-primary-500'
                    : 'text-neutral-900'
                } text-sm font-medium p-4 flex items-center gap-x-3`}
              >
                <Icon
                  name={item.icon}
                  isActive={settings[activeSettingsIndex].key === item.key}
                />
                {item.label}
              </div>
              {index !== settings.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>
      <div className="flex flex-col w-full gap-y-4">
        {!!!settings[activeSettingsIndex]?.hideDefaultLabelCard && (
          <Card className="text-neutral-900 text-base font-bold p-6">
            {settings[activeSettingsIndex].label}
          </Card>
        )}
        {settings[activeSettingsIndex].component}
      </div>
    </div>
  );
};

export default Admin;
