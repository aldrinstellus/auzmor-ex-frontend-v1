import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';
import Tabs from 'components/Tabs';
import ReactionTab from './ReactionTab';
import { IReactionsCount } from 'queries/post';

export interface IReactionModalProps {
  closeModal?: () => void;
  reactionCounts: IReactionsCount;
  postId: string;
  entityType: string;
}

const ReactionModal: React.FC<IReactionModalProps> = ({
  closeModal,
  reactionCounts,
  postId,
  entityType = 'post',
}) => {
  const getClassName = (isActive: boolean) =>
    `flex font-extrabold ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`;

  const tabOrder = [
    'all',
    'like',
    'love',
    'funny',
    'celebrate',
    'insightful',
    'support',
  ];

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Reactions" onClose={closeModal} />
      <Tabs
        tabContentClassName="px-6 h-[482px] overflow-y-auto" // update style
        tabs={[
          {
            tabLabel: (isActive: boolean) => (
              <div className={getClassName(isActive)}>
                {`All (${Object.values(reactionCounts).reduce(
                  (a, b) => a + b,
                  0,
                )})`}
              </div>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className="mr-3">
                  <Icon name="like" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['like']}
                </div>
              </>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  reaction: 'like',
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className="mr-3">
                  <Icon name="love" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['love']}
                </div>
              </>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  reaction: 'love',
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className="mr-3">
                  <Icon name="funny" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['funny']}
                </div>
              </>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  reaction: 'funny',
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className="mr-3">
                  <Icon name="celebrate" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['celebrate']}
                </div>
              </>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  reaction: 'celebrate',
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className="mr-3">
                  <Icon name="insightful" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['insightful']}
                </div>
              </>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  reaction: 'insightful',
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className="mr-3">
                  <Icon name="support" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['support']}
                </div>
              </>
            ),
            tabContent: (
              <ReactionTab
                getReactionQuery={{
                  entityId: postId,
                  reaction: 'support',
                  entityType,
                  limit: 5,
                }}
              />
            ),
          },
        ]
          .filter((tab, index) => {
            if (index === 0) return true;
            else {
              return !!reactionCounts[tabOrder[index]];
            }
          })
          .sort((a, b) => {
            if (a.tabContent.props.activeTab === 'all') {
              return -1;
            }
            return (
              reactionCounts[b.tabContent.props.activeTab] -
              reactionCounts[a.tabContent.props.activeTab]
            );
          })}
      />
    </Modal>
  );
};

export default ReactionModal;
