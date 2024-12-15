import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Button, {
  Size,
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';

import useNavigate from 'hooks/useNavigation';
import { FC } from 'react';
import { IChannel } from 'stores/channelStore';
import { useTranslation } from 'react-i18next';
import Truncate from 'components/Truncate';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
export interface IDeleteChannelModalProps {
  isOpen: boolean;
  closeModal: () => void;
  channelData: IChannel;
}

const DeleteChannelModal: FC<IDeleteChannelModalProps> = ({
  isOpen,
  closeModal,
  channelData,
}) => {
  const { getApi } = usePermissions();
  const navigate = useNavigate();
  const { t } = useTranslation('channels');
  const deleteChannel = getApi(ApiEnum.DeleteChannel);
  const deleteChannelMutation = useMutation({
    mutationKey: ['delete-channel', channelData.id],
    mutationFn: (id: string) => deleteChannel(id),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error) => {
      failureToastConfig({
        content: t('deleteChannelModal.failureToast'),
        dataTestId: 'channel-toaster-message',
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data, variables, context) => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      successToastConfig({
        content: t('deleteChannelModal.successToast'),
        dataTestId: 'channel-toaster-message',
      });

      navigate('/channels');
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center justify-between">
      <div className="text-lg text-black p-4 font-extrabold flex">
        {t('deleteChannelModal.delete')}&nbsp;
        <Truncate
          text={t('deleteChannelModal.title', { name: channelData.name })}
          className="text-primary-500 max-w-56"
        />
        ?
      </div>
      <IconButton
        onClick={closeModal}
        icon={'close'}
        dataTestId="delete-channel-close"
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
        label={t('deleteChannelModal.closeButton')}
        dataTestId="delete-channel-cancel"
        onClick={closeModal}
      />
      <Button
        label={t('deleteChannelModal.deleteButton')}
        className="!bg-red-500 !text-white flex"
        loading={deleteChannelMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-channel-cta"
        onClick={() => deleteChannelMutation.mutate(channelData.id)}
      />
    </div>
  );
  return (
    <Modal open={isOpen} className="max-w-max">
      <Header />
      <div className="flex flex-col items-center text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        <Icon
          name="warningCircle"
          size={80}
          color="text-red-500"
          className="mb-4"
        />
        <p className="flex">
          {t('deleteChannelModal.confirmationMessage')}&nbsp;
          <Truncate text={channelData.name} className="max-w-24" /> &nbsp;
          {t('channel')}?
        </p>
        <p>{t('deleteChannelModal.undoMessage')}</p>
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteChannelModal;
