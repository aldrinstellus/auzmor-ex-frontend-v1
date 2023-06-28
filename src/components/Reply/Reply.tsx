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

interface ReplyProps {
  comment: IComment;
  className?: string;
}

export const Reply: React.FC<ReplyProps> = ({ comment, className }) => {
  const { user } = useAuth();
  const createdAt = humanizeTime(comment.createdAt);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const { comment: storedComments, setComment } = useCommentStore();

  const deleteReplyMutation = useMutation({
    mutationKey: ['delete-comment-mutation'],
    mutationFn: deleteComment,
    onMutate: (variables) => {
      const previousData = storedComments;
      setComment({ ..._.omit(storedComments, [variables]) });
      return { previousData };
    },
    onError: (error, variables, context) => {
      setComment(context!.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  const handleDeleteReply = () => {
    deleteReplyMutation.mutate(comment.id);
  };

  const menuItemStyle = clsx({
    ' flex flex-row items-center py-3 px-6 gap-2.5 border-b text-sm hover:bg-primary-50 cursor-pointer ':
      true,
  });

  const reactionCount: IReactionsCount = comment?.reactionsCount || {};

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
                    <div className="w-48">
                      <div
                        className={`${menuItemStyle} rounded-t-9xl`}
                        onClick={() => {}}
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
                        className={menuItemStyle}
                        onClick={handleDeleteReply}
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
