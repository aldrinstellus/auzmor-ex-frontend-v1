import { FC, ReactNode } from 'react';
import { EntitySearchModalType } from '..';
import MembersBody from './MembersBody';
import TeamsBody from './TeamsBody';
import ChannelsBody from './ChannelsBody';
import ChannelMembersBody from './ChannelMembersBody';

type ApiCallFunction = (queryParams: any) => any;
interface IEntitySearchModalBodyProps {
  entityType: EntitySearchModalType;
  entityRenderer?: (data: any) => ReactNode;
  selectedMemberIds?: string[];
  selectedChannelIds?: string[];
  selectedTeamIds?: string[];
  entitySearchLabel?: string;
  hideCurrentUser?: boolean;
  showJobTitleFilter?: boolean;
  disableKey?: string;
  dataTestId?: string;
  fetchUsers?: ApiCallFunction;
  fetchTeams?: ApiCallFunction;
  fetchChannels?: ApiCallFunction;
  usersQueryParams?: Record<string, any>;
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
  dataTestId,
  disableKey,
  fetchUsers,
  fetchTeams,
  fetchChannels,
  usersQueryParams,
}) => {
  switch (entityType) {
    case EntitySearchModalType.User:
      return (
        <MembersBody
          entityRenderer={entityRenderer}
          selectedMemberIds={selectedMemberIds}
          hideCurrentUser={hideCurrentUser}
          showJobTitleFilter={showJobTitleFilter}
          dataTestId={dataTestId || 'user'}
          disableKey={disableKey}
          entitySearchLabel={entitySearchLabel}
          fetchUsers={fetchUsers}
          usersQueryParams={usersQueryParams}
        />
      );
    case EntitySearchModalType.Team:
      return (
        <TeamsBody
          entityRenderer={entityRenderer}
          selectedTeamIds={selectedTeamIds}
          dataTestId={dataTestId || 'team'}
          fetchTeams={fetchTeams}
        />
      );
    case EntitySearchModalType.Channel:
      return (
        <ChannelsBody
          entityRenderer={entityRenderer}
          selectedChannelIds={selectedChannelIds}
          dataTestId={dataTestId || 'channel'}
          fetchChannels={fetchChannels}
        />
      );
    case EntitySearchModalType.ChannelMembers:
      return (
        <ChannelMembersBody
          dataTestId={dataTestId || 'channel-member'}
          fetchUsers={fetchUsers}
          usersQueryParams={usersQueryParams}
        />
      );
    default:
      return <></>;
  }
};

export default EntitySearchModalBody;
