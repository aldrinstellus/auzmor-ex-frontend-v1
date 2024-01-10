import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { FC, ReactNode, useEffect } from 'react';
import Footer from './components/Footer';
import EntitySearchModalBody from './components/EntitySearchModalBody';
import { useForm } from 'react-hook-form';
import { IGetUser } from 'queries/users';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';

export enum EntitySearchModalType {
  User = 'USER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
}

type ApiCallFunction = (queryParams: any) => any;

interface IEntitySearchModalProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  onBackPress?: () => void;
  title?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  entityType?: EntitySearchModalType;
  dataTestId?: string;
  selectedMemberIds?: string[];
  entityRenderer?: (data: IGetUser) => ReactNode;
  onSubmit?: (data: string[]) => void;
  onCancel?: () => void;
  disableKey?: string;
  fetchUsers?: ApiCallFunction;
  usersQueryParams?: Record<string, any>;
}

export interface IAudienceForm {
  memberSearch: string;
  teamSearch: string;
  channelSearch: string;
  departmentSearch: string;
  departments: Record<string, boolean | undefined>;
  locationSearch: string;
  locations: Record<string, boolean | undefined>;
  designationSearch: string;
  designations: Record<string, boolean | undefined>;
  selectAll: boolean;
  showSelectedMembers: boolean;
  privacy: { value: string; label: string };
  categorySearch: string;
  categories: Record<string, boolean | undefined>;
  teams: any;
  channels: any;
  users: Record<string, IGetUser | false>;
}

const EntitySearchModal: FC<IEntitySearchModalProps> = ({
  open,
  closeModal,
  title = 'Add team members',
  entityType = EntitySearchModalType.User,
  dataTestId = 'add-members',
  onSubmit = () => {},
  onCancel = () => {},
  submitButtonText = 'Next',
  cancelButtonText = 'Back',
  entityRenderer = (_data: any) => <></>,
  selectedMemberIds = [],
  disableKey,
  fetchUsers,
  usersQueryParams,
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
    <Modal open={open} className="max-w-[638px]">
      <form onSubmit={(e) => e.preventDefault()}>
        <Header
          title={title || ''}
          onBackIconClick={() => {}}
          closeBtnDataTestId={`${dataTestId}-close`}
          onClose={closeModal}
        />
        <EntitySearchModalBody
          entityType={EntitySearchModalType.User}
          selectedMemberIds={selectedMemberIds}
          entityRenderer={entityRenderer}
          dataTestId={dataTestId}
          disableKey={disableKey}
          fetchUsers={fetchUsers}
          usersQueryParams={usersQueryParams}
        />
        <Footer
          handleSubmit={form.handleSubmit}
          entityType={entityType}
          dataTestId={dataTestId}
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
