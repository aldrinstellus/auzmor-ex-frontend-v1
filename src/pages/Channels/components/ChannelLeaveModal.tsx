import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Button, {
  Size,
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import Modal from 'components/Modal';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useNavigate from 'hooks/useNavigation';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export interface ILeaveChannelModalProps {
  isOpen: boolean;
  closeModal: () => void;
  channelId: string;
}

const LeaveChannelModal: FC<ILeaveChannelModalProps> = ({
  isOpen,
  closeModal,
  channelId,
}) => {
  const { t } = useTranslation('channels', {
    keyPrefix: 'leaveChannelModal',
  });
  const { getApi } = usePermissions();
  const navigate = useNavigate();
  const leaveChannel = getApi(ApiEnum.LeaveChannel);
  const leaveChannelMutation = useMutation({
    mutationKey: ['leave-channel-member', channelId],
    mutationFn: (id: string) => leaveChannel(id),
    onError: () => failureToastConfig({ content: t('errorToast') }),
    onSuccess: () => {
      closeModal();
      successToastConfig({ content: t('successToast') });
      queryClient.invalidateQueries(['channel-requests'], { exact: false });
      queryClient.invalidateQueries(['channel-members'], { exact: false });
      queryClient.invalidateQueries({ queryKey: ['channel'] });
      navigate('/channels');
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
        dataTestId="leave-channel-close"
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
        dataTestId="leave-channel-cancel"
        onClick={closeModal}
        autofocus
      />
      <Button
        label={t('leaveButton')}
        variant={ButtonVariant.Danger}
        loading={leaveChannelMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="leave-channel-cta"
        onClick={() => leaveChannelMutation.mutate(channelId)}
      />
    </div>
  );

  return (
    <Modal open={isOpen} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        {t('confirmationMessage')}
      </div>
      <Footer />
    </Modal>
  );
};

export default LeaveChannelModal;
