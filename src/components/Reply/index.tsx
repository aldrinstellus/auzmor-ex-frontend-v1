import React, { useRef } from 'react';
import { useInfiniteComments } from 'queries/reaction';
import { DeltaStatic } from 'quill';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { ICreated, IMyReactions } from 'pages/Feed';
import { MyObjectType } from 'queries/post';
import { Reply } from 'components/Reply/Reply';
import { CommentForm } from 'components/Comments/components/CommentForm';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';
import LoadMore from 'components/Comments/components/LoadMore';
import CommentSkeleton from 'components/Comments/components/CommentSkeleton';

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

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteComments({
    entityId: entityId,
    entityType: 'comment',
    // Limit here is arbitrary, need to check with product team.
    // Linkedin loads 2 by default and then 10 each time you click 'Load more'
    limit: 4,
  });

  const replies = data?.pages.flatMap((page) => {
    console.log({ page });
    return page?.result?.data.map((comment: any) => {
      try {
        return comment;
      } catch (e) {
        console.log('Error', { comment });
      }
    });
  });

  return (
    <div className={className}>
      {isLoading ? (
        <div className="ml-8">
          <CommentSkeleton />
        </div>
      ) : (
        <div className="ml-8">
          <div className="flex flex-row items-center justify-between p-0">
            <div className="flex-none grow-0 order-none pr-2">
              <Avatar
                name={user?.name || 'U'}
                size={32}
                image={user?.profileImage}
              />
            </div>
            <CommentForm
              className="w-full py-1"
              entityId={entityId}
              entityType="comment"
            />
          </div>
          {replies && replies.length > 0 && (
            <div>
              {replies.map((reply: any) => (
                <Reply
                  // handleClick={handleClick}
                  comment={reply}
                  key={reply.id}
                />
              ))}
              {hasNextPage && !isFetchingNextPage && (
                <LoadMore onClick={fetchNextPage} label="Load more replies" />
              )}
              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-10">
                  <Spinner color={PRIMARY_COLOR} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
