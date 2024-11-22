import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Tabs from 'components/Tabs';
import { AudienceEntityType, IAudience } from 'interfaces';
import { FC } from 'react';
import AudienceTab from './AudienceTab';

export type AudienceCount = {
  teams: number;
  channels: number;
  users: number;
  all: number;
};

export const getAudienceCount = (audience: IAudience[]) => {
  const audienceCount: AudienceCount = {
    teams: 0,
    channels: 0,
    users: 0,
    all: 0,
  };
  audience.forEach((eachEntity) => {
    switch (eachEntity.entityType) {
      case AudienceEntityType.User:
        audienceCount.users += 1;
        break;
      case AudienceEntityType.Channel:
        audienceCount.channels += 1;
        break;
      case AudienceEntityType.Team:
        audienceCount.teams += 1;
        break;
      default:
        break;
    }
    audienceCount.all += 1;
  });
  return audienceCount;
};

export interface IAudienceModalProps {
  entityId: string;
  entity: 'posts' | 'apps';
  audienceCounts: AudienceCount;
  closeModal?: () => void;
}

const AudienceModal: FC<IAudienceModalProps> = ({
  closeModal,
  audienceCounts,
  entity,
  entityId,
}) => {
  const getClassName = (isActive: boolean) =>
    `flex font-extrabold ${
      isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
    }`;

  const tabOrder = ['all', 'teams', 'channels', 'users'];

  return (
    <Modal open={true} closeModal={closeModal} className="max-w-2xl">
      <Header title="Posted to" onClose={closeModal} />
      <Tabs
        tabContentClassName=""
        tabs={[
          {
            tabLabel: (isActive: boolean) => (
              <div
                className={getClassName(isActive)}
              >{`All (${audienceCounts.all})`}</div>
            ),
            hidden: true, // All tab is not needed
            tabContent: (
              <AudienceTab
                entity={entity}
                entityId={entityId}
                entityType={AudienceEntityType.All}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div
                  className={getClassName(isActive)}
                >{`Teams (${audienceCounts.teams})`}</div>
              </>
            ),
            hidden: false,
            tabContent: (
              <AudienceTab
                entity={entity}
                entityId={entityId}
                entityType={AudienceEntityType.Team}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div
                  className={getClassName(isActive)}
                >{`Channels (${audienceCounts.channels})`}</div>
              </>
            ),
            hidden: false,
            tabContent: (
              <AudienceTab
                entity={entity}
                entityId={entityId}
                entityType={AudienceEntityType.Channel}
              />
            ),
          },
          {
            tabLabel: (isActive: boolean) => (
              <>
                <div
                  className={getClassName(isActive)}
                >{`Users (${audienceCounts.users})`}</div>
              </>
            ),
            hidden: false,
            tabContent: (
              <AudienceTab
                entity={entity}
                entityId={entityId}
                entityType={AudienceEntityType.User}
              />
            ),
          },
        ]
          .filter((_tab, index) => {
            if (_tab.hidden) return false;
            if (index === 0) return true;
            else {
              return !!(audienceCounts as Record<string, number>)[
                tabOrder[index]
              ];
            }
          })
          .sort((a, b) => {
            if (a.tabContent.props.activeTab === 'all') {
              return -1;
            }
            return (
              (audienceCounts as Record<string, number>)[
                b.tabContent.props.activeTab
              ] -
              (audienceCounts as Record<string, number>)[
                a.tabContent.props.activeTab
              ]
            );
          })}
        className="px-6"
      />
    </Modal>
  );
};

export default AudienceModal;
