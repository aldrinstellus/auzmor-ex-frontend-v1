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
import useNavigate from 'hooks/useNavigation';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IDeleteTeamProps {
  open: boolean;
  closeModal: () => void;
  teamId: string;
  isDetailPage?: boolean;
}

const DeleteTeam: FC<IDeleteTeamProps> = ({
  open,
  closeModal,
  teamId,
  isDetailPage,
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'deleteTeam' });
  const { getApi } = usePermissions();
  const navigate = useNavigate();

  const deleteTeam = getApi(ApiEnum.DeleteTeam);
  const deleteTeamMutation = useMutation({
    mutationKey: ['delete-team', teamId],
    mutationFn: (id: string) => deleteTeam(id),
    onError: () => failureToastConfig({ content: t('errorToast') }),
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      successToastConfig({
        content: t('successToast'),
        dataTestId: 'team-toaster-message',
      });
      if (isDetailPage) navigate('/teams');
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
        dataTestId="delete-team-close"
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
        dataTestId="delete-team-cancel"
        onClick={closeModal}
      />
      <Button
        label={t('deleteButton')}
        className="!bg-red-500 !text-white flex"
        loading={deleteTeamMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-team-cta"
        onClick={() => deleteTeamMutation.mutate(teamId)}
      />
    </div>
  );

  return (
    <Modal open={open} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        {t('confirmMessage')}
        <br />
        {t('undoMessage')}
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteTeam;
