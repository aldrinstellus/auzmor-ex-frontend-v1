import { IGetReaction, useInfiniteReactions } from 'queries/reaction';
import { FC, memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ReactionRow from './ReactionRow';
import ReactionSkeleton from './ReactionSkeleton';
export interface IReactionTabProps {
  entityId: string;
  entityType: string;
  reaction?: string;
  limit: number;
}

const ReactionTab: FC<IReactionTabProps> = ({
  entityId,
  entityType,
  reaction,
  limit,
}) => {
  const rootId = `${entityId}-${entityType}-${reaction}`;
  const { ref, inView } = useInView({
    root: document.getElementById(rootId),
    rootMargin: '20%',
  });

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteReactions({ entityId, entityType, reaction, limit });

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
    <div id={rootId} className="px-6 h-[482px] overflow-y-auto">
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
    </div>
  );
};

export default memo(ReactionTab);
