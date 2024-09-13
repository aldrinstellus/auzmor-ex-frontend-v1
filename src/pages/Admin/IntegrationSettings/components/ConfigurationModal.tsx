import Modal from 'components/Modal';
import React, { FC } from 'react';
import Header from 'components/ModalHeader';
import Button, { Variant } from 'components/Button';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import { IntegrationConfig } from '..';

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

  return (
    <Modal open={open} className="max-w-[600px] max-h-[600px]">
      <Header
        title={
          <div className="flex items-center gap-1">
            <Icon name={integration?.iconName} className="w-8 h-8" />
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
                {lastSync
                  ? t('lastSync', { date: lastSync })
                  : t('notSyncedYet')}
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
          leftIcon="minusCircle"
          label={t('removeIntegration')}
          variant={Variant.Secondary}
          onClick={() => {
            handleRemoveIntegration();
            closeModal();
          }}
          className="border-0 !bg-transparent !px-0 !py-1 group"
          labelClassName="text-base font-bold text-neutral-800 hover:text-primary-500 group-hover:text-primary-500 group-focus:text-primary-500"
          leftIconHover={false}
          leftIconSize={20}
        />
      </div>
    </Modal>
  );
};

export default ConfigurationModal;
