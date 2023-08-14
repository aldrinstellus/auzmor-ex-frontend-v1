import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppDetailsForm from './AppDetailsForm';
import clsx from 'clsx';
import AppCredentialsForm from './AppCredentialsForm';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TOAST_AUTOCLOSE_TIME, URL_REGEX } from 'utils/constants';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  App,
  AppAudience,
  AppIcon,
  IAddApp,
  createApp,
  editApp,
} from 'queries/apps';
import { useAppStore } from 'stores/appStore';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';

export enum APP_MODE {
  Create = 'CREATE',
  Edit = 'EDIT',
}

type AddAppProps = {
  open: boolean;
  closeModal: () => void | null;
  data?: App;
  mode?: APP_MODE;
};
export interface IAddAppForm {
  url: string;
  label: string;
  description?: string;
  category?: any;
  audience?: AppAudience[];
  icon?: any;
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

const AddApp: React.FC<AddAppProps> = ({
  open,
  closeModal,
  data,
  mode = APP_MODE.Create,
}) => {
  const {
    control,
    formState: { errors, isValid },
    trigger,
    setValue,
    getValues,
    reset,
  } = useForm<IAddAppForm>({
    resolver: yupResolver(AddAppFormSchema),
    mode: 'onChange',
    defaultValues: {
      url: data?.url || '',
      label: data?.label || '',
      description: data?.description || '',
      category: {
        label: data?.category?.name,
        value: data?.category?.name,
        id: data?.category?.categoryId,
      },
      audience: data?.audience || [],
      icon: data?.icon,
      acsUrl: data?.credentials?.acsUrl || '',
      entityId: data?.credentials?.entityId || '',
      relayState: data?.credentials?.relayState || '',
    },
  });
  const { apps, updateApp } = useAppStore();

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

  const updateAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload) => editApp(data?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      toast(
        <SuccessToast
          content={`App has been updated`}
          dataTestId="app-updated-success-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
      closeModal();
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error: any) => {
      toast(
        <FailureToast
          content={`Error Creating App`}
          dataTestId="app-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  const { uploadMedia, uploadStatus } = useUpload();

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
        <AppDetailsForm
          control={control}
          errors={errors}
          setValue={setValue}
          defaultValues={getValues}
        />
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
      if (formData.icon?.id) {
        uploadedFile = [{ id: formData.icon.id }];
      } else if (formData.icon) {
        uploadedFile = await uploadMedia([formData.icon], EntityType.AppIcon);
      }

      // Construct request body
      const req = {
        url: formData.url,
        label: formData.label,
        featured: false,
        ...(formData.description && { description: formData.description }),
        ...(formData.category &&
          formData.category.label && { category: formData.category.label }),
        ...(uploadedFile && uploadedFile[0] && { icon: uploadedFile[0].id }),
        audience: formData?.audience || [],
      };
      const credentials: any = {};
      if (formData.acsUrl) {
        credentials.acsUrl = formData.acsUrl;
      }
      if (formData.entityId) {
        credentials.entityId = formData.entityId;
      }
      if (formData.relayState) {
        credentials.relayState = formData.relayState;
      }
      req.credentials = credentials;
      if (mode === APP_MODE.Create) {
        addAppMutation.mutate(req);
      } else if (mode === APP_MODE.Edit) {
        updateAppMutation.mutate(req);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className="min-h-[630px] max-w-[800px] max-h-[650px]"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between">
          <p className="text-neutral-900 font-extrabold text-lg">Add app</p>
          <Icon name="close" disabled onClick={closeModal} />
        </div>
        <Divider />
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between h-full"
        >
          <Tabs tabs={tabs} disableAnimation={true} />
          <div className="bg-blue-50 flex items-center justify-end gap-x-3 px-6 py-4 mt-auto rounded-9xl">
            <Button
              label="Cancel"
              variant={ButtonVariant.Secondary}
              onClick={closeModal}
            />
            <Button
              label="Save"
              type={Type.Submit}
              loading={
                addAppMutation?.isLoading ||
                updateAppMutation.isLoading ||
                uploadStatus === UploadStatus.Uploading
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddApp;
