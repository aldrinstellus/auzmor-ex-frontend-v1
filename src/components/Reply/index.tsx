import React, { useRef, useState } from 'react';
import { useComments } from 'queries/reaction';
import { DeltaStatic } from 'quill';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { ICreated, IMyReactions } from 'pages/Feed';
import { MyObjectType } from 'queries/post';
import { Reply } from 'components/Reply/Reply';
import { CommentForm } from 'components/Comments/CommentForm';
import Spinner from 'components/Spinner';
import ReactQuill from 'react-quill';

interface CommentsProps {
  entityId: string;
  className?: string;
}

export interface activeCommentsDataType {
  id: string;
  type: string;
}

export interface IComment {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  mentions: object[];
  hashtags: string[];
  latestComments: object[];
  entityType: string;
  entityId: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: ICreated;
  id: string;
  myReaction: IMyReactions;
  reactionsCount: MyObjectType;
  repliesCount: number;
}

const Comments: React.FC<CommentsProps> = ({ entityId, className }) => {
  const { user } = useAuth();
  const { data, isLoading } = useComments({
    entityId: entityId,
    entityType: 'comment',
    limit: 30,
    page: 1,
  });
  const quillRef = useRef<HTMLDivElement>(null);

  const replies = data?.result?.data;

  const handleClick = () => {
    // quillRef.current?.animate({
    //   scrollTop: 100,
    // });
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner color="#FFFFFF" />
        </div>
      ) : (
        <div className="ml-8">
          <div className="flex flex-row items-center justify-between p-0">
            <div className="flex-none grow-0 order-none pr-2">
              <Avatar name={user?.name || 'U'} size={32} />
            </div>
            <CommentForm
              className="w-full py-1"
              entityId={entityId}
              entityType="comment"
              inputRef={quillRef}
            />
          </div>
          {replies?.length > 0 && (
            <div>
              {replies.map((reply: any) => (
                <Reply
                  handleClick={handleClick}
                  comment={reply}
                  key={reply.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
