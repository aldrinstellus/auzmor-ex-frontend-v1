import { IGetReaction, useInfiniteReactions } from 'queries/reaction';
import { FC, memo, useEffect } from 'react';
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

const ReactionTab: FC<IReactionTabProps> = ({ getReactionQuery }) => {
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
      return page?.data?.data?.map((reaction: IGetReaction) => {
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
    <>
      {isLoading ? (
        <ReactionSkeleton />
      ) : (
        reactions &&
        reactions?.map((reaction: IGetReaction) => (
          <div key={reaction?.id} className="">
            <ReactionRow reaction={reaction} />
          </div>
        ))
      )}
      <div>
        {hasNextPage && isFetchingNextPage && <ReactionRow isLoading={true} />}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      </div>
    </>
  );
};

export default memo(ReactionTab);
