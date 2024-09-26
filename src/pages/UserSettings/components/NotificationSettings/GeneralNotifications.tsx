import Accordion from 'components/Accordion';
import queryClient from 'utils/queryClient';
import NotificationSettingsList from './NotificationSettingsList';
import {
  INotificationSettings,
  IUserSettings,
  updateUserSettings,
} from 'queries/users';
import useAuth from 'hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const GeneralNotifications = () => {
  const { t } = useTranslation('userSetting', { keyPrefix: 'notifications' });
  const { user, updateUser } = useAuth();

  const updateMutation = useMutation({
    mutationKey: ['update-user-settings'],
    mutationFn: (data: IUserSettings) => updateUserSettings(data),
  });

  const { notificationSettings } = user || {};

  const handleChange = (
    updatedNotificationSettings: INotificationSettings,
    reset: () => void,
  ) => {
    updateMutation.mutate(
      { notificationSettings: updatedNotificationSettings },
      {
        onError: reset,
        onSuccess: async () => {
          await queryClient.invalidateQueries(['current-user-me']);
          updateUser({
            notificationSettings: updatedNotificationSettings,
          });
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <Accordion
        title={t('posts')}
        dataTestId="posts-notifications"
        content={
          <NotificationSettingsList
            settingsKey="post"
            isLoading={updateMutation.isLoading}
            data={notificationSettings}
            onChange={handleChange}
          />
        }
      />
      <Accordion
        title="Mentions"
        dataTestId="mentions-notifications"
        content={
          <NotificationSettingsList
            settingsKey="mentions"
            isLoading={updateMutation.isLoading}
            data={notificationSettings}
            onChange={handleChange}
          />
        }
      />
    </div>
  );
};

export default GeneralNotifications;
