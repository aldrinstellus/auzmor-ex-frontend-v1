import { useMutation } from '@tanstack/react-query';
import Button, { Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { IPost, updatePost } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { FC } from 'react';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  data: IPost;
};

const ClosePollModal: FC<AppProps> = ({ open, closeModal, data }) => {
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
        content: 'Error closing poll',
        dataTestId: 'poll-close-toaster-failure',
      });
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
    onSuccess: () =>
      successToastConfig({
        content: 'Poll closed successfully',
        dataTestId: 'poll-close-toaster-success',
      }),
  });

  return (
    <Modal open={open} className="w-max overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <p className="font-extrabold text-lg text-gray-900">Close Poll?</p>
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
          Are you sure you want to close this poll right now? <br />
          This cannot be undone
        </p>
      </div>
      <div className="flex min-w-full items-center justify-end gap-x-3 p-4 bg-blue-50 rounded-b-9xl">
        <Button
          variant={Variant.Secondary}
          label="Cancel"
          onClick={closeModal}
          dataTestId="close-poll-cancel"
        />
        <Button
          variant={Variant.Primary}
          label="Close Poll"
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
