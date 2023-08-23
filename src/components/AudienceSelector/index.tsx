import {
  EntitySearchModalType,
  IAudienceForm,
} from 'components/EntitySearchModal';
import EntitySearchModalBody from 'components/EntitySearchModal/components/EntitySearchModalBody';
import Icon from 'components/Icon';
import { AudienceFlow } from 'components/PostBuilder/components/Audience';
import useRole from 'hooks/useRole';
import { useOrganization } from 'queries/organization';
import { AudienceEntityType, IAudience } from 'queries/post';
import { IGetUser } from 'queries/users';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Control,
  UseFormWatch,
  UseFormSetValue,
  UseFormResetField,
} from 'react-hook-form';
import _ from 'lodash';
import { PRIMARY_COLOR } from 'utils/constants';

interface IAudienceSelectorProps {
  audience: IAudience[];
  control: Control<IAudienceForm, any>;
  watch: UseFormWatch<IAudienceForm>;
  setValue: UseFormSetValue<IAudienceForm>;
  resetField: UseFormResetField<IAudienceForm>;
  audienceFlow: AudienceFlow;
  setAudienceFlow: any;
  setShowSaveChangesBtn?: (showSaveChangesBtn: boolean) => void;
}

const AudienceSelector: React.FC<IAudienceSelectorProps> = ({
  audience,
  control,
  watch,
  setValue,
  resetField,
  audienceFlow,
  setAudienceFlow,
  setShowSaveChangesBtn = () => {},
}) => {
  const { isAdmin } = useRole();
  const { data } = useOrganization();
  const [isEveryoneSelected, setIsEveryoneSelected] = useState<boolean>(
    audience.length === 0,
  );

  const formData = watch();

  useEffect(() => {
    const localAudience: IAudience[] = [];
    if (!isEveryoneSelected) {
      Object.keys(formData.channels).forEach((id: string) => {
        if (formData.channels[id]) {
          localAudience.push({
            entityId: id,
            entityType: AudienceEntityType.Channel,
          });
        }
      });
      Object.keys(formData.teams).forEach((id: string) => {
        if (formData.teams[id]) {
          localAudience.push({
            entityId: id,
            entityType: AudienceEntityType.Team,
          });
        }
      });
    }

    const diff = _.differenceWith(localAudience, audience, _.isEqual);

    if (diff.length) {
      setShowSaveChangesBtn(true);
    } else {
      setShowSaveChangesBtn(false);
    }
  }, [formData, audience, isEveryoneSelected]);

  useEffect(() => {
    if (!!data?.adminSettings?.postingControls.limitGlobalPosting) {
      setIsEveryoneSelected(false);
    }
  }, [data]);

  const audienceEntity = [
    {
      key: 'everyone',
      icon: '',
      title: 'Everyone',
      subTitle: 'Anyone who is a part of this organisation can see this post.',
      onClick: () => {
        setAudienceFlow(AudienceFlow.UserSelect);
        // setIsEveryoneSelected(!isEveryoneSelected);
      },
      isHidden:
        data?.adminSettings?.postingControls.limitGlobalPosting && !isAdmin,
      isSelected: isEveryoneSelected,
      selectedCount: 0,
    },
    // {
    //   key: 'channels',
    //   icon: 'noteFavouriteOutline',
    //   title: 'Channels',
    //   subTitle: 'Select a channel you are part of',
    //   onClick: () => {},
    //   isHidden: false,
    //   isSelected: Object.keys(formData.channels).some(
    //     (id: string) => !!formData.channels[id] && !isEveryoneSelected,
    //   ),
    //   selectedCount: Object.keys(formData.channels).filter(
    //     (id: string) => !!formData.channels[id],
    //   ).length,
    // },
    {
      key: 'teams',
      icon: 'profileUserOutline',
      title: 'Teams',
      subTitle: 'Select a team you are part of',
      onClick: () => setAudienceFlow(AudienceFlow.TeamSelect),
      isHidden: false,
      isSelected: Object.keys(formData.teams).some(
        (id: string) => !!formData.teams[id] && !isEveryoneSelected,
      ),
      selectedCount: Object.keys(formData.teams).filter(
        (id: string) => !!formData.teams[id],
      ).length,
    },
  ];

  switch (audienceFlow) {
    case AudienceFlow.EntitySelect: {
      return (
        <div className="flex flex-col m-4">
          <div className="px-4 py-2 flex items-center bg-neutral-100 rounded-md mb-4">
            <div className="bg-neutral-200 p-1 rounded-7xl">
              <Icon name="infoCircleOutline" />
            </div>
            <div className="ml-2.5 text-neutral-500 font-medium text-sm">
              Your post will appear in Feed, on your profile and in search
              results. You can change the audience of this specific post.
            </div>
          </div>
          {audienceEntity.map((entity) => (
            <div
              key={entity.key}
              className="flex p-4 border border-neutral-200 rounded-22xl mb-4 hover:shadow-xl group cursor-pointer justify-between items-center"
              onClick={entity.onClick}
            >
              <div className="flex items-center">
                <div
                  className={`rounded-full w-12 h-12 flex items-center justify-center bg-primary-50 group-hover:bg-primary-500 ${
                    entity.isSelected && 'bg-primary-500'
                  }`}
                >
                  <Icon
                    name={entity.icon || 'peopleOutline'}
                    hoverColor="white"
                    color={entity.isSelected ? 'white' : undefined}
                  />
                </div>
                <div className="ml-3 flex flex-col justify-between">
                  <div className="text-neutral-900 text-sm font-bold">
                    {entity.title}
                  </div>
                  <div className="text-neutral-500 text-xs font-base">
                    {entity.subTitle}
                  </div>
                </div>
              </div>
              {entity.selectedCount ? (
                <div className="flex border rounded-17xl px-3 py-1 items-center bg-primary-50 h-6">
                  <div>
                    <Icon
                      name="tickCircle"
                      size={16}
                      className="mr-1"
                      color={PRIMARY_COLOR}
                    />
                  </div>
                  <div className="text-xxs text-primary-500">
                    {entity.selectedCount} selected
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      );
    }
    case AudienceFlow.UserSelect: {
      return (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.User}
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          selectedMemberIds={audience
            .filter(
              (value: IAudience) =>
                value.entityType === AudienceEntityType.User,
            )
            .map((value: IAudience) => value.entityId)}
        />
      );
    }
    case AudienceFlow.ChannelSelect: {
      return (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.Channel}
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          selectedChannelIds={audience
            .filter(
              (value: IAudience) =>
                value.entityType === AudienceEntityType.Channel,
            )
            .map((value: IAudience) => value.entityId)}
        />
      );
    }
    case AudienceFlow.TeamSelect: {
      return (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.Team}
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          selectedTeamIds={audience
            .filter(
              (value: IAudience) =>
                value.entityType === AudienceEntityType.Team,
            )
            .map((value: IAudience) => value.entityId)}
        />
      );
    }
    default:
      return <></>;
  }
};

export default AudienceSelector;
