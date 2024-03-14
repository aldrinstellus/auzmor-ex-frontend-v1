import { FC, useEffect, useRef, useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';
import Avatar from 'components/Avatar';
import { useMutation } from '@tanstack/react-query';
import Popover from 'components/Popover';
import clsx from 'clsx';
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
  twConfig,
} from 'utils/misc';
import { IComment } from '..';
import { CommentsRTE, PostCommentMode } from './CommentsRTE';
import ConfirmationBox from 'components/ConfirmationBox';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { deleteComment } from 'queries/comments';
import { useFeedStore } from 'stores/feedStore';
import { useCommentStore } from 'stores/commentStore';
import { produce } from 'immer';
import Divider, { Variant } from 'components/Divider';
import Tooltip, { Variant as TooltipVariant } from 'components/Tooltip';
import UserCard from 'components/UserCard';
import useProduct from 'hooks/useProduct';

interface CommentProps {
  comment: IComment;
  replies?: IComment[];
}

export const Comment: FC<CommentProps> = ({ comment, replies = [] }) => {
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const { comment: storedcomments, setComment } = useCommentStore();
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [editComment, setEditComment] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const closePopOver = useRef<HTMLButtonElement>(null);

  const previousShowReply = useRef<boolean>(false);

  const { user } = useAuth();
  const { isLxp } = useProduct();

  const menuItemStyle = clsx({
    'flex flex-row items-center py-3 px-6 gap-2.5 border-b text-sm hover:bg-primary-50 cursor-pointer rounded-b-9xl':
      true,
  });

  const totalCount = Object.values(comment?.reactionsCount || {}).reduce(
    (total, count) => total + count,
    0,
  );

  useEffect(() => {
    if (showReplies) {
      previousShowReply.current = true;
    }
  }, [showReplies]);

  const deleteCommentMutation = useMutation({
    mutationKey: ['delete-comment-mutation'],
    mutationFn: deleteComment,
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
    onError: (error: any) => {
      console.log(error);
      toast(
        <FailureToast
          content="Error deleting comment"
          dataTestId="comment-toaster"
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
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
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
              color="text-primary-500"
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
          theme: 'dark',
        },
      );
    },
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
                <UserCard user={getUserCardTooltipProps(comment?.createdBy)} />
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
          <div>
            {user?.id === comment?.createdBy?.userId && (
              <Popover
                triggerNode={
                  <IconButton
                    icon={'more'}
                    className="!p-0 !bg-inherit"
                    variant={IconVariant.Primary}
                    size={Size.Large}
                    dataTestId="comment-ellipsis"
                  />
                }
                ref={closePopOver}
                className="left-0 rounded-9xl"
              >
                <div>
                  {!editComment && (
                    <div className="w-48">
                      <div
                        className={`${menuItemStyle} rounded-t-9xl`}
                        onClick={() => {
                          setEditComment(true);
                          closePopOver?.current?.click();
                        }}
                        data-testid="post-ellipsis-edit-comment"
                      >
                        <Icon
                          name={'edit'}
                          size={16}
                          color="text-neutral-200"
                        />
                        <div className="text-sm font-medium text-neutral-900">
                          Edit comment
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
                        <div
                          className={`text-sm font-medium text-neutral-900 `}
                        >
                          Delete comment
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Popover>
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
            className="flex space-x-1 cursor-pointer group"
            onClick={() => {
              setShowReplies(!showReplies);
            }}
          >
            <Icon name="comment" size={16} />
            <div
              className="text-xs font-normal text-neutral-500 ml-1.5 group-hover:text-primary-500"
              data-testid="comment-replies-count"
            >
              Reply
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
                  {comment?.repliesCount > 1 ? ' Replies' : ' Reply'}
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
            Are you sure you want to delete this comment?
            <br /> This cannot be undone.
          </span>
        }
        success={{
          label: 'Delete',
          className: 'bg-red-500 text-white ',
          onSubmit: () => {
            deleteCommentMutation.mutate(comment?.id || '');
          },
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
        isLoading={deleteCommentMutation?.isLoading}
      />
    </div>
  );
};
