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
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { removeTeamMember } from 'queries/teams';
export interface IRemoveTeamMemberProps {
  open: boolean;
  closeModal: () => void;
  teamId: string;
  userId: string;
}

const RemoveTeamMember: React.FC<IRemoveTeamMemberProps> = ({
  open,
  closeModal,
  teamId,
  userId,
}) => {
  const onRemoveTeamMember = useMutation({
    mutationFn: removeTeamMember,
    mutationKey: ['remove-team-member'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      toast(<SuccessToast content={`Successfully removed one member`} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
    },
    onError: () => {
      closeModal();
      toast(
        <FailureToast
          content="Error removing the member"
          dataTestId="comment-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Remove user?
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

  const Footer: React.FC = () => (
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
        loading={onRemoveTeamMember.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-user-delete"
        onClick={() =>
          onRemoveTeamMember.mutate({
            teamId: teamId || '',
            params: { userIds: userId },
          })
        }
      />
    </div>
  );
  return (
    <Modal open={open} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        Are you sure you want to rremove this member from the team?
      </div>
      <Footer />
    </Modal>
  );
};

export default RemoveTeamMember;
