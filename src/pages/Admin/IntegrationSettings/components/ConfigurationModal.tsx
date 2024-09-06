import Modal from 'components/Modal';
import React, { FC } from 'react';
import Header from 'components/ModalHeader';
import Button, { Variant } from 'components/Button';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import { IntegrationConfig } from '..';
import { useCurrentTimezone } from './../../../../hooks/useCurrentTimezone';
import useAuth from 'hooks/useAuth';
import momentTz from 'moment-timezone';

interface ConfigurationModalProps {
  open: boolean;
  lastSync: string | null;
  closeModal: () => void;
  title: string;
  handleResync: () => void;
  resyncLoading?: boolean;
  handleRemoveIntegration: () => void;
  integration: IntegrationConfig;
}

const ConfigurationModal: FC<ConfigurationModalProps> = ({
  open,
  lastSync,
  closeModal,
  handleRemoveIntegration,
  handleResync,
  resyncLoading,
  integration,
}) => {
  const { t } = useTranslation('adminSetting', { keyPrefix: 'integration' });
  const { user } = useAuth();
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const formatedDate = lastSync
    ? momentTz().tz(userTimezone).format('DD MMM YYYY [at] hh:mm A')
    : t('notSyncedYet');

  return (
    <Modal open={open} className="max-w-[600px] max-h-[600px]">
      <Header
        title={
          <div className="flex items-center gap-1">
            <Icon name={integration?.iconName || ''} className="w-8 h-8" />
            {integration.title}
          </div>
        }
        onClose={closeModal}
      />
      <div className="px-6 pt-4 pb-10">
        <div className="flex flex-col gap-5">
          <div className="text-lg font-medium">{integration.dataSync}</div>
          <div className="text-sm font-medium">
            {integration.configDescription}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">
                {t('lastSync', { date: formatedDate })}
              </div>
              <div className="text-sm font-medium">
                {integration.configNote}
              </div>
            </div>
            <Button
              label={t('syncNow')}
              loading={resyncLoading}
              onClick={handleResync}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          leftIcon="minus"
          label={t('removeIntegration')}
          variant={Variant.Tertiary}
          onClick={handleRemoveIntegration}
          className="border-0 !bg-transparent !px-0 !py-1"
          labelClassName="text-neutral-500 hover:text-primary-500 group-hover:text-primary-500"
          iconColor="text-neutral-500"
          leftIconSize={20}
        />
        <div className="flex items-center">
          <Button
            label={t('cancel')}
            variant={Variant.Secondary}
            onClick={closeModal}
            className="mr-4"
          />
          <Button
            label={t('save')}
            variant={Variant.Primary}
            onClick={closeModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfigurationModal;
