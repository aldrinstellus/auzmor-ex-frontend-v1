import Header from 'components/ModalHeader';
import { FC, useEffect, useState } from 'react';
import AudienceSelector, { AudienceType } from 'components/AudienceSelector';
import { useForm } from 'react-hook-form';
import { IAudienceForm } from 'components/EntitySearchModal';
import { AudienceEntityType, IAudience } from 'interfaces';
import Footer from './Footer';
import { ADD_APP_FLOW } from './AddApp';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';

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

const Audience: FC<IAudienceProps> = ({
  audience,
  setAudience,
  setActiveFlow,
}) => {
  const [isEveryoneSelected, setIsEveryoneSelected] = useState<boolean>(
    audience.length === 0,
  );
  const [audienceFlow, setAudienceFlow] = useState(AudienceFlow.EntitySelect);
  const { form, setForm } = useEntitySearchFormStore();
  const audienceForm = useForm<IAudienceForm>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
      teams: {
        ...audience
          .filter(
            (value: IAudience) => value.entityType === AudienceEntityType.Team,
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
            (value: IAudience) => value.entityType === AudienceEntityType.User,
          )
          .reduce(
            (obj, value) => Object.assign(obj, { [value.entityId]: true }),
            {},
          ),
      },
    },
  });
  useEffect(() => {
    setForm(audienceForm);
    return () => setForm(null);
  }, []);

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
    const localAudience: IAudience[] = [];
    Object.keys(formData.channels).forEach((id: string) => {
      if (formData.channels[id]) {
        localAudience.push({
          entityId: id,
          name: formData.channels[id].name,
          entityType: AudienceEntityType.Channel,
        });
      }
    });
    Object.keys(formData.teams).forEach((id: string) => {
      if (formData.teams[id]) {
        localAudience.push({
          entityId: id,
          name: formData.teams[id].name,
          entityType: AudienceEntityType.Team,
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
          form!.setValue('channels', {});
          form!.setValue('teams', {});
          form!.setValue('users', {});
          setAudience([]);
        } else {
          setAudience(localAudience);
        }
        setActiveFlow(ADD_APP_FLOW.AddApp);
    }
  };
  return form ? (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Header
          title={getHeaderText()}
          onBackIconClick={handleBackButtonClick}
          onClose={() => {
            setActiveFlow(ADD_APP_FLOW.AddApp);
          }}
          closeBtnDataTestId="schedule-post-modal-close"
        />
        <AudienceSelector
          audienceType={AudienceType.AppAudience}
          audienceFlow={audienceFlow}
          setAudienceFlow={setAudienceFlow}
          isEveryoneSelected={isEveryoneSelected}
          setIsEveryoneSelected={setIsEveryoneSelected}
          dataTestId="add-app"
          infoText="The app will be visible to the audience selected. You can change the
            audience of this specific app."
        />
        <Footer
          isValid
          handleBackButtonClick={handleBackButtonClick}
          audienceFlow={audienceFlow}
        />
      </form>
    </>
  ) : (
    <></>
  );
};

export default Audience;
