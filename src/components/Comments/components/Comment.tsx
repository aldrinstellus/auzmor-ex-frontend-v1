import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';
import Avatar from 'components/Avatar';
import { useQueryClient } from '@tanstack/react-query';
import Popover from 'components/Popover';
import clsx from 'clsx';
import { humanizeTime } from 'utils/time';
import { iconsStyle } from 'components/Post';
import { MyObjectType } from 'queries/post';
import useAuth from 'hooks/useAuth';
import Reply from '../../Reply';
import Icon from 'components/Icon';
import { Link } from 'react-router-dom';
import RenderQuillContent from 'components/RenderQuillContent';
import ReactionModal from 'components/Post/components/ReactionModal';
import useModal from 'hooks/useModal';
import DeleteCommentModal from './DeleteCommentModal';
import { twConfig } from 'utils/misc';
import { IComment } from '..';
import { CommentsRTE, PostCommentMode } from './CommentsRTE';

interface CommentProps {
  comment: IComment;
  className?: string;
  customNode?: ReactNode;
  entityId?: string;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  className,
  customNode = null,
  entityId,
}) => {
  const queryClient = useQueryClient();

  const [showReactionModal, setShowReactionModal] = useState(false);
  const [deleteCommentModal, openDeleteCommentModal, closedDeleteCommentModal] =
    useModal(false);
  const [editComment, setEditComment] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const previousShowReply = useRef<boolean>(false);

  const { user } = useAuth();

  const menuItemStyle = clsx({
    'flex flex-row items-center py-3 px-6 gap-2.5 border-b text-sm hover:bg-primary-50 cursor-pointer':
      true,
  });

  const reactionCount: MyObjectType = comment?.reactionsCount || {};

  const keys = Object.keys(reactionCount).length;
  const totalCount = Object.values(reactionCount).reduce(
    (total, count) => total + count,
    0,
  );

  useEffect(() => {
    if (showReplies) {
      previousShowReply.current = true;
    }
  }, [showReplies]);

  return (
    <div key={comment.id}>
      <div className={`flex flex-col mt-4 ${className}`}>
        <div className="bg-neutral-100 p-3 rounded-9xl">
          <div className="flex justify-between p-0">
            <div className="flex">
              <div className="mr-4">
                <Link
                  to={
                    comment?.createdBy?.userId &&
                    comment.createdBy.userId !== user?.id
                      ? '/users/' + comment.createdBy.userId
                      : '/profile'
                  }
                >
                  <Avatar
                    name={comment?.createdBy?.fullName}
                    size={32}
                    image={comment?.createdBy?.profileImage?.original}
                  />
                </Link>
              </div>
              <div className="flex flex-col items-start p-0 w-64">
                <Link
                  to={
                    comment?.createdBy?.userId &&
                    comment.createdBy.userId !== user?.id
                      ? '/users/' + comment.createdBy.userId
                      : '/profile'
                  }
                >
                  <div className="text-neutral-900 font-bold text-sm">
                    {comment?.createdBy?.fullName}
                  </div>
                </Link>
                <div className="font-normal text-neutral-500 text-sm ">
                  {comment?.createdBy?.designation}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="text-neutral-500 font-normal text-xs mt-1">
                {humanizeTime(comment.updatedAt)}
              </div>
              <div className="ml-4">
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
                    className="left-0 rounded-9xl"
                  >
                    <div className="w-48">
                      <div
                        className={`${menuItemStyle} rounded-t-9xl`}
                        onClick={() => {
                          setEditComment(true);
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
                          Edit comment
                        </div>
                      </div>
                      <div
                        className={`${menuItemStyle} rounded-b-9xl`}
                        onClick={() => {
                          openDeleteCommentModal();
                        }}
                      >
                        <Icon
                          name={'delete'}
                          size={16}
                          fill={twConfig.theme.colors.primary['500']}
                          stroke={twConfig.theme.colors.neutral['200']}
                        />
                        <div className="text-sm font-medium text-neutral-900">
                          Delete comment
                        </div>
                      </div>
                    </div>
                  </Popover>
                )}
              </div>
            </div>
          </div>
          {/* Comment Edit at Post level type Post */}
          {editComment ? (
            <CommentsRTE
              entityId={comment?.id}
              entityType="post"
              mode={PostCommentMode.Edit}
              setEditComment={setEditComment}
            />
          ) : (
            <div className="text-neutral-900  font-normal text-sm mt-4">
              <RenderQuillContent data={comment} />
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between mt-4 cursor-pointer">
          <div className={`flex flex-row`}>
            {keys > 0 && (
              <div className="mr-2 flex flex-row">
                {Object.keys(reactionCount)
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
              data-testid="comment-reaction-count"
              onClick={() => setShowReactionModal(true)}
            >
              {totalCount} reacted
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4 pb-3 cursor-pointer">
          <div className="flex items-center">
            <Likes
              reaction={comment?.myReaction?.reaction || ''}
              entityId={comment.id}
              entityType="comment"
              reactionId={comment?.myReaction?.id || ''}
              queryKey="comments"
              dataTestIdPrefix="comment-reaction"
            />
            <div
              className="flex items-center ml-7"
              onClick={() => {
                setShowReplies(!showReplies);
              }}
              data-testid="replyto-commentcta"
            >
              <IconButton
                icon={'reply'}
                className="!p-0 !bg-inherit"
                variant={IconVariant.Primary}
              />
              <div
                className="text-xs font-normal text-neutral-500 ml-1.5"
                data-testid="comment-replies-count"
              >
                {comment?.repliesCount}
                {comment?.repliesCount > 0 ? ' Replies' : ' Reply'}
              </div>
            </div>
          </div>
          <div></div>
        </div>
        {showReplies ? (
          <Reply
            entityId={comment.id}
            className={`${comment.repliesCount > 0 ? '' : 'mb-5'}`}
          />
        ) : (
          !previousShowReply.current && customNode
        )}
      </div>
      {showReactionModal && (
        <ReactionModal
          closeModal={() => setShowReactionModal(false)}
          reactionCounts={comment.reactionsCount || {}}
          postId={comment.id}
          entityType="comment"
        />
      )}
      {deleteCommentModal && (
        <DeleteCommentModal
          showModal={deleteCommentModal}
          closedModal={closedDeleteCommentModal}
          commentId={comment?.id}
        />
      )}
    </div>
  );
};
