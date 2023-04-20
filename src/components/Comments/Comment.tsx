import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { DataType, activeCommentsDataType } from '.';
import { CommentForm } from './CommentForm';
import Like from 'images/like.svg';
import Reply from 'images/reply.png';
import Icon from 'images/icon.png';
import Dots from 'images/dots.png';

interface CommentProps {
  replyInputBox: boolean;
  setReplyInputBox: Dispatch<SetStateAction<boolean>>;
  comment: DataType;
  replies: DataType[];
  setActiveComment: Dispatch<SetStateAction<activeCommentsDataType | null>>;
  activeComment: activeCommentsDataType | null;
  addComment: (text: any, parentId: string | null | undefined) => void;
  parentId?: string | null;
  currentUserId: string;
  className?: string;
}

export const Comment: React.FC<CommentProps> = ({
  replyInputBox,
  setReplyInputBox,
  comment,
  replies,
  setActiveComment,
  activeComment,
  addComment,
  parentId = null,
  currentUserId,
  className,
}) => {
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === 'replying';

  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  const handleLikes = () => {};

  return (
    <div key={comment.id}>
      <div className={`flex flex-col mt-[16px] ${className}`}>
        <div className="flex justify-between p-0">
          <div className="flex flex-row">
            <div className="mr-4">
              <img width={32} height={32} src={Icon} />
            </div>
            <div className="flex flex-col items-start p-0 w-64">
              <div className="text-neutral-900 font-bold text-[14px] leading-[140%]">
                {comment.username}
              </div>
              <div className="font-normal text-neutral-500 text-[12px] leading-[150%]">
                {comment.designation}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start">
            <div className="text-neutral-500 font-normal leading-[150%] text-[12px]">
              {createdAt}
            </div>
            <div className="ml-4 mt-1">
              <img width={16} height={16} src={Dots} />
            </div>
          </div>
        </div>
        {
          <div className=" text-neutral-900 leading-[140%] font-normal text-[14px] mt-4">
            {comment.body}
          </div>
        }

        <div className="flex justify-between pt-4 pb-6">
          <div className="flex">
            <button className="flex items-center" onClick={handleLikes}>
              <img src={Like} height={13.33} width={13.33} />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                {comment.likes.length} Like
              </div>
            </button>
            <button
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
              <img src={Reply} height={13.33} width={13.33} />
              <div className="text-xs font-normal text-neutral-500 ml-1.5">
                {replies.length} Reply
              </div>
            </button>
          </div>
          <div></div>
        </div>

        {isReplying && replyInputBox && (
          <CommentForm
            className="my-[8px]"
            handleSubmit={(text: any) => addComment(text, replyId)}
            setReplyInputBox={setReplyInputBox}
          />
        )}
        {replies.length > 0 && (
          <div className="ml-[32px]">
            {replies.map((reply: any) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
                currentUserId={currentUserId}
                replyInputBox={replyInputBox}
                setReplyInputBox={setReplyInputBox}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
