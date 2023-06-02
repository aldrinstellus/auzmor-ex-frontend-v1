import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Avatar from 'components/Avatar';
import { deleteComment } from 'queries/reaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IComment, activeCommentsDataType } from '..';
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

interface CommentProps {
  comment: IComment;
  className?: string;
  activeComment: activeCommentsDataType | null;
  setActiveComment: (activeComment: activeCommentsDataType) => void;
  replyInputBox: boolean;
  setReplyInputBox: (inputBox: boolean) => void;
  customNode?: ReactNode;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  className,
  activeComment,
  setActiveComment,
  replyInputBox,
  setReplyInputBox,
  customNode = null,
}) => {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const createdAt = humanizeTime(comment.updatedAt);

  const [showReplies, setShowReplies] = useState(false);
  const deleteReactionMutation = useMutation({
    mutationKey: ['delete-comment-mutation'],
    mutationFn: deleteComment,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const handleDeleteReaction = () => {
    deleteReactionMutation.mutate(comment.id);
  };

  const menuItemStyle = clsx({
    ' flex flex-row items-center py-3 px-6 gap-2.5 border-b text-sm hover:bg-primary-50 cursor-pointer ':
      true,
  });

  const reactionCount: MyObjectType = comment?.reactionsCount || {};

  const keys = Object.keys(reactionCount).length;
  const totalCount = Object.values(reactionCount).reduce(
    (total, count) => total + count,
    0,
  );

  const previousShowReply = useRef<boolean>(false);

  useEffect(() => {
    if (showReplies) {
      previousShowReply.current = true;
    }
  }, [showReplies]);

  return (
    <div key={comment.id}>
      <div className={`flex flex-col mt-4 ${className}`}>
        <div className="flex justify-between p-0">
          <div className="flex flex-row">
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
          <div className="flex flex-row items-start">
            <div className="text-neutral-500 font-normal text-xs">
              {createdAt}
            </div>
            {user?.id === comment.createdBy.userId && (
              <div className="ml-4">
                <Popover
                  triggerNode={
                    <IconButton
                      icon={'more'}
                      className="!p-0 !bg-inherit"
                      variant={IconVariant.Primary}
                    />
                  }
                  className="left-0"
                >
                  <div className="rounded-10xl shadow-xl flex flex-col w-20">
                    <div className={menuItemStyle} onClick={() => {}}>
                      Edit{' '}
                    </div>
                    <div
                      className={menuItemStyle}
                      onClick={() => {
                        handleDeleteReaction();
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
        <div className=" text-neutral-900  font-normal text-sm mt-4">
          <RenderQuillContent data={comment} />
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

            <div className={`flex text-sm font-normal text-neutral-500`}>
              {totalCount} reacted
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4 pb-3 cursor-pointer">
          <div className="flex">
            <Likes
              reaction={comment?.myReaction?.reaction || ''}
              entityId={comment.id}
              entityType="comment"
              reactionId={comment?.myReaction?.id || ''}
              queryKey="comments"
            />
            <div
              className="flex items-center ml-7"
              onClick={() => {
                if (replyInputBox) {
                  setReplyInputBox(false);
                } else {
                  setReplyInputBox(true);
                }

                if (showReplies) {
                  setShowReplies(false);
                } else {
                  setShowReplies(true);
                }
                setActiveComment({ id: comment.id, type: 'replying' });
              }}
            >
              <IconButton
                icon={'reply'}
                className="!p-0 !bg-inherit"
                variant={IconVariant.Primary}
              />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                {comment?.repliesCount}
                {comment.repliesCount > 0 ? ' Replies' : ' Reply'}
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
    </div>
  );
};
