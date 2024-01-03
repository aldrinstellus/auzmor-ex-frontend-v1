import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import { FC, ReactElement } from 'react';
import NotificationBell from 'images/bell.png';
import { useNavigate } from 'react-router-dom';

const NotificationSettingsCard: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col p-4 gap-y-4 items-center max-w-sm">
      <p className="text-neutral-900 font-bold text-base">
        Manage your notifications
      </p>
      <img src={NotificationBell} height={150} width={150} />
      <Button
        variant={Variant.Secondary}
        label="View notification settings"
        onClick={() => {
          navigate('/settings?tab=notifications');
        }}
        className="!px-6 !py-2"
      />
    </Card>
  );
};

export default NotificationSettingsCard;
