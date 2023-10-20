import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import ErrorWarningPng from 'images/error-warning-line.png';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { IPost, IPostPayload, updatePost } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { FC } from 'react';

interface PublishPostModalProps {
  post: IPost;
  closeModal?: () => void;
}

const PublishPostModal: FC<PublishPostModalProps> = ({ closeModal, post }) => {
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
      toast(
        <FailureToast
          content="Error updating post"
          dataTestId="post-update-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: twConfig.theme.colors.neutral[900],
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: async () => {
      toast(
        <SuccessToast
          content="Post updated successfully"
          dataTestId="post-update-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: twConfig.theme.colors.neutral[900],
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });
  return (
    <Modal open={true} closeModal={closeModal} className="max-w-sm">
      <Header
        title="Publish right now?"
        onClose={closeModal}
        closeBtnDataTestId="publishnow-closemodal"
      />
      <div className="px-6 py-4">
        <div className="flex justify-center mb-4">
          <img src={ErrorWarningPng} />
        </div>
        <div className="justify-center w-full flex text-sm">
          Are you sure you want to publish post now?
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
        <div className="flex">
          <Button
            variant={ButtonVariant.Secondary}
            label="Cancel"
            className="mr-3"
            dataTestId="publishnow-cancelcta"
            onClick={closeModal}
          />
          <Button
            label={'Post now'}
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
