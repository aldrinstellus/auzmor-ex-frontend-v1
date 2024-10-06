import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { UserStatus } from 'interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IReactivatePeopleProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  userId: string;
}

const ReactivatePeople: FC<IReactivatePeopleProps> = ({
  open,
  // openModal,
  closeModal,
  userId,
}) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('profile', { keyPrefix: 'reactivateModal' });
  const queryClient = useQueryClient();

  const updateUser = getApi(ApiEnum.UpdateUser);
  const updateUserStatusMutation = useMutation({
    mutationFn: (payload: { id: string; status: UserStatus }) =>
      updateUser(payload.id, { status: payload.status }),
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
        dataTestId="reactivate-user-close"
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
        label={t('reactivateButton')}
        className="bg-primary-500 !text-white flex"
        loading={updateUserStatusMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="Reactivate"
        onClick={() => {
          updateUserStatusMutation.mutate({
            id: userId,
            status: UserStatus.Active,
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
      dataTestId="reactivate-confirm-modal"
    >
      <Header />
      <div className="text-sm font-medium text-[#171717] mx-4 mt-3 mb-4">
        {t('confirmationText')} <br />
        {t('confirmationText2')}
      </div>
      <Footer />
    </Modal>
  );
};

export default ReactivatePeople;
