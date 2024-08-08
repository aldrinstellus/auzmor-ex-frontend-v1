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
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { FC } from 'react';
import { removeChannelMember } from 'queries/channel';
import queryClient from 'utils/queryClient';
import { useTranslation } from 'react-i18next';

export interface IDeletePeopleProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  userId: string;
  channelId: any;
}

const RemoveChannelMember: FC<IDeletePeopleProps> = ({
  open,
  channelId,
  closeModal,
  userId,
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'removeChannelMember' });

  const deleteChannelMemberMutation = useMutation({
    mutationKey: ['delete-channel-member'],
    mutationFn: (payload: any) =>
      removeChannelMember(payload?.channelId, payload?.userId),
    onError: () => {
      failureToastConfig({
        content: t('errorToast'),
        dataTestId: 'people-toaster',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channel-members']);
      queryClient.invalidateQueries(['channel']);
      closeModal();
      successToastConfig({
        content: t('successToast'),
        dataTestId: 'people-toaster',
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
        loading={deleteChannelMemberMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-user-delete"
        onClick={() =>
          deleteChannelMemberMutation.mutate({ channelId, userId })
        }
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

export default RemoveChannelMember;
