import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { MyObjectType } from 'queries/post';
import React, { useEffect, useMemo, useState } from 'react';
import ReactionRow from './ReactionRow';
import { IGetReaction, IReactions, useReactions } from 'queries/reaction';
import { useInView } from 'react-intersection-observer';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';

export interface IReactionModalProps {
  closeModal?: () => void;
  reactionCounts: MyObjectType;
  postId: string;
}

const ReactionModal: React.FC<IReactionModalProps> = ({
  closeModal,
  reactionCounts,
  postId,
}) => {
  const [activeTab, setActiveTab] = useState('all');
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
      { onSuccess: (data: any) => console.log(data, 'data') },
    );

  useEffect(() => {
    if (inView) {
      console.log('yeee');
      fetchNextPage();
    }
  }, [inView]);

  const getClassName = (label: string) =>
    `flex font-extrabold ${
      activeTab === label ? 'text-neutral-900' : 'text-neutral-500'
    }`;

  const isActive = (label: string) => activeTab === label;

  const tabHeaders = useMemo(
    () => [
      {
        icon: '',
        count: Object.values(reactionCounts).reduce((a, b) => a + b, 0),
        label: 'all',
      },
      { icon: 'like', count: reactionCounts['like'] || 0, label: 'like' },
      { icon: 'love', count: reactionCounts['love'] || 0, label: 'love' },
      {
        icon: 'celebrate',
        count: reactionCounts['celebrate'] || 0,
        label: 'celebrate',
      },
      {
        icon: 'support',
        count: reactionCounts['support'] || 0,
        label: 'support',
      },
      { icon: 'funny', count: reactionCounts['funny'] || 0, label: 'funny' },
      {
        icon: 'insightful',
        count: reactionCounts['insightful'] || 0,
        label: 'insightful',
      },
    ],
    [reactionCounts],
  );

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
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Reactions" onClose={closeModal} />
      <div>
        <div className="w-full flex justify-start border-b-1 border border-neutral-200 px-8">
          {tabHeaders
            .filter((headerItem) => headerItem.count > 0)
            .sort(
              (a, b) =>
                ((a.count < b.count) as any) - ((a.count > b.count) as any),
            )
            .map((eachHeader, index) => (
              <div
                className={`flex py-4 relative ${
                  isActive(eachHeader.label)
                    ? 'cursor-default'
                    : 'cursor-pointer'
                } ${index !== tabHeaders.length - 1 && 'mr-10'}`}
                onClick={() => setActiveTab(eachHeader.label)}
                key={index}
              >
                {eachHeader.icon && (
                  <div className="mr-3">
                    <Icon name={eachHeader.icon} />
                  </div>
                )}
                <div className={getClassName(eachHeader.label)}>
                  {index === 0 ? `All (${eachHeader.count})` : eachHeader.count}
                </div>
                {isActive(eachHeader.label) && (
                  <div className="absolute bottom-0 bg-primary-500 w-full rounded-7xl h-0.5"></div>
                )}
              </div>
            ))}
        </div>
        <div className="px-6">
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
      </div>
    </Modal>
  );
};

export default ReactionModal;
