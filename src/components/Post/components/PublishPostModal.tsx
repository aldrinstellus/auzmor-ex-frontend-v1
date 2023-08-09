import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';
import ErrorWarningPng from 'images/error-warning-line.png';
import Button, { Variant as ButtonVariant } from 'components/Button';

interface PublishPostModalProps {
  closeModal?: () => void;
}

const PublishPostModal: React.FC<PublishPostModalProps> = ({ closeModal }) => {
  return (
    <Modal open={true} closeModal={closeModal} className="max-w-sm">
      <Header title="Publish right now?" onClose={closeModal} />
      <div className="px-6 py-4">
        <div className="flex justify-center mb-4">
          <img src={ErrorWarningPng} />
        </div>
        <div className="justify-center w-full flex text-sm">
          Are you sure you want to publish post now?
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
        <div className="flex">
          <Button
            variant={ButtonVariant.Secondary}
            label="Cancel"
            className="mr-3"
            dataTestId="schedule-post-backcta"
          />
          <Button label={'Post now'} dataTestId="schedule-post-next-cta" />
        </div>
      </div>
    </Modal>
  );
};

export default PublishPostModal;
