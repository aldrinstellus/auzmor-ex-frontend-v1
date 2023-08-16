import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import useModal from 'hooks/useModal';
import React, { ReactNode } from 'react';
import Footer from './components/Footer';
import EntitySearchBodyModal from './components/EntitySearchModalBody';
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
  entityRenderer?: (data: IGetUser) => ReactNode;
  onSubmit?: (ids: string[]) => void;
  onCancel?: () => void;
}

export interface IMemberForm {
  memberSearch: string;
  department: { value: string; label: string };
  location: { value: string; label: string };
  selectAll: boolean;
  showSelectedMembers: boolean;
}

const EntitySearchModal: React.FC<IEntitySearchModalProps> = ({
  open,
  openModal,
  closeModal,
  onBackPress,
  title = 'Add team members',
  entityType = EntitySearchModalType.User,
  onSubmit = () => {},
  onCancel = () => {},
  submitButtonText = 'Next',
  cancelButtonText = 'Back',
  entityRenderer = (data: any) => <></>,
}) => {
  const { control, watch, handleSubmit, setValue, resetField } =
    useForm<IMemberForm>({
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
          onBackIconClick={() => {
            closeModal();
            onBackPress && onBackPress();
          }}
          onClose={closeModal}
        />
        <EntitySearchBodyModal
          entityType={EntitySearchModalType.User}
          control={control}
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
