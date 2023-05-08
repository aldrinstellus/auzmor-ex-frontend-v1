import React, { useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, {
  Variant as IconVariant,
  Size as SizeVariant,
} from 'components/IconButton';
import Avatar from 'components/Avatar';
import { deleteComment, useComments } from 'queries/reaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IComment, activeCommentsDataType } from '.';
import Popover from 'components/Popover';
import clsx from 'clsx';
import { getTime } from 'utils/time';
import { iconsStyle } from 'components/Post';
import { MyObjectType } from 'queries/post';
import useAuth from 'hooks/useAuth';
import { CommentForm } from './CommentForm';

interface ReplyProps {
  comment: IComment;
  className?: string;
  activeComment: activeCommentsDataType | null;
  setActiveComment: (activeComment: activeCommentsDataType) => void;
}

export const Reply: React.FC<ReplyProps> = ({
  comment,
  className,
  activeComment,
  setActiveComment,
}) => {
  const queryClient = useQueryClient();
  const [replyInputBox, setReplyInputBox] = useState(false);
  const { user } = useAuth();
  const createdAt = getTime(comment.updatedAt);

  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === 'replying';

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

  return (
    <div key={comment.id}>
      <div className={`flex flex-col mt-4 ${className}`}>
        <div className="flex justify-between p-0">
          <div className="flex flex-row">
            <div className="mr-4">
              <Avatar
                name={comment?.createdBy?.fullName}
                size={32}
                image={comment?.createdBy?.profileImage?.url}
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
          {comment.content.text}
        </div>
        <div className="flex flex-row justify-between mt-3 cursor-pointer">
          <div className={`flex flex-row`}>
            {keys > 0 && (
              <div className="mr-2">
                {Object.keys(reactionCount)
                  .slice(0, 3)
                  .map((key, i) => (
                    <IconButton
                      icon={key}
                      size={SizeVariant.Small}
                      key={key}
                      className={`!p-1 rounded-17xl ${
                        i > 0 ? '-ml-2 z-1' : ''
                      } ${iconsStyle(key)} hover:${iconsStyle(key)} `}
                      variant={IconVariant.Primary}
                    />
                  ))}
              </div>
            )}
            <div className={`flex text-sm font-normal text-neutral-500 mt-0.5`}>
              {totalCount} reacted
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-3 pb-3 cursor-pointer">
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
                setActiveComment({ id: comment.id, type: 'replying' });
              }}
            >
              <IconButton
                icon={'reply'}
                className="!p-0 !bg-inherit"
                variant={IconVariant.Primary}
              />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                Comment
              </div>
            </div>
          </div>
          <div></div>
        </div>

        {replyInputBox && (
          <CommentForm
            className="my-1"
            entityId={comment.entityId}
            entityType="comment"
            setReplyInputBox={setReplyInputBox}
          />
        )}
      </div>
    </div>
  );
};
