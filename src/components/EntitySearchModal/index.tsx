import Modal from 'components/Modal';
import useModal from 'hooks/useModal';
import React, { ReactNode } from 'react';

enum EntityType {
  Member = 'MEMBER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
}

interface IEntitySearchModalProps {
  title: string;
  submitButtonText: string;
  entityType: EntityType;
  entityRenderer: () => ReactNode;
  onSubmit: () => void;
}

const EntitySearchModal: React.FC<IEntitySearchModalProps> = () => {
  const [open, openModal, closeModal] = useModal();
  return (
    <Modal open={open} closeModal={closeModal}>
      {' '}
      Modal
    </Modal>
  );
};

export default EntitySearchModal;
