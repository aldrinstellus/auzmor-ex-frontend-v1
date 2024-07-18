import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { deleteChannel } from 'queries/channel';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';

import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { IChannel } from 'stores/channelStore';
import { useTranslation } from 'react-i18next';
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
  const navigate = useNavigate();
  const { t } = useTranslation('channels', { keyPrefix: 'deleteChannelModal' });
  const deleteChannelMutation = useMutation({
    mutationKey: ['delete-channel', channelData.id],
    mutationFn: (id: string) => deleteChannel(id),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error) => {
      failureToastConfig({
        content: t('failureToast'),
        dataTestId: 'channel-toaster-message',
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data, variables, context) => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      successToastConfig({
        content: t('successToast'),
        dataTestId: 'channel-toaster-message',
      });

      navigate('/channels');
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        {t('delete')}{' '}
        <span className="text-primary-500">
          {t('title', { name: channelData.name })}
        </span>
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
        label={t('closeButton')}
        dataTestId="delete-channel-cancel"
        onClick={closeModal}
      />
      <Button
        label={t('deleteButton')}
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
        <p>{t('confirmationMessage', { name: channelData.name })}</p>
        <p>{t('undoMessage')}</p>
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteChannelModal;
