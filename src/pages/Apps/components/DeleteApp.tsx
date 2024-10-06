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
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IDeleteAppProps {
  open: boolean;
  closeModal: (param?: any) => void;
  appId: string;
}

const DeleteApp: FC<IDeleteAppProps> = ({ open, closeModal, appId }) => {
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'deleteAppModal',
  });
  const { getApi } = usePermissions();

  const deleteApp = getApi(ApiEnum.DeleteApp);
  const deleteAppMutation = useMutation({
    mutationKey: ['delete-app', appId],
    mutationFn: (id: string) => deleteApp(id),
    onError: (_error) => {
      closeModal(true);
      failureToastConfig({
        content: t('errorDeletingApp'),
        dataTestId: 'delete-app-error-toaster',
      });
    },
    onSuccess: (_data, _variables, _context) => {
      closeModal(true);
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['my-apps'] });
      queryClient.invalidateQueries({ queryKey: ['my-featured-apps'] });
      queryClient.invalidateQueries({ queryKey: ['featured-apps'] });
      successToastConfig({
        content: t('appDeletedSuccess'),
        dataTestId: 'delete-app-toaster',
      });
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        {t('header')}
      </div>
      <IconButton
        onClick={() => closeModal()}
        icon={'close'}
        dataTestId="close-app-modal"
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
        label={t('cancel')}
        dataTestId="delete-app-cancel"
        onClick={() => closeModal()}
      />
      <Button
        label={t('delete')}
        className="!bg-red-500 !text-white flex"
        loading={deleteAppMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-app-delete"
        onClick={() => deleteAppMutation.mutate(appId)}
      />
    </div>
  );

  return (
    <Modal open={open} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        {t('confirmationMessage')} <br />
        {t('confirmationMessage2')}
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteApp;
