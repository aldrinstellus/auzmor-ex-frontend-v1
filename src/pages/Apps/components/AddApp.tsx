import Modal from 'components/Modal';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppDetailsForm from './AppDetailsForm';
import clsx from 'clsx';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, AppIcon, IAudience, createApp, editApp } from 'queries/apps';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import Audience from './Audience';
import Header from 'components/ModalHeader';
import { createCatergory, uploadImage } from 'queries/learn';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';
import { getUrlWithProtocol, isValidUrl } from 'utils/misc';
import { useDebounce } from 'hooks/useDebounce';
import { getPreviewLink } from 'queries/post';

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
  icon?: AppIcon & { file: File };
  acsUrl?: string;
  entityId?: string;
  relayState?: string;
  isNewCategory?: boolean;
}

const AddApp: FC<AddAppProps> = ({
  open,
  closeModal,
  data,
  mode = APP_MODE.Create,
}) => {
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'addApp',
  });

  const AddAppFormSchema = yup.object({
    url: yup
      .string()
      .required(t('requiredError'))
      .test('is-valid-url', t('validUrlError'), (value) =>
        isValidUrl(value || ''),
      ),
    label: yup
      .string()
      .required(t('requiredError'))
      .max(60, t('labelMaxError')),
    description: yup
      .string()
      .test(
        'len',
        t('descriptionError'),
        (val) => (val || '').toString().length <= 300,
      ),
    audience: yup.array(),
    icon: yup.object().nullable(),
    acsUrl: yup.string(),
    entityId: yup.string(),
    relayState: yup.string(),
  });
  const {
    control,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
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
  const { isLxp } = useProduct();
  const [activeFlow, setActiveFlow] = useState(ADD_APP_FLOW.AddApp);
  const [audience, setAudience] = useState<any>(data?.audience || []);

  const url = useDebounce(watch('url'), 800);

  useEffect(() => {
    if (!url) {
      return;
    }

    getPreviewLink(getUrlWithProtocol(url)).then((response) => {
      if (!getValues('label') && response?.title) {
        setValue('label', response.title);
      }
    });
  }, [url, setValue]);

  const queryClient = useQueryClient();

  const addAppMutation = useMutation({
    mutationKey: ['add-app-mutation'],
    mutationFn: createApp,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['apps']);
      await queryClient.invalidateQueries(['my-apps']);
      successToastConfig({ content: t('successToastContent') });
      closeModal();
      isLxp
        ? queryClient.invalidateQueries(['learnCategory'])
        : queryClient.invalidateQueries(['categories']);
    },
    onError: async () =>
      failureToastConfig({
        content: t('failureToastContent'),
        dataTestId: 'app-create-error-toaster',
      }),
  });

  const updateAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload) => editApp(data?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      queryClient.invalidateQueries(['my-apps']);
      queryClient.invalidateQueries(['featured-apps']);
      queryClient.invalidateQueries(['my-featured-apps']);
      successToastConfig({
        content: t('updateSuccessToastContent'),
        dataTestId: 'app-updated-success-toaster',
      });
      closeModal();
      isLxp
        ? queryClient.invalidateQueries(['learnCategory'])
        : queryClient.invalidateQueries(['categories']);
    },
    onError: (_error: any) =>
      failureToastConfig({
        content: t('updateFailureToastContent'),
        dataTestId: 'app-create-error-toaster',
      }),
  });
  const { mutateAsync: uploadImageMutation, isLoading: isUploading } =
    useMutation(uploadImage, {
      onSuccess: () => {},
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    });
  const { uploadMedia, uploadStatus } = useUpload();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    trigger();
    if (!errors.url && !errors.label && !errors.description) {
      const formData = getValues();
      let uploadedFile: any;
      let lxpCategoryId;
      if (isLxp) {
        const formPayload: any = new FormData();
        if (formData.icon?.file) {
          formPayload.append('url', formData?.icon?.file);
          const res = await uploadImageMutation(formPayload);
          uploadedFile = res.result?.data?.url;
        } else if (mode == APP_MODE.Edit && !formData.icon?.original) {
          uploadedFile = '';
        }
        // upload category to learn
        if (formData?.category && formData?.category?.isNew) {
          // already have category on learn db don't call this
          lxpCategoryId = await createCatergory({
            title: formData?.category?.label,
          });
          lxpCategoryId = lxpCategoryId?.result?.data?.id;
        } else {
          lxpCategoryId = formData?.category?.value;
        }
      } else {
        if (formData?.icon?.id) {
          uploadedFile = [{ id: formData?.icon.id }];
        } else if (formData.icon?.file) {
          uploadedFile = await uploadMedia(
            [formData.icon?.file],
            EntityType.AppIcon,
          );
        }
      }
      // Construct request body
      const req = {
        url: formData.url?.startsWith('http')
          ? formData.url
          : `https://${formData.url}`,
        label: formData.label,
        featured: mode === APP_MODE.Edit ? !!data?.featured : false,
        ...(formData.description && { description: formData.description }),
        ...(formData.category &&
          formData.category.label && { category: formData.category.label }),
        ...(uploadedFile && uploadedFile[0] && { icon: uploadedFile[0].id }),
        audience: audience || [],
      };
      const lxpReq = {
        url: formData.url?.startsWith('http')
          ? formData.url
          : `https://${formData.url}`,
        label: formData.label,
        featured: mode === APP_MODE.Edit ? !!data?.featured : false,
        ...(formData.description && { description: formData.description }),
        ...(formData.category &&
          lxpCategoryId && {
            category: lxpCategoryId.toString(),
          }),
        icon: uploadedFile,
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
      lxpReq.credentials = credentials;
      if (mode === APP_MODE.Create) {
        addAppMutation.mutate(isLxp ? lxpReq : req);
      } else if (mode === APP_MODE.Edit) {
        updateAppMutation.mutate(isLxp ? lxpReq : req);
      }
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
      setAudience([]);
    }
  }, [open]);

  const icon = watch('icon');

  return (
    <Modal
      open={open}
      className={clsx('max-w-[868px]', {
        'h-[600px]': activeFlow === ADD_APP_FLOW.AddApp,
        '!max-w-[638px]': activeFlow === ADD_APP_FLOW.AudienceSelector,
      })}
    >
      {activeFlow === ADD_APP_FLOW.AddApp && (
        <div className="flex flex-col h-full">
          <Header
            title={mode === APP_MODE.Create ? t('addApp') : t('editApp')}
            onClose={closeModal}
            closeBtnDataTestId="add-app-close"
          />
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-between h-full"
          >
            <div className="py-3 px-6">
              <AppDetailsForm
                control={control}
                errors={errors}
                setValue={setValue}
                defaultValues={getValues}
                setActiveFlow={setActiveFlow}
                icon={icon}
                audience={audience}
              />
            </div>
            <div className="bg-blue-50 flex items-center justify-between gap-x-3 px-6 py-4 mt-auto rounded-9xl">
              <p className="text-xs text-neutral-900">
                <span className="text-red-500">*</span> {t('requiredField')}
              </p>
              <div className="flex items-center gap-x-3">
                <Button
                  label={t('cancel')}
                  variant={ButtonVariant.Secondary}
                  onClick={closeModal}
                  dataTestId="add-app-cancel"
                />
                <Button
                  label={t('save')}
                  type={Type.Submit}
                  dataTestId="add-app-save"
                  loading={
                    isUploading ||
                    addAppMutation?.isLoading ||
                    updateAppMutation.isLoading ||
                    uploadStatus === UploadStatus.Uploading
                  }
                />
              </div>
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
