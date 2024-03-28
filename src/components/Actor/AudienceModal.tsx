import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Tabs from 'components/Tabs';
import { FC } from 'react';

export interface IAudienceModalProps {
  entityId: string;
  entity: 'posts' | 'apps';
  closeModal?: () => void;
}

const AudienceModal: FC<IAudienceModalProps> = ({
  closeModal,
  // entity,
  // entityId,
}) => {
  const getClassName = (isActive: boolean) =>
    `flex font-extrabold ${
      isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
    }`;

  const tabOrder = ['all', 'teams', 'channels', 'users'];

  const reactionCounts: Record<string, number> = {
    teams: 10,
    channels: 20,
    users: 30,
    all: 60,
  };

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Audiences" onClose={closeModal} />
      <Tabs
        tabContentClassName=""
        tabs={[
          {
            tabLabel: (isActive: boolean) => (
              <div className={getClassName(isActive)}>All</div>
            ),
            // tabContent: (
            //   <AudienceTab
            //     entityId={postId}
            //     limit={30}
            //   />
            // ),
            tabContent: <></>,
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className={getClassName(isActive)}>Teams</div>
              </>
            ),
            // tabContent: (
            //   <AudienceTab
            //     entityId={postId}
            //     reaction="teams"
            //     limit={30}
            //   />
            // ),
            tabContent: <></>,
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className={getClassName(isActive)}>Channels</div>
              </>
            ),
            // tabContent: (
            //   <AudienceTab
            //     entityId={postId}
            //     reaction="love"
            //     limit={30}
            //   />
            // ),
            tabContent: <></>,
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div className={getClassName(isActive)}>Users</div>
              </>
            ),
            // tabContent: (
            //   <AudienceTab
            //     entityId={postId}
            //     reaction="users"
            //     limit={30}
            //   />
            // ),
            tabContent: <></>,
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

export default AudienceModal;
