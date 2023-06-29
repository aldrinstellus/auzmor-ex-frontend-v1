/* Comment RTE - Post Level Comment Editor */
import React from 'react';
import { Comment } from './components/Comment';
import { useInfiniteComments } from 'queries/comments';
import { DeltaStatic } from 'quill';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { ICreated, IMyReactions } from 'pages/Feed';
import { IMention, IReactionsCount } from 'queries/post';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';
import LoadMore from './components/LoadMore';
import CommentSkeleton from './components/CommentSkeleton';
import { CommentsRTE } from './components/CommentsRTE';

interface CommentsProps {
  entityId: string;
}

export interface IComment {
  content: {
    text: string;
    html: string;
    editor: DeltaStatic;
  };
  mentions: IMention[];
  hashtags: string[];
  latestComments: object[];
  entityType: string;
  entityId: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: ICreated;
  id: string;
  myReaction?: IMyReactions;
  reactionsCount: IReactionsCount;
  repliesCount: number;
  comment: IComment;
}

const Comments: React.FC<CommentsProps> = ({ entityId }) => {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comment,
  } = useInfiniteComments({
    entityId: entityId,
    entityType: 'post',
    limit: 4,
  });

  const commentIds = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((comment: { id: string }) => {
      try {
        return comment;
      } catch (e) {
        console.log('Error', { comment });
      }
    });
  }) as { id: string }[];

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
        <CommentsRTE className="w-full" entityId={entityId} entityType="post" />
      </div>
      <div className="border-b border-neutral-200 my-4"></div>

      {isLoading ? (
        <CommentSkeleton />
      ) : (
        commentIds && (
          <div>
            {commentIds
              ?.filter(({ id }) => !!comment[id])
              .map(({ id }, i: any) => (
                <Comment key={id} comment={comment[id]} />
              ))}
            {hasNextPage && !isFetchingNextPage && (
              <LoadMore
                onClick={fetchNextPage}
                label="Load more comments"
                dataTestId="comments-loadmorecta"
              />
            )}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-10">
                <Spinner color={PRIMARY_COLOR} />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Comments;
