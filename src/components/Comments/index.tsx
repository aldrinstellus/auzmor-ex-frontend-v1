import React, { useState } from 'react';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { useComments } from 'queries/reaction';
import { DeltaStatic } from 'quill';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { ICreated, IMyReactions } from 'pages/Feed';
import { MyObjectType } from 'queries/post';
import Spinner from 'components/Spinner';

interface CommentsProps {
  entityId: string;
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

const Comments: React.FC<CommentsProps> = ({ entityId }) => {
  const { user } = useAuth();
  const { data, isLoading } = useComments({
    entityId: entityId,
    entityType: 'post',
    limit: 30,
    page: 1,
  });

  const commentData = data?.result?.data;

  const [activeComment, setActiveComment] =
    useState<activeCommentsDataType | null>(null);
  const [replyInputBox, setReplyInputBox] = useState(false);

  return (
    <div>
      <div className="flex flex-row items-center justify-between p-0">
        <div className="flex-none grow-0 order-none pr-2">
          <Avatar
            name={user?.name || 'U'}
            size={32}
            image={user?.profileImage}
          />
        </div>
        <CommentForm className="w-full" entityId={entityId} entityType="post" />
      </div>
      <div className="border-b border-neutral-200 my-4"></div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner color="#FFFFFF" />
        </div>
      ) : (
        commentData && (
          <div>
            {commentData.map((rootComment: IComment, i: any) => (
              <Comment
                key={rootComment.id}
                comment={rootComment}
                className=""
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                setReplyInputBox={setReplyInputBox}
                replyInputBox={replyInputBox}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
