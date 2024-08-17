import { EntitySearchModalType } from 'components/EntitySearchModal';
import EntitySearchModalBody from 'components/EntitySearchModal/components/EntitySearchModalBody';
import Icon from 'components/Icon';
import { AudienceFlow } from 'components/PostBuilder/components/Audience';
import Spinner from 'components/Spinner';
import useRole from 'hooks/useRole';
import { useOrganization } from 'queries/organization';
import { FC, useEffect } from 'react';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import { IS_PROD } from 'utils/constants';

interface IAudienceSelectorProps {
  audienceFlow: AudienceFlow;
  setAudienceFlow: any;
  isEveryoneSelected: boolean;
  setIsEveryoneSelected: (value: boolean) => void;
  infoText?: string;
  dataTestId?: string;
}

const AudienceSelector: FC<IAudienceSelectorProps> = ({
  audienceFlow,
  setAudienceFlow,
  isEveryoneSelected,
  setIsEveryoneSelected,
  dataTestId,
  infoText = 'Your post will appear in Feed, on your profile and in search results. You can change the audience of this specific post.',
}) => {
  const { isAdmin } = useRole();
  const { data, isLoading } = useOrganization();
  const { form } = useEntitySearchFormStore();

  const [teams, channels, users] = form!.watch(['teams', 'channels', 'users']);

  useEffect(() => {
    if (
      !isAdmin &&
      !!data?.adminSettings?.postingControls?.limitGlobalPosting
    ) {
      setIsEveryoneSelected(false);
    }
  }, [data, isAdmin]);

  const audienceEntity = [
    {
      key: 'everyone',
      icon: 'people',
      title: 'Everyone',
      subTitle: 'Anyone who is a part of this organisation can see this post.',
      onClick: () => setIsEveryoneSelected(true),
      isHidden:
        data?.adminSettings?.postingControls?.limitGlobalPosting && !isAdmin,
      isSelected: isEveryoneSelected,
      selectedCount: 0,
      dataTestId: 'audience-selection-everyone',
    },
    {
      key: 'teams',
      icon: 'profileUser',
      title: 'Teams',
      subTitle: 'Select a team you are part of',
      onClick: () => setAudienceFlow(AudienceFlow.TeamSelect),
      isHidden: false,
      isSelected:
        teams &&
        Object.keys(teams).some(
          (id: string) => !!teams[id] && !isEveryoneSelected,
        ),
      selectedCount: teams
        ? Object.keys(teams).filter((id: string) => !!teams[id]).length
        : 0,
      dataTestId: 'audience-selection-teams',
    },
    {
      key: 'channels',
      icon: 'noteFavouriteOutline',
      title: 'Channels',
      subTitle: 'Select a channel you are part of',
      onClick: () => setAudienceFlow(AudienceFlow.ChannelSelect),
      isHidden: IS_PROD,
      isSelected:
        channels &&
        Object.keys(channels).some(
          (id: string) => !!channels[id] && !isEveryoneSelected,
        ),
      selectedCount: channels
        ? Object.keys(channels).filter((id: string) => !!channels[id]).length
        : 0,
      dataTestId: 'audience-selection-channel',
    },
  ].filter((entity) => !entity.isHidden);

  switch (audienceFlow) {
    case AudienceFlow.EntitySelect: {
      return (
        <div className="flex flex-col m-4">
          <div className="px-4 py-2 flex items-center bg-neutral-100 rounded-md mb-4">
            <div className="bg-neutral-200 p-1 rounded-7xl">
              <Icon name="infoCircleOutline" hover={false} />
            </div>
            <div className="ml-2.5 text-neutral-500 font-medium text-sm">
              {infoText}
            </div>
          </div>
          {isLoading ? (
            <Spinner className="w-full m-10" />
          ) : (
            audienceEntity.map((entity) => (
              <div
                key={entity.key}
                className={`flex p-4 border border-neutral-200 rounded-22xl mb-4 hover:shadow-xl group cursor-pointer justify-between items-center`}
                onClick={entity.onClick}
                data-testid={entity.dataTestId}
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full w-12 h-12 flex items-center justify-center bg-primary-50 group-hover:bg-primary-500 ${
                      entity.isSelected ? 'bg-primary-500' : ''
                    }`}
                  >
                    <Icon
                      name={entity.icon}
                      className={`text-neutral-500 group-hover:text-white ${
                        entity.isSelected ? 'text-white' : ''
                      }`}
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
                  <div
                    className="flex border rounded-17xl px-3 py-1 items-center bg-primary-50 h-6"
                    data-testid="audience-selection-selectedmsg"
                  >
                    <div>
                      <Icon
                        name="tickCircle"
                        size={16}
                        className="mr-1"
                        color="text-primary-500"
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
            ))
          )}
        </div>
      );
    }
    case AudienceFlow.UserSelect: {
      return (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.User}
          dataTestId={`${dataTestId}-user`}
          selectedMemberIds={
            users ? Object.keys(users).filter((key: string) => users[key]) : []
          }
        />
      );
    }
    case AudienceFlow.ChannelSelect: {
      return (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.Channel}
          dataTestId={`${dataTestId}-channel`}
          selectedChannelIds={
            channels
              ? Object.keys(channels).filter((key: string) => channels[key])
              : []
          }
        />
      );
    }
    case AudienceFlow.TeamSelect: {
      return (
        <EntitySearchModalBody
          entityType={EntitySearchModalType.Team}
          dataTestId={`${dataTestId}-team`}
          selectedTeamIds={
            teams ? Object.keys(teams).filter((key: string) => teams[key]) : []
          }
        />
      );
    }
    default:
      return <></>;
  }
};

export default AudienceSelector;
