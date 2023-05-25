import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { MyObjectType } from 'queries/post';
import React from 'react';
import Tabs from 'components/Tabs';
import ReactionTab from './ReactionTab';

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
  const getClassName = (isActive: boolean) =>
    `flex font-extrabold ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`;

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Reactions" onClose={closeModal} />
      <Tabs
        tabs={[
          {
            tabLable: (isActive) => (
              <div className={getClassName(isActive)}>
                {`All (${Object.values(reactionCounts).reduce(
                  (a, b) => a + b,
                  0,
                )})`}
              </div>
            ),
            tabContent: <ReactionTab postId={postId} activeTab={'all'} />,
          },
          {
            tabLable: (isActive) => (
              <>
                <div className="mr-3">
                  <Icon name="like" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['like']}
                </div>
              </>
            ),
            tabContent: <ReactionTab postId={postId} activeTab={'like'} />,
          },
          {
            tabLable: (isActive) => (
              <>
                <div className="mr-3">
                  <Icon name="love" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['love']}
                </div>
              </>
            ),
            tabContent: <ReactionTab postId={postId} activeTab={'love'} />,
          },
          {
            tabLable: (isActive) => (
              <>
                <div className="mr-3">
                  <Icon name="funny" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['funny']}
                </div>
              </>
            ),
            tabContent: <ReactionTab postId={postId} activeTab={'funny'} />,
          },
          {
            tabLable: (isActive) => (
              <>
                <div className="mr-3">
                  <Icon name="celebrate" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['celebrate']}
                </div>
              </>
            ),
            tabContent: <ReactionTab postId={postId} activeTab={'celebrate'} />,
          },
          {
            tabLable: (isActive) => (
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
              <ReactionTab postId={postId} activeTab={'insightful'} />
            ),
          },
          {
            tabLable: (isActive) => (
              <>
                <div className="mr-3">
                  <Icon name="support" />
                </div>
                <div className={getClassName(isActive)}>
                  {reactionCounts['support']}
                </div>
              </>
            ),
            tabContent: <ReactionTab postId={postId} activeTab={'support'} />,
          },
        ]}
      />
    </Modal>
  );
};

export default ReactionModal;
