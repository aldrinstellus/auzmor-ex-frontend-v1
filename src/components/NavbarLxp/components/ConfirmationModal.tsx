import Button, { Variant as ButtonVariant } from 'components/Button';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
  open: boolean;
  closeModal: () => void;
  onClick: () => void;
}
const ConfirmationModal: FC<ConfirmationModalProps> = ({
  open,
  closeModal,
  onClick,
}) => {
  const { t } = useTranslation('navbar', { keyPrefix: 'learn' });

  return (
    <Modal open={open} className="max-w-[638px] h-[200px] ">
      <Header className="!border-b-0" title={''} onClose={closeModal} />
      <div className="flex items-center justify-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[22px] font-medium leading-tight text-gray-900 font-lato tracking-[0.39px]">
            {t('confirmationMsg')}
          </h2>
        </div>
      </div>

      <div className="flex justify-center items-center h-16 p-6  rounded-b-lg">
        <div className="flex gap-3">
          <Button label={t('accept')} onClick={onClick} className="w-40" />
          <Button
            label={t('cancel')}
            variant={ButtonVariant.Secondary}
            onClick={closeModal}
            className="w-30"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
