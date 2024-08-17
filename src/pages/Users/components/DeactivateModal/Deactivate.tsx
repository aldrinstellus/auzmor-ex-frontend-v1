import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { UserStatus, updateStatus } from 'queries/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface IReactivatePeopleProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  userId: string;
}

const DeactivatePeople: FC<IReactivatePeopleProps> = ({
  open,
  closeModal,
  userId,
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'deactivateModal' });
  const queryClient = useQueryClient();

  const updateUserStatusMutation = useMutation({
    mutationFn: updateStatus,
    mutationKey: ['update-user-status'],
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['feed'], { exact: false });
      queryClient.invalidateQueries(['feed-announcements-widget']);
      queryClient.invalidateQueries(['post-announcements-widget']);
      queryClient.invalidateQueries(['bookmarks']);
      queryClient.invalidateQueries(['scheduledPosts']);
      queryClient.invalidateQueries(['posts'], { exact: false });
      queryClient.invalidateQueries(['comments'], { exact: false });
      queryClient.invalidateQueries(['team-members']);
      queryClient.invalidateQueries(['organization-chart'], { exact: false });
      queryClient.invalidateQueries(['celebrations'], { exact: false });
      successToastConfig({ content: t('successToast') });
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        {t('title')}
      </div>
      <IconButton
        onClick={closeModal}
        icon={'close'}
        dataTestId="deactivate-user-close"
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
        dataTestId="cancel-cta"
        onClick={closeModal}
      />
      <Button
        label={t('deactivateButton')}
        className="bg-primary-500 !text-white flex"
        loading={updateUserStatusMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="Deactivate"
        onClick={() => {
          updateUserStatusMutation.mutate({
            id: userId,
            status: UserStatus.Inactive,
          });
          closeModal();
        }}
      />
    </div>
  );
  return (
    <Modal
      open={open}
      className="max-w-md"
      dataTestId="deactivate-confirm-modal"
    >
      <Header />
      <div className="text-sm font-medium text-[#171717] mx-4 mt-3 mb-4">
        {t('confirmMessage')}
        <br />
        {t('confirmMessage2')}
      </div>
      <Footer />
    </Modal>
  );
};

export default DeactivatePeople;
