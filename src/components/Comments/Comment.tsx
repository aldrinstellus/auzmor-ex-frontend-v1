import React from 'react';
import Likes from 'components/Reactions';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import Avatar from 'components/Avatar';
import { deleteComment } from 'queries/reaction';
import { useMutation } from '@tanstack/react-query';
import { IComment } from '.';

interface CommentProps {
  comment: IComment;
  className?: string;
}

export const Comment: React.FC<CommentProps> = ({ comment, className }) => {
  const createdAt = new Date(comment.updatedAt).toLocaleDateString();

  const deleteReactionMutation = useMutation({
    mutationKey: ['delete-comment-mutation'],
    mutationFn: deleteComment,
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {},
  });

  const handleDeleteReaction = () => {
    deleteReactionMutation.mutate(comment.id);
  };

  return (
    <div key={comment.id}>
      <div className={`flex flex-col mt-4 ${className}`}>
        <div className="flex justify-between p-0">
          <div className="flex flex-row">
            <div className="mr-4">
              <Avatar
                name={comment.createdBy.fullName}
                size={32}
                image={comment.createdBy.profileImage.blurHash}
              />
            </div>
            <div className="flex flex-col items-start p-0 w-64">
              <div className="text-neutral-900 font-bold text-sm">
                {comment.createdBy.fullName}
              </div>
              <div className="font-normal text-neutral-500 text-sm ">
                {comment.createdBy.designation}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start">
            <div className="text-neutral-500 font-normal text-xs">
              {createdAt}
            </div>
            <div className="ml-4">
              <IconButton
                icon={'more'}
                className="!p-0 !bg-inherit"
                variant={IconVariant.Primary}
                onClick={() => {
                  handleDeleteReaction();
                }}
              />
            </div>
          </div>
        </div>
        {
          <div className=" text-neutral-900  font-normal text-sm mt-4">
            {comment.content.text}
          </div>
        }

        <div className="flex justify-between pt-4 pb-6">
          <div className="flex">
            <Likes
              reaction={comment?.myReaction?.reaction || ''}
              entityId="6453b0af38cdab4ce82a91bb"
              entityType="comment"
              reactionId={comment?.myReaction?.id || ''}
            />
            <button className="flex items-center ml-7" onClick={() => {}}>
              <IconButton
                icon={'reply'}
                className="!p-0 !bg-inherit"
                variant={IconVariant.Primary}
              />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                0 Reply
              </div>
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
