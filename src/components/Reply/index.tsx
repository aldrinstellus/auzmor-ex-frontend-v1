import React from 'react';
import { useInfiniteReplies } from 'queries/reaction';
/* Comment Level RTE - Comment on the comment level 2 */
import { useInfiniteComments } from 'queries/comments';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import { Reply } from 'components/Reply/Reply';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';
import LoadMore from 'components/Comments/components/LoadMore';
import { useCommentStore } from 'stores/commentStore';
import CommentSkeleton from 'components/Comments/components/CommentSkeleton';
import { CommentsRTE } from 'components/Comments/components/CommentsRTE';

interface CommentsProps {
  entityId: string;
  className?: string;
}

export interface activeCommentsDataType {
  id: string;
  type: string;
}

const Comments: React.FC<CommentsProps> = ({ entityId, className }) => {
  const { user } = useAuth();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteReplies({
      entityId: entityId,
      entityType: 'comment',
      limit: 4,
    });

  const { comment } = useCommentStore();

  const replyIds = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((reply: { id: string }) => {
      try {
        return reply;
      } catch (e) {
        console.log('Error', { reply });
      }
    });
  }) as { id: string }[];

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
            <CommentsRTE
              className="w-full py-1"
              entityId={entityId}
              entityType="comment"
            />
          </div>
          {replyIds && replyIds.length > 0 && (
            <div>
              {replyIds
                .filter(({ id }) => !!comment[id])
                .map(({ id }) => (
                  <Reply
                    // handleClick={handleClick}
                    comment={comment[id]}
                    key={id}
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
