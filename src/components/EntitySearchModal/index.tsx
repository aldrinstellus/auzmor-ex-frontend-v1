import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import useModal from 'hooks/useModal';
import React, { ReactNode, useEffect } from 'react';
import Footer from './components/Footer';
import EntitySearchModalBody from './components/EntitySearchModalBody';
import { useForm } from 'react-hook-form';
import { IGetUser } from 'queries/users';

export enum EntitySearchModalType {
  Member = 'MEMBER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
}

interface IEntitySearchModalProps {
  title?: string;
  submitButtonText?: string;
  entityType?: EntitySearchModalType;
  selectedMemberIds?: string[];
  entityRenderer?: (data: IGetUser) => ReactNode;
  onSubmit?: (data: string[]) => void;
  onCancel?: () => void;
}

export interface IAudienceForm {
  memberSearch: string;
  teamSearch: string;
  channelSearch: string;
  department: { value: string; label: string };
  location: { value: string; label: string };
  selectAll: boolean;
  showSelectedMembers: boolean;
  privacy: { value: string; label: string };
  category: { value: string; label: string };
  teams: any;
  channels: any;
  users: any;
}

const EntitySearchModal: React.FC<IEntitySearchModalProps> = ({
  title = 'Add team members',
  entityType = EntitySearchModalType.Member,
  onSubmit = () => {},
  onCancel = () => {},
  submitButtonText = 'Next',
  entityRenderer = (data: any) => <></>,
  selectedMemberIds,
}) => {
  const [open, openModal, closeModal] = useModal(true);
  const { control, watch, handleSubmit, setValue, resetField } = useForm<any>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
    },
  });
  return (
    <Modal open={open} closeModal={closeModal}>
      <form>
        <Header
          title={title || ''}
          onBackIconClick={() => {}}
          onClose={closeModal}
        />
        <EntitySearchModalBody
          entityType={EntitySearchModalType.Member}
          control={control}
          selectedMemberIds={selectedMemberIds}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          entityRenderer={entityRenderer}
        />
        <Footer
          handleSubmit={handleSubmit}
          entityType={entityType}
          onSubmit={onSubmit}
          onCancel={onCancel}
          submitButtonText={submitButtonText}
        />
      </form>
    </Modal>
  );
};

export default EntitySearchModal;
