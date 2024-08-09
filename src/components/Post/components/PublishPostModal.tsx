import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import ErrorWarningPng from 'images/error-warning-line.png';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { IPost, IPostPayload, updatePost } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

interface PublishPostModalProps {
  post: IPost;
  closeModal?: () => void;
}

const PublishPostModal: FC<PublishPostModalProps> = ({ closeModal, post }) => {
  const { t } = useTranslation('post', { keyPrefix: 'publishPostModal' });
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);

  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: IPostPayload) => updatePost(post.id || '', payload),
    onMutate: (variables) => {
      if (variables?.id) {
        const previousData = getPost(variables.id);
        updateFeed(variables.id, {
          ...getPost(variables.id),
          ...variables,
        } as IPost);
        closeModal && closeModal();
        return { previousData };
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousData && variables?.id) {
        updateFeed(variables.id, context?.previousData);
      }
      failureToastConfig({
        content: t('errorUpdatingPost'),
        dataTestId: 'post-update-toaster',
      });
    },
    onSuccess: async () =>
      successToastConfig({
        content: t('postUpdatedSuccessfully'),
        dataTestId: 'post-update-toaster',
      }),
  });

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-sm">
      <Header
        title={t('title')}
        onClose={closeModal}
        closeBtnDataTestId="publishnow-closemodal"
      />
      <div className="px-6 py-4">
        <div className="flex justify-center mb-4">
          <img src={ErrorWarningPng} alt={t('warningImageAlt')} />
        </div>
        <div className="justify-center w-full flex text-sm">
          {t('confirmationMessage')}
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
        <div className="flex">
          <Button
            variant={ButtonVariant.Secondary}
            label={t('cancelButton')}
            className="mr-3"
            dataTestId="publishnow-cancelcta"
            onClick={closeModal}
          />
          <Button
            label={t('postNowButton')}
            dataTestId="publishnow-postnowcta"
            onClick={() => {
              updatePostMutation.mutate({
                ...post,
                schedule: null,
              });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PublishPostModal;
