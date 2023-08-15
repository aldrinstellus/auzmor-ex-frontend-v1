import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import useModal from 'hooks/useModal';
import React, { ReactNode } from 'react';
import Footer from './components/Footer';
import EntitySearchBodyModal from './components/EntitySearchModalBody';
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
  entityRenderer?: (data: IGetUser) => ReactNode;
  onSubmit?: () => void;
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
  title = 'Add team members',
  entityType = EntitySearchModalType.Member,
  onSubmit = () => {},
  onCancel = () => {},
  submitButtonText = 'Next',
  entityRenderer = (data: any) => <></>,
}) => {
  const [open, openModal, closeModal] = useModal(true);
  const { control, watch, handleSubmit, setValue, resetField } =
    useForm<IMemberForm>({
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
          onBackIconClick={() => console.log('back clicked')}
          onClose={closeModal}
        />
        <EntitySearchBodyModal
          entityType={EntitySearchModalType.Member}
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
          submitButtonText={submitButtonText}
        />
      </form>
    </Modal>
  );
};

export default EntitySearchModal;
