import React, { ReactNode } from 'react';
import { EntitySearchModalType, IAudienceForm } from '..';
import MembersBody from './MembersBody';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
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
}

const EntitySearchModalBody: React.FC<IEntitySearchModalBodyProps> = ({
  entityType,
  entityRenderer,
  selectedMemberIds = [],
  selectedChannelIds = [],
  selectedTeamIds = [],
  entitySearchLabel,
  hideCurrentUser,
}) => {
  switch (entityType) {
    case EntitySearchModalType.User:
      return (
        <MembersBody
          entityRenderer={entityRenderer}
          selectedMemberIds={selectedMemberIds}
          hideCurrentUser={hideCurrentUser}
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
