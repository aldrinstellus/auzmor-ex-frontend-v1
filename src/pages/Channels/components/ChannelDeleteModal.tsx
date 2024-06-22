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
import SuccessToast from 'components/Toast/variants/SuccessToast';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { IChannel } from 'stores/channelStore';
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
  const deleteChannelMutation = useMutation({
    mutationKey: ['delete-channel', channelData.id],
    mutationFn: (id: string) => deleteChannel(id),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (error) => {
      toast(<FailureToast content="Error deleting channel" dataTestId="" />, {
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
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data, variables, context) => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      toast(
        <SuccessToast
          content="Channel has been deleted successfully"
          dataTestId="channel-toaster-message"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
              dataTestId="channel-toaster-close"
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
          theme: 'dark',
        },
      );
      navigate('/channels');
    },
  });

  const Header: FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Delete <span className="text-primary-500">@{channelData.name}</span>?
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
        label={'Cancel'}
        dataTestId="delete-channel-cancel"
        onClick={closeModal}
      />
      <Button
        label={'Delete'}
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
        <p>Are you sure you want to delete the {channelData.name} channel?</p>
        <p>This cannot be undone.</p>
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteChannelModal;
