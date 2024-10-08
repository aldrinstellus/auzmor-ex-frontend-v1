import { FC, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from 'components/ModalHeader';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import Body from './Body';
import Button from 'components/Button';
import { Variant as ButtonVariant } from 'components/Button';
import { IAudienceForm } from 'components/EntitySearchModal';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import { PostType } from 'interfaces';
import { updateEditorValue } from 'components/DynamicImagePreview/utils';
import { useTranslation } from 'react-i18next';

interface ICreateShoutoutProps {
  closeModal: () => void;
}

export enum SHOUTOUT_STEPS {
  UserSelect = 'USER_SELECT',
  ImageSelect = 'IMAGE_SELECT',
}

const CreateShoutout: FC<ICreateShoutoutProps> = ({ closeModal }) => {
  const {
    setActiveFlow,
    setUploads,
    setShoutoutUserIds,
    setPostType,
    removeAllMedia,
    shoutoutUsers,
    editorValue,
    setShoutoutUsers,
    setShoutoutTemplate,
    setEditorValue,
    shoutoutTemplate,
  } = useContext(CreatePostContext);
  const { t } = useTranslation('postBuilder', { keyPrefix: 'createShoutout' });

  const { form, setForm } = useEntitySearchFormStore();
  const users = form ? form!.watch('users') : {};
  const audienceForm = useForm<IAudienceForm>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
      users: shoutoutUsers,
    },
  });
  const [step, setStep] = useState<SHOUTOUT_STEPS>(SHOUTOUT_STEPS.UserSelect);
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileAdded, setIsFileAdded] = useState(false);

  const getFile = (file: any) => {
    if (file) {
      removeAllMedia();
      setUploads([file]);
    }
    setIsLoading(false);
    onSubmit();
  };

  const onSubmit = () => {
    setPostType(PostType.Shoutout);
    setActiveFlow(CreatePostFlow.CreatePost);
  };
  const updateContext = () => {
    const _shoutoutUsers: any = Object.values(shoutoutUsers).filter(
      (user) => user,
    );
    const { text, html, editor } = updateEditorValue(
      _shoutoutUsers,
      shoutoutTemplate?.file?.label,
      'kudos',
    );

    const newContent = {
      text: text,
      html: html,
      editor,
    };

    setEditorValue(newContent);
  };
  const handleNext = () => {
    if (step === SHOUTOUT_STEPS.UserSelect) {
      const _users: any[] = [];
      const ids: any[] = [];
      Object.keys(users).forEach((key) => {
        if (users[key]) {
          _users.push(users[key]);
          ids.push(key);
        }
      });
      setSelectedUsers(_users);
      setShoutoutUserIds(ids);
      setShoutoutUsers(users);
      setStep(SHOUTOUT_STEPS.ImageSelect);
    } else {
      if (editorValue?.text == '\n' || editorValue?.text == '') {
        updateContext();
      } // only update context if text editor  empty
      setIsLoading(true);
      setTriggerSubmit(true);
    }
  };

  const handleBack = () => {
    if (step === SHOUTOUT_STEPS.ImageSelect) {
      setStep(SHOUTOUT_STEPS.UserSelect);
    } else {
      setActiveFlow(CreatePostFlow.CreatePost);
    }
  };

  const isBtnDisabled = () => {
    if (step === SHOUTOUT_STEPS.UserSelect) {
      return (
        !users || Object.keys(users).filter((key) => users[key]).length === 0
      );
    }
    if (step === SHOUTOUT_STEPS.ImageSelect) {
      return !isFileAdded;
    }
    return true;
  };

  useEffect(() => {
    setForm(audienceForm);
    return () => {
      setForm(null);
    };
  }, []);

  return form ? (
    <div>
      <Header
        title={t('giveKudos')}
        onBackIconClick={handleBack}
        onClose={closeModal}
        titleDataTestId={
          step === SHOUTOUT_STEPS.UserSelect
            ? 'createpost-givekudos'
            : 'kudos-uploading-button'
        }
        closeBtnDataTestId={
          step === SHOUTOUT_STEPS.UserSelect
            ? 'kudos-closemodal'
            : 'kudos-selectbanner-closemodal'
        }
      />
      <Body
        step={step}
        triggerSubmit={triggerSubmit}
        getFile={getFile}
        setIsFileAdded={setIsFileAdded}
        users={selectedUsers}
        shoutoutTemplate={shoutoutTemplate}
        setShoutoutTemplate={setShoutoutTemplate}
        selectedUserIds={Object.keys(users || {}).filter(
          (key: string) => users[key],
        )}
      />
      <div className="bg-blue-50 flex items-center justify-end p-3 gap-x-3 rounded-9xl w-full">
        <Button
          onClick={handleBack}
          label={t('back')}
          variant={ButtonVariant.Secondary}
          dataTestId={
            step === SHOUTOUT_STEPS.UserSelect
              ? 'kudos-givekudos-backcta'
              : 'kudos-selectbanner-back'
          }
        />
        <Button
          label={t('next')}
          loading={isLoading}
          variant={ButtonVariant.Primary}
          onClick={handleNext}
          disabled={isBtnDisabled()}
          dataTestId={
            step === SHOUTOUT_STEPS.UserSelect
              ? 'kudos-givekudos-nextcta'
              : 'kudos-selectbanner-next'
          }
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CreateShoutout;
