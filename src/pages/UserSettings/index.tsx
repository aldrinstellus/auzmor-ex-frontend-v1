import { ReactNode, useEffect, useState } from 'react';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import AccountSecurity from './components/AccountSecurity';
import clsx from 'clsx';
import BasicSettings from './components/BasicSettings';
import NotificationSettings from './components/NotificationSettings';
import useURLParams from 'hooks/useURLParams';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from 'hooks/usePageTitle';

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
  usePageTitle('settings');
  const { t } = useTranslation('userSetting');
  const settings = [
    {
      label: t('basic-setting'),
      icon: 'gear',
      key: 'basic',
      component: <BasicSettings />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-basic-settings',
    },
    {
      label: t('notifications.title'),
      icon: 'notification',
      key: 'notifications',
      component: <NotificationSettings />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-notifications',
    },
    {
      label: t('integration'),
      icon: 'integration',
      key: 'integration',
      component: <div>{t('integration')}</div>,
      disabled: true,
      hidden: true,
      dataTestId: 'settings-profile',
    },
    {
      label: t('sign-in-security.title'),
      icon: 'security',
      key: 'security',
      component: <AccountSecurity />,
      disabled: false,
      hidden: false,
      dataTestId: 'settings-account-security',
    },
  ].filter((item) => !item.hidden);
  const { updateParam, searchParams } = useURLParams();
  const [activeSettingsPage, setActiveSettingsPage] = useState<ISetting>(
    settings[0],
  );

  const parsedTab = searchParams.get('tab');

  useEffect(() => {
    const parsedTabIndex = settings.findIndex((item) => item.key === parsedTab);
    if (parsedTabIndex !== -1) setActiveSettingsPage(settings[parsedTabIndex]);
  }, [parsedTab]);

  return (
    <div
      className="flex justify-between w-full gap-x-14"
      data-testid="admin-settings"
    >
      <Card className="w-[25%] h-full" dataTestId="admin-settings-controls">
        <p className="text-neutral-900 text-base font-bold p-4">{t('title')}</p>
        <Divider className="border-neutral-500" />
        <div className="flex flex-col">
          {settings.map((item, index) => (
            <div
              key={item.key}
              className={clsx(
                'hover:bg-primary-50 cursor-pointer bg-white',
                {
                  '!bg-primary-50': item.key === activeSettingsPage.key,
                },
                { '!bg-gray-100 !cursor-not-allowed': item.disabled },
                { 'rounded-b-9xl': index === settings.length - 1 },
              )}
              onClick={() => {
                if (item.disabled) return;
                setActiveSettingsPage(item);
                updateParam('tab', item.key, true);
              }}
              data-testid={item.dataTestId}
            >
              <div
                className={`${
                  item.key === activeSettingsPage.key
                    ? 'text-primary-500'
                    : 'text-neutral-900'
                } text-sm font-medium p-4 flex items-center gap-x-3`}
              >
                <Icon
                  name={item.icon}
                  color={
                    item.key === activeSettingsPage.key
                      ? 'text-primary-500'
                      : undefined
                  }
                />
                {item.label}
              </div>
              {index !== settings.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card>
      <div className="w-[75%]">{activeSettingsPage.component}</div>
    </div>
  );
};

export default UserSettings;
