import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { useMutation } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { FC } from 'react';
import { removeChannelMember } from 'queries/channel';
import queryClient from 'utils/queryClient';
export interface IDeletePeopleProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  userId: string;
  channelId: any;
}

const RemoveChannelMember: FC<IDeletePeopleProps> = ({
  open,
  // openModal,
  channelId,
  closeModal,
  userId,
}) => {
  const deleteChannelMemberMutation = useMutation({
    mutationKey: ['delete-channel-member'],
    mutationFn: (payload: any) =>
      removeChannelMember(payload?.channelId, payload?.userId),
    onError: () => {
      failureToastConfig({
        content: 'Error deleting member',
        dataTestId: 'people-toaster',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channel-members']);
      queryClient.invalidateQueries(['channel']);
      closeModal();
      successToastConfig({
        content: 'Member has been deleted',
        dataTestId: 'people-toaster',
      });
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Delete User?
      </div>
      <IconButton
        onClick={closeModal}
        icon={'close'}
        dataTestId="delete-user-close"
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );

  const Footer: FC = () => (
    <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        dataTestId="delete-user-cancel"
        onClick={closeModal}
      />
      <Button
        label={'Delete'}
        className="!bg-red-500 !text-white flex"
        loading={deleteChannelMemberMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-user-delete"
        onClick={() =>
          deleteChannelMemberMutation.mutate({ channelId, userId })
        }
      />
    </div>
  );
  return (
    <Modal open={open} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        Are you sure you want to delete this member?
        <br /> This cannot be undone.
      </div>
      <Footer />
    </Modal>
  );
};

export default RemoveChannelMember;
