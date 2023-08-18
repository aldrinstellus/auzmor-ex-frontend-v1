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
  control: Control<IAudienceForm, any>;
  watch: UseFormWatch<IAudienceForm>;
  setValue: UseFormSetValue<IAudienceForm>;
  resetField: UseFormResetField<IAudienceForm>;
  entityRenderer?: (data: any) => ReactNode;
  selectedMemberIds?: string[];
  selectedChannelIds?: string[];
  selectedTeamIds?: string[];
}

const EntitySearchModalBody: React.FC<IEntitySearchModalBodyProps> = ({
  entityType,
  control,
  watch,
  setValue,
  resetField,
  entityRenderer,
  selectedMemberIds = [],
  selectedChannelIds = [],
  selectedTeamIds = [],
}) => {
  switch (entityType) {
    case EntitySearchModalType.User:
      return (
        <MembersBody
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          entityRenderer={entityRenderer}
          selectedMemberIds={selectedMemberIds}
        />
      );
    case EntitySearchModalType.Team:
      return (
        <TeamsBody
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          entityRenderer={entityRenderer}
          selectedTeamIds={selectedTeamIds}
        />
      );
    case EntitySearchModalType.Channel:
      return (
        <ChannelsBody
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          entityRenderer={entityRenderer}
          selectedChannelIds={selectedChannelIds}
        />
      );
    default:
      return <></>;
  }
};

export default EntitySearchModalBody;
