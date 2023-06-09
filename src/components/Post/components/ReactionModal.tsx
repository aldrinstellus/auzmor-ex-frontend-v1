import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';
import Tabs from 'components/Tabs';
import ReactionTab from './ReactionTab';

export interface IReactionModalProps {
  closeModal?: () => void;
  reactionCounts: Record<string, number>;
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

  console.log(reactionCounts);

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Reactions" onClose={closeModal} />
      <Tabs
        tabs={[
          {
            tabLable: (isActive: boolean) => (
              <div className={getClassName(isActive)}>
                {`All (${Object.values(reactionCounts).reduce(
                  (a, b) => a + b,
                  0,
                )})`}
              </div>
            ),
            tabContent: (
              <ReactionTab
                postId={postId}
                activeTab={'all'}
                entityType={entityType}
              />
            ),
          },
          {
            tabLable: (isActive: boolean) => (
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
                postId={postId}
                activeTab={'like'}
                entityType={entityType}
              />
            ),
          },
          {
            tabLable: (isActive: boolean) => (
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
                postId={postId}
                activeTab={'love'}
                entityType={entityType}
              />
            ),
          },
          {
            tabLable: (isActive: boolean) => (
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
                postId={postId}
                activeTab={'funny'}
                entityType={entityType}
              />
            ),
          },
          {
            tabLable: (isActive: boolean) => (
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
                postId={postId}
                activeTab={'celebrate'}
                entityType={entityType}
              />
            ),
          },
          {
            tabLable: (isActive: boolean) => (
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
                postId={postId}
                activeTab={'insightful'}
                entityType={entityType}
              />
            ),
          },
          {
            tabLable: (isActive: boolean) => (
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
                postId={postId}
                activeTab={'support'}
                entityType={entityType}
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
