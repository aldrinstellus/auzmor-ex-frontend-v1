import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import React, { ReactElement } from 'react';

const NotificationSettingsCard: React.FC = (): ReactElement => {
  return (
    <Card className="flex flex-col p-6 gap-y-4">
      <p className="text-neutral-900 font-bold text-base">
        Manage your notifications
      </p>
      <Button
        variant={Variant.Secondary}
        label="View notification settings"
        disabled
      />
    </Card>
  );
};

export default NotificationSettingsCard;
