import Card from 'components/Card';
import Tabs from 'components/Tabs';
import React from 'react';
import GeneralSetting from './GeneralSettings';
import clsx from 'clsx';
import ChannelSetting from './ChannelSettings';
import { useNotificationSettings } from 'queries/users';

const NotificationSettings = () => {
  const { data, isLoading } = useNotificationSettings();

  return (
    <div className="space-y-4">
      <Card className="!px-6 !py-4">
        <div className="flex justify-between items-center">
          <div className="text-neutral-900 text-base font-bold">
            Notifications
          </div>
        </div>
        <div className="mt-6 text-sm font-bold pb-3 border-b-2 border-primary-500 max-w-min">
          General&nbsp;Notifications
        </div>
        <div className="mt-3 text-sm text-neutral-500">
          Manage your Channel notifications per channel
        </div>
      </Card>
      <GeneralSetting />
    </div>
  );
};

export default NotificationSettings;
