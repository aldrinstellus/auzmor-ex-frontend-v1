import Card from 'components/Card';
import GeneralNotifications from './GeneralNotifications';
import { useTranslation } from 'react-i18next';

const NotificationSettings = () => {
  const { t } = useTranslation('userSetting', { keyPrefix: 'notifications' });

  return (
    <div className="space-y-4">
      <Card className="!px-6 !py-4">
        <div className="flex justify-between items-center">
          <div className="text-neutral-900 text-base font-bold">
            {t('title')}
          </div>
        </div>
        <div className="mt-3 text-sm text-neutral-500">{t('description')}</div>
        {/* <div
          className="mt-6 text-sm font-bold pb-3 border-b-2 border-primary-500 max-w-min"
          data-testid="general-notifications"
        >
          General&nbsp;Notifications
        </div>
        <div className="mt-3 text-sm text-neutral-500">
          Manage your notifications
        </div> */}
      </Card>
      <GeneralNotifications />
    </div>
  );
};

export default NotificationSettings;
