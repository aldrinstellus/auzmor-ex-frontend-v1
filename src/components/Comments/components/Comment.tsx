import { FC, useEffect, useRef, useState } from 'react';
import Likes from 'components/Reactions';
import Avatar from 'components/Avatar';
import { useMutation } from '@tanstack/react-query';
import { humanizeTime } from 'utils/time';
import useAuth from 'hooks/useAuth';
import ReplyCard from 'components/Reply';
import { Reply } from 'components/Reply/Reply';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import RenderQuillContent from 'components/RenderQuillContent';
import ReactionModal from 'components/Post/components/ReactionModal';
import omit from 'lodash/omit';
import useModal from 'hooks/useModal';
import {
  getAvatarColor,
  getFullName,
  getProfileImage,
  getUserCardTooltipProps,
} from 'utils/misc';
import { CommentsRTE, PostCommentMode } from './CommentsRTE';
import ConfirmationBox from 'components/ConfirmationBox';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useFeedStore } from 'stores/feedStore';
import { useCommentStore } from 'stores/commentStore';
import { produce } from 'immer';
import Divider, { Variant } from 'components/Divider';
import Tooltip, { Variant as TooltipVariant } from 'components/Tooltip';
import UserCard from 'components/UserCard';
import useProduct from 'hooks/useProduct';
import PopupMenu from 'components/PopupMenu';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

interface CommentProps {
  commentId: string;
}

export const Comment: FC<CommentProps> = ({ commentId }) => {
  const { t: tp } = useTranslation('profile');
  const { t } = useTranslation('post', { keyPrefix: 'commentComponent' });
  const getPost = useFeedStore((state) => state.getPost);
  const [getComments, storedcomments, setComment] = useCommentStore(
    ({ getComments, comment, setComment }) => [
      getComments,
      comment,
      setComment,
    ],
  );
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [editComment, setEditComment] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { user } = useAuth();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();
  const previousShowReply = useRef<boolean>(false);

  const comment = storedcomments[commentId];
  const replies = getComments(comment?.relevantComments || []);

  const totalCount = Object.values(comment?.reactionsCount || {}).reduce(
    (total, count) => total + count,
    0,
  );

  useEffect(() => {
    if (showReplies) {
      previousShowReply.current = true;
    }
  }, [showReplies]);

  const deleteComment = getApi(ApiEnum.DeleteComment);
  const deleteCommentMutation = useMutation({
    mutationKey: ['delete-comment-mutation'],
    mutationFn: (id: string) => deleteComment(id),
    onMutate: (variables) => {
      const previousData = storedcomments;
      const post = getPost(storedcomments[variables].entityId);
      updateFeed(
        post.id!,
        produce(post, (draft) => {
          draft.commentsCount = draft.commentsCount - 1;
        }),
      );
      setComment({ ...omit(storedcomments, [variables]) });
      closeConfirm();
      return { previousData };
    },
    onError: () =>
      failureToastConfig({
        content: t('deleteFailToast'),
        dataTestId: 'comment-toaster',
      }),
    onSuccess: () =>
      successToastConfig({
        content: t('deleteSuccessToast'),
        dataTestId: 'comment-toaster',
      }),
  });

  const profileUrl = isLxp
    ? ''
    : `${
        comment?.createdBy?.userId && comment.createdBy.userId !== user?.id
          ? '/users/' + comment.createdBy.userId
          : '/profile'
      }`;

  return (
    <div className="flex flex-col">
      <div className="bg-neutral-100 p-3 rounded-9xl mb-4">
        <div className="flex flex-row justify-between gap-4">
          <div>
            <Link to={profileUrl}>
              <Avatar
                name={comment?.createdBy?.fullName}
                size={32}
                image={getProfileImage(comment?.createdBy)}
                bgColor={getAvatarColor(comment?.createdBy)}
              />
            </Link>
          </div>
          <div className="flex flex-col items-start p-0 flex-grow w-0">
            <Tooltip
              tooltipContent={
                <UserCard
                  user={getUserCardTooltipProps(
                    comment?.createdBy,
                    tp('fieldNotSpecified'),
                  )}
                />
              }
              variant={TooltipVariant.Light}
              className="!p-4 !shadow-md !rounded-9xl !z-[999]"
            >
              <Link to={profileUrl}>
                <div className="text-neutral-900 font-bold text-sm hover:text-primary-500 hover:underline">
                  {getFullName(comment?.createdBy)}
                </div>
              </Link>
            </Tooltip>
            <div className="font-normal text-neutral-500 text-xs">
              {comment?.createdBy?.designation}
            </div>
          </div>
          <div className="text-neutral-500 font-normal text-xs mt-1">
            {humanizeTime(comment.updatedAt)}
          </div>
          <div className="relative">
            {user?.id === comment?.createdBy?.userId && (
              <PopupMenu
                triggerNode={
                  <div
                    className="cursor-pointer"
                    data-testid="comment-ellipsis"
                  >
                    <Icon name="more" ariaLabel="more" tabIndex={0} />
                  </div>
                }
                menuItems={[
                  {
                    icon: 'edit',
                    label: t('editComment'),
                    onClick: () => {
                      setEditComment(true);
                    },
                    stroke: 'text-neutral-900',
                    dataTestId: 'post-ellipsis-edit-comment',
                  },
                  {
                    icon: 'delete',
                    label: t('deleteComment'),
                    onClick: showConfirm,
                    stroke: 'text-neutral-900',
                    dataTestId: 'post-ellipsis-edit-comment',
                  },
                ]}
                className="mt-1 right-0 border-1 border-neutral-200 focus-visible:outline-none"
              />
            )}
          </div>
        </div>
        {/* Comment Edit at Post level type Post */}
        {editComment ? (
          <div className="mt-4">
            <CommentsRTE
              entityId={comment?.id}
              entityType="post"
              mode={PostCommentMode.Edit}
              setEditComment={setEditComment}
              commentData={comment}
              className="bg-white rounded-19xl"
            />
          </div>
        ) : (
          <div className="text-neutral-900 font-normal text-sm mt-2">
            <RenderQuillContent data={comment} isComment />
          </div>
        )}
      </div>

      {/* Replies */}
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Likes
            reaction={comment?.myReaction?.reaction || ''}
            entityId={comment.id}
            entityType="comment"
            reactionId={comment?.myReaction?.id || ''}
            queryKey="comments"
            dataTestIdPrefix="comment-reaction"
          />
          {/* ellipse */}
          <div className="h-1 w-1 bg-neutral-500 rounded-full"></div>

          {/* Show Reaction */}
          {totalCount > 0 ? (
            <div className="flex justify-between cursor-pointer">
              <div
                className="flex items-center"
                onClick={() => setShowReactionModal(true)}
              >
                {totalCount > 0 && (
                  <div className="flex ">
                    {Object.keys(comment.reactionsCount)
                      .filter(
                        (key) =>
                          !!comment.reactionsCount[key] &&
                          comment.reactionsCount[key] > 0,
                      )
                      .slice(0, 3)
                      .map((react, i) => (
                        <div
                          className={` ${i > 0 ? '-ml-2 z-1' : ''}  `}
                          key={react}
                        >
                          <Icon name={`${react}Reaction`} size={20} />
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
                <Divider
                  variant={Variant.Vertical}
                  className="bg-neutral-200 mx-4"
                />
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div
            className="flex space-x-1 cursor-pointer group outline-none"
            onClick={() => setShowReplies(!showReplies)}
            onKeyUp={(e) =>
              e.code === 'Enter' ? setShowReplies(!showReplies) : ''
            }
            tabIndex={0}
            role="button"
          >
            <Icon name="comment" size={16} />
            <div
              className="text-xs font-normal text-neutral-500 ml-1.5 group-hover:text-primary-500 group-focus:text-primary-500"
              data-testid="comment-replies-count"
            >
              {t('reply.single')}
            </div>
          </div>

          {comment?.repliesCount > 0 && (
            <>
              {/* ellipse */}
              <div className="h-1 w-1 bg-neutral-500 rounded-full"></div>
              <div
                className="flex items-center cursor-pointer group"
                data-testid="replyto-commentcta"
                onClick={() => {
                  setShowReplies(!showReplies);
                }}
              >
                <div
                  className="text-xs font-normal text-neutral-500 group-hover:text-primary-500"
                  data-testid="comment-replies-count"
                >
                  {comment?.repliesCount}
                  {comment?.repliesCount > 1
                    ? ` ${t('reply.multiple')}`
                    : ` ${t('reply.single')}`}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showReplies ? (
        <div className="mt-4">
          <ReplyCard entityId={comment.id} />
        </div>
      ) : !previousShowReply.current && replies?.length ? (
        replies.map((reply) => (
          <div className="mt-4 ml-8" key={reply.id}>
            <Reply comment={reply} />
          </div>
        ))
      ) : null}

      {showReactionModal && (
        <ReactionModal
          closeModal={() => setShowReactionModal(false)}
          reactionCounts={comment.reactionsCount || {}}
          postId={comment.id}
          entityType="comment"
        />
      )}

      <ConfirmationBox
        open={confirm}
        onClose={closeConfirm}
        title="Delete"
        description={
          <span>
            {t('deleteFailedError')}
            <br /> {t('deleteFailedUndo')}
          </span>
        }
        success={{
          label: t('deleteLabel'),
          className: 'bg-red-500 text-white ',
          onSubmit: () => {
            deleteCommentMutation.mutate(comment?.id || '');
          },
        }}
        discard={{
          label: t('cancelLabel'),
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
        isLoading={deleteCommentMutation?.isLoading}
      />
    </div>
  );
};
