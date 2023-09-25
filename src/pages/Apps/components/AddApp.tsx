import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppDetailsForm from './AppDetailsForm';
import clsx from 'clsx';
// import AppCredentialsForm from './AppCredentialsForm';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TOAST_AUTOCLOSE_TIME, URL_REGEX } from 'utils/constants';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, IAudience, createApp, editApp } from 'queries/apps';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import Audience from './Audience';
import Header from 'components/ModalHeader';

export enum APP_MODE {
  Create = 'CREATE',
  Edit = 'EDIT',
}

export enum ADD_APP_FLOW {
  AddApp = 'ADD_APP',
  AudienceSelector = 'AUDIENCE_SELECTOR',
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
  audience?: IAudience[];
  icon?: any;
  acsUrl?: string;
  entityId?: string;
  relayState?: string;
}

const AddAppFormSchema = yup.object({
  url: yup
    .string()
    .required('This field cannot be empty')
    .matches(URL_REGEX, 'Enter a valid URL'),

  label: yup.string().required('This field cannot be empty'),
  description: yup
    .string()
    .test(
      'len',
      'Description cannot exceed 300 characters',
      (val) => (val || '').toString().length <= 300,
    ),
  audience: yup.array(),
  icon: yup.object().nullable(),
  acsUrl: yup.string(),
  entityId: yup.string(),
  relayState: yup.string(),
});

const AddApp: FC<AddAppProps> = ({
  open,
  closeModal,
  data,
  mode = APP_MODE.Create,
}) => {
  const {
    control,
    formState: { errors },
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
      category: data?.category?.categoryId
        ? {
            label: data?.category?.name,
            value: data?.category?.categoryId,
          }
        : null,
      audience: data?.audience || [],
      icon: data?.icon,
      acsUrl: data?.credentials?.acsUrl || '',
      entityId: data?.credentials?.entityId || '',
      relayState: data?.credentials?.relayState || '',
    },
  });
  const [activeFlow, setActiveFlow] = useState(ADD_APP_FLOW.AddApp);
  const [audience, setAudience] = useState<any>(data?.audience || []);
  // const [activeTab, setActiveTab] = useState(0);

  const queryClient = useQueryClient();

  const addAppMutation = useMutation({
    mutationKey: ['add-app-mutation'],
    mutationFn: createApp,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['apps']);
      queryClient.invalidateQueries(['my-apps']);
      toast(<SuccessToast content={'App added successfully'} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
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
      });
      closeModal();
      queryClient.invalidateQueries(['categories']);
    },
    onError: async () => {
      toast(
        <FailureToast
          content={`Error Creating App`}
          dataTestId="app-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
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

  const updateAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload) => editApp(data?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      queryClient.invalidateQueries(['my-apps']);
      queryClient.invalidateQueries(['featured-apps']);
      queryClient.invalidateQueries(['my-featured-apps']);
      toast(
        <SuccessToast
          content={`App has been updated`}
          dataTestId="app-updated-success-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
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
    onError: (_error: any) => {
      toast(
        <FailureToast
          content={`Error updating the app`}
          dataTestId="app-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
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

  // const tabStyles = (_active: boolean) =>
  //   clsx({
  //     'text-neutral-900 font-bold cursor-pointer': true,
  //   });

  // const tabs = [
  //   {
  //     tabLabel: (isActive: boolean) => (
  //       <div className={tabStyles(isActive)}>Add apps</div>
  //     ),
  //     dataTestId: 'add-app-addapps',
  //     tabContent: (
  //       <AppDetailsForm
  //         control={control}
  //         errors={errors}
  //         setValue={setValue}
  //         defaultValues={getValues}
  //         setActiveFlow={setActiveFlow}
  //         audience={audience}
  //       />
  //     ),
  //   },
  //   {
  //     tabLabel: (isActive: boolean) => (
  //       <div className={tabStyles(isActive)}>App credentials</div>
  //     ),
  //     disabled: !isValid,
  //     dataTestId: 'add-app-credentials',
  //     tabContent: <AppCredentialsForm control={control} errors={errors} />,
  //   },
  // ];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trigger();
    if (!errors.url && !errors.label && !errors.description) {
      const formData = getValues();
      let uploadedFile;
      if (formData?.icon?.id) {
        uploadedFile = [{ id: formData?.icon.id }];
      } else if (formData.icon) {
        uploadedFile = await uploadMedia([formData.icon], EntityType.AppIcon);
      }

      // Construct request body
      const req = {
        url: formData.url,
        label: formData.label,
        featured: mode === APP_MODE.Edit ? !!data?.featured : false,
        ...(formData.description && { description: formData.description }),
        ...(formData.category &&
          formData.category.label && { category: formData.category.label }),
        ...(uploadedFile && uploadedFile[0] && { icon: uploadedFile[0].id }),
        audience: audience || [],
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

  // const handleNextTab = (e: MouseEvent<Element>) => {
  //   e.preventDefault();
  //   trigger();
  //   if (isValid) {
  //     setActiveTab(activeTab + 1);
  //   }
  // };

  useEffect(() => {
    if (!open) {
      reset();
      // setActiveTab(0);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className={clsx('max-w-[868px]', {
        'min-h-[543px] max-h-[543px] ': activeFlow === ADD_APP_FLOW.AddApp,
        '!max-w-[638px]': activeFlow === ADD_APP_FLOW.AudienceSelector,
      })}
    >
      {activeFlow === ADD_APP_FLOW.AddApp && (
        <div className="flex flex-col h-full">
          <Header
            title={mode === APP_MODE.Create ? 'Add app' : 'Edit App'}
            onClose={closeModal}
            closeBtnDataTestId="add-app-close"
          />
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-between h-full"
          >
            {/* <Tabs
              tabs={tabs}
              disableAnimation={true}
              activeTabIndex={activeTab}
              onTabChange={(tab: any) => setActiveTab(tab)}
            /> */}
            <div className="py-3 px-6">
              <AppDetailsForm
                control={control}
                errors={errors}
                setValue={setValue}
                defaultValues={getValues}
                setActiveFlow={setActiveFlow}
                audience={audience}
              />
            </div>
            <div className="bg-blue-50 flex items-center justify-end gap-x-3 px-6 py-4 mt-auto rounded-9xl">
              <Button
                label="Cancel"
                variant={ButtonVariant.Secondary}
                onClick={closeModal}
                dataTestId="add-app-cancel"
              />
              <Button
                label="Save"
                type={Type.Submit}
                dataTestId="add-app-save"
                loading={
                  addAppMutation?.isLoading ||
                  updateAppMutation.isLoading ||
                  uploadStatus === UploadStatus.Uploading
                }
              />
              {/* {activeTab === tabs.length - 1 ? (
                <Button
                  label="Save"
                  type={Type.Submit}
                  dataTestId="add-app-save"
                  loading={
                    addAppMutation?.isLoading ||
                    updateAppMutation.isLoading ||
                    uploadStatus === UploadStatus.Uploading
                  }
                />
              ) : (
                <Button
                  label="Next"
                  disabled={!isValid}
                  onClick={(e) => handleNextTab(e)}
                  dataTestId="add-app-next-cta"
                />
              )} */}
            </div>
          </form>
        </div>
      )}
      {activeFlow === ADD_APP_FLOW.AudienceSelector && (
        <Audience
          setActiveFlow={setActiveFlow}
          audience={audience}
          setAudience={setAudience}
        />
      )}
    </Modal>
  );
};

export default AddApp;
