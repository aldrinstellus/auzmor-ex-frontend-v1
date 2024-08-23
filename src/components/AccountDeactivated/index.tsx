import Icon from 'components/Icon';
import Modal from 'components/Modal';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AccountDeactivated = () => {
  const { t } = useTranslation('components', {
    keyPrefix: 'AccountDeactivated',
  });

  return (
    <>
      <Modal open className="max-w-md">
        <div className="p-4">
          <div className="flex items-center space-x-1">
            <Icon name="info" size={28} />
            <div className="text-lg font-bold text-neutral-900">
              {t('title')}
            </div>
          </div>
          <div className="mt-4 text-sm text-neutral-900">{t('message')}</div>
        </div>
      </Modal>
    </>
  );
};

export default AccountDeactivated;
