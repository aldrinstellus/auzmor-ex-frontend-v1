import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import React from 'react';
import { useForm } from 'react-hook-form';
import AppDetailsForm from './AppDetailsForm';
import clsx from 'clsx';
import AppCredentialsForm from './AppCredentialsForm';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { URL_REGEX } from 'utils/constants';
import { useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApp } from 'queries/apps';

type AddAppProps = {
  open: boolean;
  closeModal: () => void | null;
};

export interface IAddAppForm {
  url: string;
  label: string;
  description?: string;
  category?: any;
  audience?: string;
  icon?: File;
  acsUrl?: string;
  entityId?: string;
  relayState?: string;
}

const AddAppFormSchema = yup.object({
  url: yup
    .string()
    .required('Required field')
    .matches(URL_REGEX, 'Enter a valid URL'),

  label: yup.string().required('Required field'),
  description: yup.string(),
  category: yup.object(),
  audience: yup.string(),
  icon: yup.object().nullable(),
  acsUrl: yup.string(),
  entityId: yup.string(),
  relayState: yup.string(),
});

const AddApp: React.FC<AddAppProps> = ({ open, closeModal }) => {
  const {
    control,
    formState: { errors, isValid },
    trigger,
    setValue,
    getValues,
  } = useForm<IAddAppForm>({
    resolver: yupResolver(AddAppFormSchema),
    mode: 'onChange',
  });

  const queryClient = useQueryClient();

  const addAppMutation = useMutation({
    mutationKey: ['add-app-mutation'],
    mutationFn: createApp,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['apps']);
      closeModal();
    },
    onError: async () => {},
  });

  const { uploadMedia } = useUpload();

  const tabStyles = (active: boolean) =>
    clsx({
      'text-neutral-900 font-bold cursor-pointer': true,
    });

  const tabs = [
    {
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Add apps</div>
      ),
      tabContent: (
        <AppDetailsForm control={control} errors={errors} setValue={setValue} />
      ),
    },
    {
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>App credentials</div>
      ),
      tabContent: <AppCredentialsForm control={control} errors={errors} />,
    },
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trigger();
    if (!errors.url && !errors.label) {
      const formData = getValues();
      let uploadedFile;
      if (formData.icon) {
        uploadedFile = await uploadMedia([formData.icon], EntityType.AppIcon);
      }

      // Construct request body
      const req = {
        url: formData.url,
        label: formData.label,
        featured: false,
        ...(formData.description && { description: formData.description }),
        ...(formData.category &&
          formData.category.label && { category: formData.category.labe }),
        ...(uploadedFile && uploadedFile[0] && { icon: uploadedFile[0].id }),
        audience: [],
      };

      addAppMutation.mutate(req);
    }
  };

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className="max-w-[800px] max-h-[650px]"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <p className="text-neutral-900 font-extrabold text-lg">Add app</p>
          <Icon name="close" disabled onClick={closeModal} />
        </div>
        <Divider />
        <form onSubmit={onSubmit}>
          <Tabs tabs={tabs} disableAnimation={true} />
          <div className="bg-blue-50 flex items-center justify-end gap-x-3 px-6 py-4 mt-auto rounded-9xl">
            <Button
              label="Cancel"
              variant={ButtonVariant.Secondary}
              onClick={closeModal}
            />
            <Button label="Save" type={Type.Submit} />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddApp;
