import { FC, ReactNode } from 'react';
import { EntitySearchModalType } from '..';
import MembersBody from './MembersBody';
import TeamsBody from './TeamsBody';
import ChannelsBody from './ChannelsBody';

interface IEntitySearchModalBodyProps {
  entityType: EntitySearchModalType;
  entityRenderer?: (data: any) => ReactNode;
  selectedMemberIds?: string[];
  selectedChannelIds?: string[];
  selectedTeamIds?: string[];
  entitySearchLabel?: string;
  hideCurrentUser?: boolean;
  showJobTitleFilter?: boolean;
}

const EntitySearchModalBody: FC<IEntitySearchModalBodyProps> = ({
  entityType,
  entityRenderer,
  selectedMemberIds = [],
  selectedChannelIds = [],
  selectedTeamIds = [],
  entitySearchLabel,
  hideCurrentUser,
  showJobTitleFilter,
}) => {
  switch (entityType) {
    case EntitySearchModalType.User:
      return (
        <MembersBody
          entityRenderer={entityRenderer}
          selectedMemberIds={selectedMemberIds}
          hideCurrentUser={hideCurrentUser}
          showJobTitleFilter={showJobTitleFilter}
          dataTestId="user"
          entitySearchLabel={entitySearchLabel}
        />
      );
    case EntitySearchModalType.Team:
      return (
        <TeamsBody
          entityRenderer={entityRenderer}
          selectedTeamIds={selectedTeamIds}
          dataTestId="team"
        />
      );
    case EntitySearchModalType.Channel:
      return (
        <ChannelsBody
          entityRenderer={entityRenderer}
          selectedChannelIds={selectedChannelIds}
          dataTestId="channel"
        />
      );
    default:
      return <></>;
  }
};

export default EntitySearchModalBody;
