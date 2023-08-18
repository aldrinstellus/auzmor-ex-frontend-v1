import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import useModal from 'hooks/useModal';
import React, { ReactNode, useEffect } from 'react';
import Footer from './components/Footer';
import EntitySearchModalBody from './components/EntitySearchModalBody';
import { useForm } from 'react-hook-form';
import { IGetUser } from 'queries/users';

export enum EntitySearchModalType {
  User = 'USER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
}

interface IEntitySearchModalProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  onBackPress?: () => void;
  title?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
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
  open,
  closeModal,
  title = 'Add team members',
  entityType = EntitySearchModalType.User,
  onSubmit = () => {},
  onCancel = () => {},
  submitButtonText = 'Next',
  cancelButtonText = 'Back',
  entityRenderer = (data: any) => <></>,
  selectedMemberIds,
}) => {
  const { control, watch, handleSubmit, setValue, resetField } = useForm<any>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
    },
  });
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <form>
        <Header
          title={title || ''}
          onBackIconClick={() => {}}
          onClose={closeModal}
        />
        <EntitySearchModalBody
          entityType={EntitySearchModalType.User}
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
          cancelButtonText={cancelButtonText}
          submitButtonText={submitButtonText}
        />
      </form>
    </Modal>
  );
};

export default EntitySearchModal;
