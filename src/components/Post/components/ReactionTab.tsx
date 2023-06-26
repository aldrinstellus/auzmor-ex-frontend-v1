import { IGetReaction, useInfiniteReactions } from 'queries/reaction';
import React, { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactionRow from './ReactionRow';
import ReactionSkeleton from './ReactionSkeleton';

interface IGetReactionQuery {
  entityId: string;
  entityType: string;
  reaction?: string;
  limit: number;
}

export interface IReactionTabProps {
  getReactionQuery: IGetReactionQuery;
}

const ReactionTab: React.FC<IReactionTabProps> = ({ getReactionQuery }) => {
  const { ref, inView } = useInView();

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteReactions(getReactionQuery);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const reactions = data?.pages.flatMap((page: any) => {
    try {
      return page.data.map((reaction: IGetReaction) => {
        try {
          return reaction;
        } catch (e) {
          console.log('Error', { reaction });
        }
      });
    } catch (error) {
      return [];
    }
  }) as IGetReaction[];

  return (
    <div>
      {isLoading ? (
        <ReactionSkeleton />
      ) : (
        reactions &&
        reactions.map((reaction: IGetReaction) => (
          <ReactionRow key={reaction.id} reaction={reaction} />
        ))
      )}
      <div>
        {hasNextPage && isFetchingNextPage && <ReactionRow isLoading={true} />}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      </div>
    </div>
  );
};

export default memo(ReactionTab);
