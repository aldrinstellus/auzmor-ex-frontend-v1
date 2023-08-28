import Header from 'components/ModalHeader';
import React, { useState } from 'react';
import AudienceSelector from 'components/AudienceSelector';
import { useForm } from 'react-hook-form';
import { IAudienceForm } from 'components/EntitySearchModal';
import { AudienceEntityType, IAudience } from 'queries/apps';
import Footer from './Footer';
import { ADD_APP_FLOW } from './AddApp';
import Icon from 'components/Icon';

interface IAudienceProps {
  audience: IAudience[];
  setAudience: (audience: IAudience[]) => void;
  setActiveFlow: (param: ADD_APP_FLOW) => void;
}

export enum AudienceFlow {
  EntitySelect = 'ENTITY_SELECT',
  UserSelect = 'USER_SELECT',
  TeamSelect = 'TEAM_SELECT',
  ChannelSelect = 'CHANNEL_SELECT',
}

const Audience: React.FC<IAudienceProps> = ({
  audience,
  setAudience,
  setActiveFlow,
}) => {
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
  const [showSaveChangesBtn, setShowSaveChangesBtn] = useState(false);

  const getHeaderText = () => {
    switch (audienceFlow) {
      case AudienceFlow.UserSelect:
        return 'Select members';
      case AudienceFlow.ChannelSelect:
        return 'Select channels';
      case AudienceFlow.TeamSelect:
        return 'Select teams';
      default:
        return 'Select Audience';
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
        setActiveFlow(ADD_APP_FLOW.AddApp);
    }
  };

  const onSubmit = (formData: IAudienceForm) => {
    switch (audienceFlow) {
      case AudienceFlow.ChannelSelect:
      case AudienceFlow.TeamSelect:
      case AudienceFlow.UserSelect:
        setAudienceFlow(AudienceFlow.EntitySelect);
        return;
      default:
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
        setAudience(localAudience);
        setActiveFlow(ADD_APP_FLOW.AddApp);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header
          title={getHeaderText()}
          onBackIconClick={handleBackButtonClick}
          onClose={() => {
            setActiveFlow(ADD_APP_FLOW.AddApp);
          }}
          closeBtnDataTestId="schedule-post-modal-close"
        />
        <div className="px-2 py-4 rounded bg-neutral-100 shadow m-4 flex items-center gap-2">
          <div className="p-1 rounded bg-neutral-200">
            <Icon name="infoCircleOutline" />
          </div>
          <span className="text-sm">
            The app will be visible to the audience selected. You can change the
            audience of this specific app.
          </span>
        </div>
        <AudienceSelector
          audience={audience}
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          audienceFlow={audienceFlow}
          setAudienceFlow={setAudienceFlow}
          setShowSaveChangesBtn={setShowSaveChangesBtn}
        />
        <Footer
          isValid
          handleBackButtonClick={handleBackButtonClick}
          showSaveChangesBtn={showSaveChangesBtn}
          audienceFlow={audienceFlow}
        />
      </form>
    </>
  );
};

export default Audience;
