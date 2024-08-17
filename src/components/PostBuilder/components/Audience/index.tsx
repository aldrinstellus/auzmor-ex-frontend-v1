import Header from 'components/ModalHeader';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import Footer from './Footer';
import AudienceSelector from 'components/AudienceSelector';
import { useForm } from 'react-hook-form';
import { IAudienceForm } from 'components/EntitySearchModal';
import { AudienceEntityType, IAudience } from 'queries/post';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import { IGetUser } from 'queries/users';

interface IAudienceProps {
  closeModal: () => void;
  dataTestId?: string;
}

export enum AudienceFlow {
  EntitySelect = 'ENTITY_SELECT',
  UserSelect = 'USER_SELECT',
  TeamSelect = 'TEAM_SELECT',
  ChannelSelect = 'CHANNEL_SELECT',
}

const Audience: FC<IAudienceProps> = ({ closeModal, dataTestId }) => {
  const { setActiveFlow, clearPostContext, audience, setAudience } =
    useContext(CreatePostContext);
  const [isEveryoneSelected, setIsEveryoneSelected] = useState<boolean>(
    audience && audience.length === 0 ? true : false,
  );
  const [audienceFlow, setAudienceFlow] = useState(AudienceFlow.EntitySelect);
  const { form, setForm } = useEntitySearchFormStore();

  const audienceForm = useForm<IAudienceForm>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
      teams: {
        ...(audience || [])
          .filter(
            (value: IAudience) => value.entityType === AudienceEntityType.Team,
          )
          .reduce(
            (obj, value) =>
              Object.assign(obj, {
                [value.entityId]: value || true,
              }),
            {},
          ),
      },
      channels: {
        ...(audience || [])
          .filter(
            (value: IAudience) =>
              value.entityType === AudienceEntityType.Channel,
          )
          .reduce(
            (obj, value) =>
              Object.assign(obj, {
                [value.entityId]: value || true,
              }),
            {},
          ),
      },
      users: {
        ...(audience || [])
          .filter(
            (value: IAudience) => value.entityType === AudienceEntityType.User,
          )
          .reduce(
            (obj, value) =>
              Object.assign(obj, {
                [value.entityId]: value || true,
              }),
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
          name: formData.channels[id].name,
        });
      }
    });
    Object.keys(formData.teams).forEach((id: string) => {
      if (formData.teams[id]) {
        localAudience.push({
          entityId: id,
          entityType: AudienceEntityType.Team,
          name: formData.teams[id].name,
        });
      }
    });
    Object.keys(formData.users).forEach((id: string) => {
      if (formData.users[id]) {
        localAudience.push({
          entityId: id,
          entityType: AudienceEntityType.User,
          name: (formData.users[id] as IGetUser)?.fullName,
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
        setActiveFlow(CreatePostFlow.CreatePost);
    }
  };

  const getTitleDataTestIds = useCallback(() => {
    switch (audienceFlow) {
      case AudienceFlow.ChannelSelect:
        return 'select-channel-modal';
      case AudienceFlow.TeamSelect:
        return 'select-team-modal';
      case AudienceFlow.UserSelect:
        return 'select-user-modal';
      default:
        return `${dataTestId}-modal`;
    }
  }, [audienceFlow]);
  return form ? (
    <>
      <form onSubmit={form?.handleSubmit(onSubmit)}>
        <Header
          title={getHeaderText()}
          onBackIconClick={handleBackButtonClick}
          onClose={() => {
            clearPostContext();
            closeModal();
          }}
          titleDataTestId={getTitleDataTestIds()}
          closeBtnDataTestId={`${dataTestId}-close`}
        />
        <AudienceSelector
          audienceFlow={audienceFlow}
          setAudienceFlow={setAudienceFlow}
          isEveryoneSelected={isEveryoneSelected}
          setIsEveryoneSelected={setIsEveryoneSelected}
          dataTestId="select"
        />
        <Footer
          isValid
          handleBackButtonClick={handleBackButtonClick}
          audienceFlow={audienceFlow}
          dataTestId={dataTestId}
        />
      </form>
    </>
  ) : (
    <></>
  );
};

export default Audience;
