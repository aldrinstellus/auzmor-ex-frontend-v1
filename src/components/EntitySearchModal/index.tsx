import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { ReactNode, useEffect } from 'react';
import Footer from './components/Footer';
import EntitySearchModalBody from './components/EntitySearchModalBody';
import { useForm } from 'react-hook-form';
import { IGetUser } from 'queries/users';
import { ITeam } from 'queries/teams';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';

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
  departmentSearch: string;
  departments: Record<string, boolean | undefined>;
  locationSearch: string;
  locations: Record<string, boolean | undefined>;
  selectAll: boolean;
  showSelectedMembers: boolean;
  privacy: { value: string; label: string };
  categorySearch: string;
  categories: Record<string, boolean | undefined>;
  teams: any;
  channels: any;
  users: Record<string, IGetUser | false>;
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
  selectedMemberIds = [],
}) => {
  const audienceForm = useForm<any>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
      users: selectedMemberIds.reduce(
        (obj, value) => Object.assign(obj, { [value]: true }),
        {},
      ),
    },
  });

  const { form, setForm } = useEntitySearchFormStore();

  useEffect(() => {
    setForm(audienceForm);
    return () => setForm(null);
  }, []);
  return form ? (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <form>
        <Header
          title={title || ''}
          onBackIconClick={() => {}}
          onClose={closeModal}
        />
        <EntitySearchModalBody
          entityType={EntitySearchModalType.User}
          selectedMemberIds={selectedMemberIds}
          entityRenderer={entityRenderer}
        />
        <Footer
          handleSubmit={form.handleSubmit}
          entityType={entityType}
          onSubmit={onSubmit}
          onCancel={onCancel}
          cancelButtonText={cancelButtonText}
          submitButtonText={submitButtonText}
        />
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default EntitySearchModal;
