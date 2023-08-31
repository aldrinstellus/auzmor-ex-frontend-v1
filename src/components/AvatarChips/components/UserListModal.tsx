import React from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { IAvatarUser } from 'components/AvatarChip';
import UserRow from './UserRow';

export interface IUserListModalProps {
  open: boolean;
  closeModal: () => void;
  users: IAvatarUser[];
  dataTestId?: string;
}

const UserListModal: React.FC<IUserListModalProps> = ({
  open,
  closeModal,
  users,
  dataTestId,
}) => {
  return (
    <Modal
      open={open}
      closeModal={close}
      className="max-w-[638px]"
      dataTestId={`${dataTestId}modal`}
    >
      <Header
        title="Shoutout to:"
        onClose={() => closeModal()}
        closeBtnDataTestId={`${dataTestId}closemodal`}
      />
      <div className="w-full p-4 pt-0 max-h-[490px] min-h-[490px] overflow-y-auto">
        {users.map((user, index) => (
          <div
            key={user.userId}
            className={`py-3 w-full ${
              index !== users.length - 1 && 'border-b-1 border-neutral-100'
            }`}
          >
            <UserRow user={user} dataTestId={dataTestId} />
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Close"
          variant={ButtonVariant.Secondary}
          onClick={closeModal}
          dataTestId={`${dataTestId}closecta`}
        />
      </div>
    </Modal>
  );
};

export default UserListModal;
