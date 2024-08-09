import { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { IPost, updatePost } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: IPost;
};

const ClosePollModal: FC<AppProps> = ({ open, closeModal, data }) => {
  const { t } = useTranslation('post', { keyPrefix: 'closePollModal' });
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);

  const closePollMutation = useMutation({
    mutationKey: ['closePoll', data.id],
    mutationFn: (payload: any) => updatePost(payload.id || '', payload),
    onMutate: (variables) => {
      const previousPost = getPost(variables.id!);
      updateFeed(variables.id!, variables);
      closeModal();
      return { previousPost };
    },
    onError: (error, variables, context) => {
      failureToastConfig({
        content: t('errorClosingPoll'),
        dataTestId: 'poll-close-toaster-failure',
      });
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
    onSuccess: () =>
      successToastConfig({
        content: t('pollClosedSuccessfully'),
        dataTestId: 'poll-close-toaster-success',
      }),
  });

  return (
    <Modal open={open} className="w-max overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <p className="font-extrabold text-lg text-gray-900">
          {t('modalTitle')}
        </p>
        <Icon
          name="close"
          onClick={closeModal}
          size={16}
          color="text-neutral-900"
          dataTestId="close-poll-closemodal"
        />
      </div>
      <Divider />
      <div className="flex flex-col gap-y-4 items-center justify-center text-neutral-900 text-base px-6 py-4">
        <Icon
          name="warningCircle"
          size={80}
          color="text-red-500"
          hover={false}
        />
        <p className="text-center">
          {t('confirmationMessage')} <br />
          {t('cannotBeUndone')}
        </p>
      </div>
      <div className="flex min-w-full items-center justify-end gap-x-3 p-4 bg-blue-50 rounded-b-9xl">
        <Button
          variant={Variant.Secondary}
          label={t('cancelButton')}
          onClick={closeModal}
          dataTestId="close-poll-cancel"
        />
        <Button
          variant={Variant.Primary}
          label={t('closePollButton')}
          onClick={() => {
            const payload = {
              ...data,
              pollContext: {
                ...data.pollContext,
                closedAt: new Date().toISOString(),
              },
            };
            closePollMutation.mutate(payload);
          }}
          className="!bg-red-500 !text-white"
          loading={closePollMutation.isLoading}
          dataTestId="close-poll-accept"
        />
      </div>
    </Modal>
  );
};

export default ClosePollModal;
