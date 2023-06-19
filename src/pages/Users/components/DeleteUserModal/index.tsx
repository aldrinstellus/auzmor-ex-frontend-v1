import React from 'react';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { deleteUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
export interface IDeleteUserModalProps {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  userId: string;
}

const DeleteUserModal: React.FC<IDeleteUserModalProps> = ({
  showModal,
  setShowModal,
  userId,
}) => {
  const deleteUserMutation = useMutation({
    mutationKey: ['delete-user', userId],
    mutationFn: deleteUser,
    onError: (error) => {
      console.log(error);
      toast(
        <FailureToast
          content="Error deleting member"
          dataTestId="people-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
        },
      );
    },
    onSuccess: (data, variables, context) => {
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast(
        <SuccessToast
          content="Member has been deleted"
          dataTestId="people-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
        },
      );
    },
  });

  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Delete User?
      </div>
      <IconButton
        onClick={() => {
          setShowModal(false);
        }}
        icon={'close'}
        dataTestId="delete-user-close"
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );
  const Footer: React.FC = () => (
    <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        dataTestId="delete-user-cancel"
        onClick={() => {
          setShowModal(false);
        }}
      />
      <Button
        label={'Delete'}
        className="!bg-red-500 !text-white flex"
        loading={deleteUserMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-user-delete"
        onClick={() => deleteUserMutation.mutate(userId)}
      />
    </div>
  );
  return (
    <Modal
      open={showModal}
      // closeModal={() => {
      //   setShowModal(false);
      // }}
      className="max-w-sm"
    >
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        Are you sure you want to delete this member?
        <br /> This cannot be undone.
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteUserModal;
