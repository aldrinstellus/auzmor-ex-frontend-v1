import React, { useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Avatar from 'components/Avatar';
import { deleteComment } from 'queries/comments';
import { useMutation } from '@tanstack/react-query';
import Popover from 'components/Popover';
import clsx from 'clsx';
import queryClient from 'utils/queryClient';
import { humanizeTime } from 'utils/time';
import { iconsStyle } from 'components/Post';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import ReactionModal from 'components/Post/components/ReactionModal';
import { IReactionsCount } from 'queries/post';
import RenderQuillContent from 'components/RenderQuillContent';
import { useCommentStore } from 'stores/commentStore';
import _ from 'lodash';
import { IComment } from 'components/Comments';
import { twConfig } from 'utils/misc';
import { produce } from 'immer';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import ConfirmationBox from 'components/ConfirmationBox';
import useModal from 'hooks/useModal';
import {
  CommentsRTE,
  PostCommentMode,
} from 'components/Comments/components/CommentsRTE';

interface ReplyProps {
  comment: IComment;
  className?: string;
}

export const Reply: React.FC<ReplyProps> = ({ comment, className }) => {
  const { user } = useAuth();
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [editReply, setEditReply] = useState<boolean>(false);
  const { comment: storedComments, setComment } = useCommentStore();

  const deleteReplyMutation = useMutation({
    mutationKey: ['delete-reply-comment-mutation'],
    mutationFn: deleteComment,
    onMutate: (variables) => {
      const previousData = comment;
      const updatedComment = produce(
        storedComments[storedComments[variables].entityId],
        (draft) => {
          draft.repliesCount = draft.repliesCount - 1;
        },
      );
      setComment({
        ..._.omit(storedComments, [variables]),
        [storedComments[variables].entityId]: { ...updatedComment },
      });
      closeConfirm();
      return { previousData };
    },
    onError: (error: any) => {
      toast(
        <FailureToast
          content="Error deleting reply"
          dataTestId="reply-toaster"
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
          content="Reply has been deleted"
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

  const menuItemStyle = clsx({
    ' flex flex-row items-center py-3 px-6 gap-2.5 border-b text-sm hover:bg-primary-50 cursor-pointer ':
      true,
  });

  const totalCount = Object.values(comment?.reactionsCount || {}).reduce(
    (total, count) => total + count,
    0,
  );

  return (
    <div>
      <div className={`flex flex-col space-y-4 mt-4`}>
        <div className="bg-neutral-100 p-3 rounded-9xl">
          <div className="flex justify-between p-0">
            <div className="flex">
              <div className="mr-4">
                <Avatar
                  name={comment?.createdBy?.fullName}
                  size={32}
                  image={comment?.createdBy?.profileImage?.original}
                />
              </div>
              <div className="flex flex-col items-start p-0 w-64">
                <div className="text-neutral-900 font-bold text-sm">
                  {comment?.createdBy?.fullName}
                </div>
                <div className="font-normal text-neutral-500 text-sm ">
                  {comment?.createdBy?.designation}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-start">
              <div className="text-neutral-500 font-normal text-xs">
                {humanizeTime(comment.createdAt)}
              </div>
              {user?.id === comment.createdBy.userId && (
                <div className="ml-4">
                  <Popover
                    triggerNode={
                      <IconButton
                        icon={'more'}
                        className="!p-0 !bg-inherit"
                        variant={IconVariant.Primary}
                        dataTestId="comment-reply-ecllipsis"
                      />
                    }
                    className="left-0 rounded-9xl"
                  >
                    <div>
                      {!editReply && (
                        <div className="w-48">
                          <div
                            className={`${menuItemStyle} rounded-t-9xl`}
                            onClick={() => {
                              setEditReply(true);
                            }}
                            data-testid="post-ellipsis-edit-comment"
                          >
                            <Icon
                              name={'edit'}
                              size={16}
                              fill={twConfig.theme.colors.primary['500']}
                              stroke={twConfig.theme.colors.neutral['200']}
                            />
                            <div className="text-sm font-medium text-neutral-900">
                              Edit reply
                            </div>
                          </div>
                          <div
                            className={`${menuItemStyle} rounded-b-9xl`}
                            onClick={() => {
                              showConfirm();
                            }}
                          >
                            <Icon
                              name={'delete'}
                              size={16}
                              fill={twConfig.theme.colors.primary['500']}
                              stroke={twConfig.theme.colors.neutral['200']}
                            />
                            <div className="text-sm font-medium text-neutral-900">
                              Delete reply
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          </div>
          {editReply ? (
            <div className="mt-4">
              <CommentsRTE
                className="bg-white rounded-19xl"
                entityId={comment?.id}
                entityType="comment"
                mode={PostCommentMode.Edit}
                setEditComment={setEditReply}
                commentData={comment}
              />
            </div>
          ) : (
            <div
              className=" text-neutral-900  font-normal text-sm mt-4"
              data-testid="comment-reply-content"
            >
              <RenderQuillContent data={comment} isComment />
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between mt-3 cursor-pointer">
          <div className={`flex flex-row`}>
            {totalCount > 0 && (
              <div className="mr-2 flex flex-row">
                {Object.keys(comment?.reactionsCount || {})
                  .filter(
                    (key) =>
                      !!comment.reactionsCount[key] &&
                      comment.reactionsCount[key] > 0,
                  )
                  .slice(0, 3)
                  .map((key, i) => (
                    <div className={` ${i > 0 ? '-ml-2 z-1' : ''}  `} key={key}>
                      <Icon
                        name={key}
                        size={12}
                        className={`p-0.5 rounded-17xl cursor-pointer border-white border border-solid ${iconsStyle(
                          key,
                        )}`}
                      />
                    </div>
                  ))}
              </div>
            )}
            <div
              className={`flex text-sm font-normal text-neutral-500`}
              onClick={() => setShowReactionModal(true)}
            >
              {totalCount} reacted
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-3 pb-3 cursor-pointer">
          <div className="flex items-center">
            <Likes
              reaction={comment?.myReaction?.reaction || ''}
              entityId={comment.id}
              entityType="comment"
              reactionId={comment?.myReaction?.id || ''}
              queryKey="comments"
            />
          </div>
          <div></div>
        </div>
      </div>
      <ConfirmationBox
        open={confirm}
        onClose={closeConfirm}
        title="Delete"
        description={
          <span>
            Are you sure you want to delete this reply?
            <br /> This cannot be undone.
          </span>
        }
        success={{
          label: 'Delete',
          className: 'bg-red-500 text-white ',
          onSubmit: () => {
            deleteReplyMutation.mutate(comment.id || '');
          },
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
        isLoading={deleteReplyMutation.isLoading}
      />
      {showReactionModal && (
        <ReactionModal
          closeModal={() => setShowReactionModal(false)}
          reactionCounts={comment.reactionsCount || {}}
          postId={comment.id}
          entityType="comment"
        />
      )}
    </div>
  );
};
