import { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { updatePost } from 'queries/post';
import ErrorWarningPng from 'images/error-warning-line.png';
import { useFeedStore } from 'stores/feedStore';
import { produce } from 'immer';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: Record<string, any>;
};

const ChangeToRegularPostModal: FC<AppProps> = ({ open, closeModal, data }) => {
  const { t } = useTranslation('post', {
    keyPrefix: 'changeToRegularPostModal',
  });
  const queryClient = useQueryClient();
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);

  const removeAnnouncementMutation = useMutation({
    mutationKey: ['removeAnnouncementMutation', data.id],
    mutationFn: (payload: any) => updatePost(payload.id || '', payload),
    onMutate: (variables) => {
      const previousPost = getPost(variables.id);
      updateFeed(
        variables.id!,
        produce(getPost(variables.id), (draft) => {
          (draft.announcement = { end: '' }), (draft.isAnnouncement = false);
        }),
      );
      closeModal();
      return { previousPost };
    },
    onError: (error, variables, context) => {
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
      successToastConfig({
        content: t('successToast'),
        dataTestId: 'convert-to-post-toast',
      });
    },
  });

  return (
    <Modal open={open} className="w-max overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <p className="font-bold text-lg text-gray-900">{t('modalTitle')}</p>
        <Icon
          name="close"
          onClick={closeModal}
          size={16}
          dataTestId="changeto-regularpost-closemodal"
        />
      </div>
      <Divider />
      <div className="flex flex-col gap-y-4 items-center justify-center text-neutral-900 text-base p-6">
        <div className="flex justify-center">
          <img
            src={ErrorWarningPng}
            width={80}
            height={80}
            alt={t('warningImageAlt')}
          />
        </div>
        <p className="font-semibold">{t('confirmationMessage')}</p>
        <p>{t('changeBackInfo')}</p>
      </div>
      <div className="flex min-w-full items-center justify-end gap-x-3 p-4 bg-blue-50 rounded-b-9xl">
        <Button
          variant={Variant.Secondary}
          label={t('cancelButton')}
          onClick={closeModal}
          dataTestId="changeto-regularpost-cancel"
        />
        <Button
          variant={Variant.Primary}
          label={t('confirmButton')}
          onClick={() => {
            const payload = {
              ...data,
              isAnnouncement: false,
              announcement: {
                end: '',
              },
            };
            removeAnnouncementMutation.mutate(payload);
          }}
          loading={removeAnnouncementMutation.isLoading}
          dataTestId="changeto-regularpost-accept"
        />
      </div>
    </Modal>
  );
};

export default ChangeToRegularPostModal;
