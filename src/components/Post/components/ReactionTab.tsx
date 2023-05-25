import Spinner from 'components/Spinner';
import { IGetReaction, useReactions } from 'queries/reaction';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PRIMARY_COLOR } from 'utils/constants';
import ReactionRow from './ReactionRow';

export interface IReactionTabProps {
  postId: string;
  activeTab: string;
}

const ReactionTab: React.FC<IReactionTabProps> = ({ postId, activeTab }) => {
  const { ref, inView } = useInView();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useReactions(
      activeTab !== 'all'
        ? {
            entityId: postId,
            entityType: 'post',
            reaction: activeTab,
          }
        : {
            entityId: postId,
            entityType: 'post',
          },
    );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const reactions = data?.pages.flatMap((page: any) => {
    return page.data.map((reaction: IGetReaction) => {
      try {
        return reaction;
      } catch (e) {
        console.log('Error', { reaction });
      }
    });
  }) as IGetReaction[];
  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full py-20">
          <Spinner color={PRIMARY_COLOR} />
        </div>
      ) : (
        reactions &&
        reactions.map((reaction: IGetReaction) => (
          <ReactionRow key={reaction.id} reaction={reaction} />
        ))
      )}
      <div>
        {hasNextPage && isFetchingNextPage && (
          <div className="flex justify-center items-center w-full py-6">
            <Spinner color={PRIMARY_COLOR} />
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
      </div>
    </div>
  );
};

export default ReactionTab;
