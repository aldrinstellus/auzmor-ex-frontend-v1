import Header from 'components/ModalHeader';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext, useState } from 'react';
import Footer from './Footer';
import AudienceSelector from 'components/AudienceSelector';
import { useForm } from 'react-hook-form';
import { IAudienceForm } from 'components/EntitySearchModal';
import { AudienceEntityType, IAudience } from 'queries/post';

interface IAudienceProps {
  closeModal: () => void;
}

export enum AudienceFlow {
  EntitySelect = 'ENTITY_SELECT',
  UserSelect = 'USER_SELECT',
  TeamSelect = 'TEAM_SELECT',
  ChannelSelect = 'CHANNEL_SELECT',
}

const Audience: React.FC<IAudienceProps> = ({ closeModal }) => {
  const { setActiveFlow, clearPostContext, audience, setAudience } =
    useContext(CreatePostContext);
  const [isEveryoneSelected, setIsEveryoneSelected] = useState<boolean>(
    !!!audience.length,
  );
  const { control, watch, handleSubmit, setValue, resetField } =
    useForm<IAudienceForm>({
      defaultValues: {
        showSelectedMembers: false,
        selectAll: false,
        teams: {
          ...audience
            .filter(
              (value: IAudience) =>
                value.entityType === AudienceEntityType.Team,
            )
            .reduce(
              (obj, value) => Object.assign(obj, { [value.entityId]: true }),
              {},
            ),
        },
        channels: {
          ...audience
            .filter(
              (value: IAudience) =>
                value.entityType === AudienceEntityType.Channel,
            )
            .reduce(
              (obj, value) => Object.assign(obj, { [value.entityId]: true }),
              {},
            ),
        },
        users: {
          ...audience
            .filter(
              (value: IAudience) =>
                value.entityType === AudienceEntityType.User,
            )
            .reduce(
              (obj, value) => Object.assign(obj, { [value.entityId]: true }),
              {},
            ),
        },
      },
    });
  const [audienceFlow, setAudienceFlow] = useState(AudienceFlow.EntitySelect);

  const getHeaderText = () => {
    switch (audienceFlow) {
      case AudienceFlow.UserSelect:
        return 'Select members';
      case AudienceFlow.ChannelSelect:
        return 'Select channels';
      case AudienceFlow.TeamSelect:
        return 'Select teams';
      default:
        return 'Who can see your post?';
    }
  };

  const handleBackButtonClick = () => {
    switch (audienceFlow) {
      case AudienceFlow.TeamSelect:
      case AudienceFlow.ChannelSelect:
      case AudienceFlow.UserSelect:
        setAudienceFlow(AudienceFlow.EntitySelect);
        return;
      default:
        setActiveFlow(CreatePostFlow.CreatePost);
    }
  };

  const onSubmit = (formData: IAudienceForm) => {
    const localAudience: IAudience[] = [];
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
    Object.keys(formData.users).forEach((id: string) => {
      if (formData.users[id]) {
        localAudience.push({
          entityId: id,
          entityType: AudienceEntityType.User,
        });
      }
    });
    switch (audienceFlow) {
      case AudienceFlow.ChannelSelect:
      case AudienceFlow.TeamSelect:
      case AudienceFlow.UserSelect:
        if (localAudience.length === 0) {
          setIsEveryoneSelected(true);
        } else {
          setIsEveryoneSelected(false);
        }
        setAudienceFlow(AudienceFlow.EntitySelect);
        return;
      default:
        if (isEveryoneSelected) {
          setValue('channels', {});
          setValue('teams', {});
          setValue('users', {});
          setAudience([]);
        } else {
          setAudience(localAudience);
        }
        setActiveFlow(CreatePostFlow.CreatePost);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title={getHeaderText()}
          onBackIconClick={handleBackButtonClick}
          onClose={() => {
            clearPostContext();
            closeModal();
          }}
          closeBtnDataTestId="schedule-post-modal-close"
        />
        <AudienceSelector
          audience={audience}
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          audienceFlow={audienceFlow}
          setAudienceFlow={setAudienceFlow}
          isEveryoneSelected={isEveryoneSelected}
          setIsEveryoneSelected={setIsEveryoneSelected}
        />
        <Footer
          isValid
          handleBackButtonClick={handleBackButtonClick}
          audienceFlow={audienceFlow}
        />
      </form>
    </>
  );
};

export default Audience;
