import Spinner from 'components/Spinner';
import { IGetReaction, useReactions } from 'queries/reaction';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PRIMARY_COLOR } from 'utils/constants';
import ReactionRow from './ReactionRow';

export interface IReactionTabProps {
  postId: string;
  activeTab: string;
  entityType: string;
}

const ReactionTab: React.FC<IReactionTabProps> = ({
  postId,
  activeTab,
  entityType,
}) => {
  const { ref, inView } = useInView();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useReactions(
      activeTab !== 'all'
        ? {
            entityId: postId,
            entityType,
            reaction: activeTab,
            limit: 5,
          }
        : {
            entityId: postId,
            entityType,
            limit: 5,
          },
    );

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
        <ReactionRow isLoading={true} />
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

export default ReactionTab;
