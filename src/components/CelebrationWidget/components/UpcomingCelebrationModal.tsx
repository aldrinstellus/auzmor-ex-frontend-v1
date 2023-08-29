import React from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { CELEBRATION_TYPE } from '..';
import Button, { Size, Variant } from 'components/Button';
import User from './User';

interface UpcomingCelebrationModalProps {
  open: boolean;
  closeModal: () => void;
  type: CELEBRATION_TYPE;
}

const UpcomingCelebrationModal: React.FC<UpcomingCelebrationModalProps> = ({
  open,
  closeModal,
  type,
}) => {
  const modalTitle =
    type === CELEBRATION_TYPE.Birthday
      ? 'Upcoming birthdays 🎂'
      : 'Upcoming work anniversaries 🎉';
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[648px]">
      <Header title={modalTitle} onClose={closeModal} />
      <div className="max-h-[390px] overflow-y-auto px-6 w-full divide-y divide-neutral-200">
        <div className="py-4">
          <User type={type} hideSendWishBtn />
        </div>
        <div className="py-4">
          <User type={type} hideSendWishBtn />
        </div>
        <div className="py-4">
          <User type={type} hideSendWishBtn />
        </div>
        <div className="py-4">
          <User type={type} hideSendWishBtn />
        </div>
        <div className="py-4">
          <User type={type} hideSendWishBtn />
        </div>
        <div className="py-4">
          <User type={type} hideSendWishBtn />
        </div>
      </div>
      <div className="flex justify-end items-center h-16 px-6 py-4 bg-blue-50 rounded-b-9xl">
        <Button
          label="Close"
          variant={Variant.Secondary}
          size={Size.Small}
          className="py-[7px]"
          onClick={closeModal}
        />
      </div>
    </Modal>
  );
};

export default UpcomingCelebrationModal;
