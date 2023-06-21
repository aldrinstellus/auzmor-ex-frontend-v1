import React, { useState } from 'react';
import Likes from 'components/Reactions';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Avatar from 'components/Avatar';
import { deleteComment } from 'queries/reaction';
import { useMutation } from '@tanstack/react-query';
import { IComment } from '../Comments';
import Popover from 'components/Popover';
import clsx from 'clsx';
import queryClient from 'utils/queryClient';
import { humanizeTime } from 'utils/time';
import { iconsStyle } from 'components/Post';
import { MyObjectType } from 'queries/post';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import ReactionModal from 'components/Post/components/ReactionModal';
import RenderQuillContent from 'components/RenderQuillContent';

interface ReplyProps {
  comment: IComment;
  className?: string;
  // handleClick: () => void;
}

export const Reply: React.FC<ReplyProps> = ({
  comment,
  className,
  // handleClick,
}) => {
  const { user } = useAuth();
  const createdAt = humanizeTime(comment.createdAt);
  const [showReactionModal, setShowReactionModal] = useState(false);

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
        <div className="bg-neutral-100 p-3 rounded-9xl">
          <div className="flex justify-between p-0">
            <div className="flex flex-row">
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
                        dataTestId="comment-reply-ecllipsis"
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
          <div
            className=" text-neutral-900  font-normal text-sm mt-4"
            data-testid="comment-reply-content"
          >
            <RenderQuillContent data={comment} />
          </div>
        </div>
        <div className="flex flex-row justify-between mt-3 cursor-pointer">
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
