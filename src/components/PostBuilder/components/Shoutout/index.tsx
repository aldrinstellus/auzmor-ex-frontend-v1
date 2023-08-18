import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from 'components/ModalHeader';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import Body from './Body';
import Button from 'components/Button';
import { Variant as ButtonVariant } from 'components/Button';

interface ICreateShoutoutProps {
  closeModal: () => void;
}

export enum SHOUTOUT_STEPS {
  UserSelect = 'USER_SELECT',
  ImageSelect = 'IMAGE_SELECT',
}

const CreateShoutout: React.FC<ICreateShoutoutProps> = ({ closeModal }) => {
  const { control, watch, setValue, resetField, getValues } = useForm<any>({
    defaultValues: {
      showSelectedMembers: false,
      selectAll: false,
      users: [],
    },
  });
  const { setActiveFlow, setUploads, setShoutoutUserIds } =
    useContext(CreatePostContext);
  const [step, setStep] = useState<SHOUTOUT_STEPS>(SHOUTOUT_STEPS.UserSelect);
  const [triggerSubmit, setTriggerSubmit] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileAdded, setIsFileAdded] = useState(false);

  const getFile = (file: any) => {
    if (file) {
      setUploads([file]);
    }
    setIsLoading(false);
    onSubmit();
  };

  const onSubmit = () => {
    const formData = getValues();
    if (formData.users && Object.keys(formData.users).length > 0) {
      const ids: string[] = [];
      Object.keys(formData.users).forEach((key) => {
        if (formData.users[key]) {
          ids.push(key);
        }
      });
      setShoutoutUserIds(ids);
    }
    setActiveFlow(CreatePostFlow.CreatePost);
  };

  const handleNext = () => {
    if (step === SHOUTOUT_STEPS.UserSelect) {
      const formData = getValues();
      const _users: any[] = [];
      Object.keys(formData.users).forEach((key) => {
        if (formData.users[key]) {
          _users.push({ id: key, name: 'Nitesh' });
        }
      });
      setUsers(_users);
      setStep(SHOUTOUT_STEPS.ImageSelect);
    } else {
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
      const formData = getValues();
      return (
        !formData.users ||
        Object.keys(formData.users).filter((key) => formData.users[key])
          .length === 0
      );
    }
    if (step === SHOUTOUT_STEPS.ImageSelect) {
      return !isFileAdded;
    }
    return true;
  };

  return (
    <div>
      <Header
        title="Give Kudos"
        onBackIconClick={handleBack}
        onClose={closeModal}
      />
      <Body
        step={step}
        triggerSubmit={triggerSubmit}
        getFile={getFile}
        setIsFileAdded={setIsFileAdded}
        control={control}
        watch={watch}
        setValue={setValue}
        resetField={resetField}
        users={users}
        selectedUserIds={users.map((user: any) => user.id)}
      />
      <div className="bg-blue-50 flex items-center justify-end p-3 gap-x-3 rounded-9xl w-full">
        <Button
          onClick={handleBack}
          label="Back"
          variant={ButtonVariant.Secondary}
        />
        <Button
          label="Next"
          loading={isLoading}
          variant={ButtonVariant.Primary}
          onClick={handleNext}
          disabled={isBtnDisabled()}
        />
      </div>
    </div>
  );
};

export default CreateShoutout;
