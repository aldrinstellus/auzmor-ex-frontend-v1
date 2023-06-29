import React from 'react';
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
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { deleteComment } from 'queries/comments';
import { useCommentStore } from 'stores/commentStore';
import _ from 'lodash';
import { useFeedStore } from 'stores/feedStore';
import { produce } from 'immer';

export interface IDeleteCommentModalProps {
  showModal: boolean;
  closedModal: () => void;
  commentId: string;
}

const DeleteCommentModal: React.FC<IDeleteCommentModalProps> = ({
  showModal,
  closedModal = () => {},
  commentId,
}) => {
  const { comment, setComment } = useCommentStore();
  const { feed, updateFeed } = useFeedStore();
  const deleteCommentMutation = useMutation({
    mutationKey: ['delete-comment-mutation'],
    mutationFn: deleteComment,
    onMutate: (variables) => {
      const previousData = comment;
      updateFeed(
        feed[comment[variables].entityId].id!,
        produce(feed[comment[variables].entityId], (draft) => {
          draft.commentsCount = draft.commentsCount - 1;
        }),
      );
      setComment({ ..._.omit(comment, [variables]) });
      return { previousData };
    },
    onError: (error: any) => {
      toast(
        <FailureToast
          content="Error deleting comment"
          dataTestId="comment-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
        },
      );
    },
    onSuccess: () => {
      toast(
        <SuccessToast
          content="Comment has been deleted"
          dataTestId="comment-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
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
        },
      );
    },
  });

  const Header: React.FC = () => (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        Delete Comment?
      </div>
      <IconButton
        onClick={() => {
          closedModal();
        }}
        icon={'close'}
        dataTestId="delete-comment-close"
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );

  const Footer: React.FC = () => (
    <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        dataTestId="delete-user-cancel"
        onClick={() => {
          closedModal();
        }}
      />
      <Button
        label={'Delete'}
        className="!bg-red-500 !text-white flex"
        loading={deleteCommentMutation.isLoading}
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="delete-user-delete"
        onClick={() => deleteCommentMutation.mutate(commentId)}
      />
    </div>
  );
  return (
    <Modal open={showModal} className="max-w-sm">
      <Header />
      <div className="text-sm font-medium text-neutral-500 mx-6 mt-6 mb-8">
        Are you sure you want to delete this comment?
        <br /> This cannot be undone.
      </div>
      <Footer />
    </Modal>
  );
};

export default DeleteCommentModal;
