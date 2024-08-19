import { FC, useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Avatar from 'components/Avatar';
import { deleteComment } from 'queries/comments';
import { useMutation } from '@tanstack/react-query';
import Popover from 'components/Popover';
import clsx from 'clsx';
import { humanizeTime } from 'utils/time';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import ReactionModal from 'components/Post/components/ReactionModal';
import RenderQuillContent from 'components/RenderQuillContent';
import { useCommentStore } from 'stores/commentStore';
import omit from 'lodash/omit';
import { IComment } from 'components/Comments';
import {
  getAvatarColor,
  getFullName,
  getProfileImage,
  getUserCardTooltipProps,
} from 'utils/misc';
import { produce } from 'immer';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import ConfirmationBox from 'components/ConfirmationBox';
import useModal from 'hooks/useModal';
import {
  CommentsRTE,
  PostCommentMode,
} from 'components/Comments/components/CommentsRTE';
import Tooltip, { Variant as TooltipVariant } from 'components/Tooltip';
import UserCard from 'components/UserCard';
import { Link } from 'react-router-dom';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';

interface ReplyProps {
  comment: IComment;
  className?: string;
}

export const Reply: FC<ReplyProps> = ({ comment }) => {
  const { t } = useTranslation('profile');
  const { user } = useAuth();
  const { isLxp } = useProduct();
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
        ...omit(storedComments, [variables]),
        [storedComments[variables].entityId]: { ...updatedComment },
      });
      closeConfirm();
      return { previousData };
    },
    onError: () =>
      failureToastConfig({
        content: 'Error deleting reply',
        dataTestId: 'reply-toaster',
      }),
    onSuccess: () =>
      successToastConfig({
        content: 'Reply has been deleted',
        dataTestId: 'comment-toaster',
      }),
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
      <div className={`flex flex-col`}>
        <div className="bg-neutral-100 p-3 rounded-9xl mb-2">
          <div className="flex justify-between p-0">
            <div className="flex">
              <div className="mr-4">
                <Avatar
                  name={comment?.createdBy?.fullName}
                  size={32}
                  image={getProfileImage(comment?.createdBy)}
                  bgColor={getAvatarColor(comment?.createdBy)}
                />
              </div>
              <div className="flex flex-col items-start p-0 w-64">
                <Tooltip
                  tooltipContent={
                    <UserCard
                      user={getUserCardTooltipProps(
                        comment?.createdBy,
                        t('fieldNotSpecified'),
                      )}
                    />
                  }
                  variant={TooltipVariant.Light}
                  className="!p-4 !shadow-md !rounded-9xl !z-[999]"
                >
                  <Link
                    to={
                      isLxp
                        ? ''
                        : `${
                            comment?.createdBy?.userId &&
                            comment.createdBy.userId !== user?.id
                              ? '/users/' + comment.createdBy.userId
                              : '/profile'
                          }`
                    }
                  >
                    <div className="text-neutral-900 font-bold text-sm hover:text-primary-500 hover:underline">
                      {getFullName(comment?.createdBy)}
                    </div>
                  </Link>
                </Tooltip>
                <div className="font-normal text-neutral-500 text-xs">
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
                              color="text-neutral-200"
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
                              color="text-neutral-200"
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
              className=" text-neutral-900  font-normal text-sm mt-2"
              data-testid="comment-reply-content"
            >
              <RenderQuillContent data={comment} isComment />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 cursor-pointer mb-2">
          <div className="flex items-center">
            <Likes
              reaction={comment?.myReaction?.reaction || ''}
              entityId={comment.id}
              entityType="comment"
              reactionId={comment?.myReaction?.id || ''}
              queryKey="comments"
            />
          </div>
          {totalCount > 0 && (
            <div className="h-1 w-1 bg-neutral-500 rounded-full"></div>
          )}
          <div className="flex items-center cursor-pointer">
            <div
              className={`flex items-center`}
              onClick={() => setShowReactionModal(true)}
            >
              {totalCount > 0 && (
                <div className="flex">
                  {Object.keys(comment?.reactionsCount || {})
                    .filter(
                      (key) =>
                        !!comment.reactionsCount[key] &&
                        comment.reactionsCount[key] > 0,
                    )
                    .slice(0, 3)
                    .map((key, i) => (
                      <div
                        className={` ${i > 0 ? '-ml-2 z-1' : ''}  `}
                        key={key}
                      >
                        <Icon name={`${key}Reaction`} size={20} />
                      </div>
                    ))}
                </div>
              )}
              {totalCount > 0 && (
                <div
                  className={`flex text-xs font-normal text-neutral-500`}
                  data-testid="comment-reaction-count"
                >
                  {totalCount}
                </div>
              )}
            </div>
          </div>
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
