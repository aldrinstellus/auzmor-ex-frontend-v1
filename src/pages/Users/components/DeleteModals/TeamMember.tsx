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
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { removeTeamMember } from 'queries/teams';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface IRemoveTeamMemberProps {
  open: boolean;
  closeModal: () => void;
  teamId: string;
  userId: string;
}

const RemoveTeamMember: FC<IRemoveTeamMemberProps> = ({
  open,
  closeModal,
  teamId,
  userId,
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'removeTeamMember' });

  const onRemoveTeamMember = useMutation({
    mutationFn: removeTeamMember,
    mutationKey: ['remove-team-member'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team', teamId] });
      queryClient.invalidateQueries(['team-members'], {
        exact: false,
      });
      queryClient.invalidateQueries(['teams'], { exact: false });
      queryClient.invalidateQueries(['feed'], { exact: false });
      closeModal();
      successToastConfig({ content: t('successToast') });
    },
    onError: () => {
      closeModal();
      failureToastConfig({
        content: t('errorToast'),
        dataTestId: 'comment-toaster',
      });
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        {t('title')}
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
        label={t('cancelButton')}
        dataTestId="delete-user-cancel"
        onClick={closeModal}
      />
      <Button
        label={t('deleteButton')}
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
        {t('confirmMessage')}
      </div>
      <Footer />
    </Modal>
  );
};

export default RemoveTeamMember;
