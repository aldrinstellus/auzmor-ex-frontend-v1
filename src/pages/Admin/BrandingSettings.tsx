import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import NoAnnouncement from 'images/NoAnnouncement.svg';
import { useDropzone } from 'react-dropzone';
import {
  BlobToFile,
  getBlobUrl,
  getMediaObj,
  getMimeType,
  isDark,
  titleCase,
  twConfig,
} from 'utils/misc';
import { MB } from 'utils/constants';
import { IRadioListOption } from 'components/RadioGroup';
import { useUpdateBrandingMutation } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import useModal from 'hooks/useModal';
import ImageReposition from 'components/DynamicImagePreview/components/ImageReposition';
import clsx from 'clsx';
import { useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import Tooltip from 'components/Tooltip';
import { Logo } from 'components/Logo';
import welcomeToOffice from 'images/welcomeToOffice.png';
import welcomeToOfficeLarge from 'images/welcomeToOfficeLarge.png';
import { getTintVariantColor } from 'utils/branding';
import queryClient from 'utils/queryClient';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Shape } from 'components/ImageCropper';
import { useTranslation } from 'react-i18next';

const PRIMARY_COLOR = '#10B981';
const SECONDARY_COLOR = '#1D4ED8FF';

const Preview: FC<{
  file: File | null;
  url?: string;
  isVideo?: boolean;
  title?: string;
  description?: ReactNode;
  onCustomRemove?: () => void;
  onBrandingRemove?: () => void;
  imgClassName?: string;
  videoClassName?: string;
  className?: string;
  dataTestId?: string;
  showPreview?: boolean;
}> = ({
  file,
  url,
  title,
  description,
  onCustomRemove = () => {},
  onBrandingRemove = () => {},
  isVideo,
  imgClassName = '',
  videoClassName,
  className = '',
  dataTestId,
  showPreview = true,
}) => {
  const style = clsx({
    'max-h-full max-w-full relative h-full group/close bg-neutral-100 rounded-xl':
      true,
    [className]: true,
  });
  const imageStyle = clsx({
    [imgClassName]: true,
    'w-full h-full object-contain rounded-7xl': true,
  });
  return file ? (
    <div className={style}>
      {isVideo ? (
        <video
          src={getMediaObj([file])[0].original}
          className={videoClassName}
          data-testid={`branding-uploaded-${dataTestId}`}
          loop
          muted
          autoPlay
        />
      ) : (
        <img
          src={getMediaObj([file])[0].original}
          className={imageStyle}
          data-testid={`branding-uploaded-${dataTestId}`}
          alt="Preview Image"
        />
      )}

      <div
        className="absolute -right-3 -top-3 w-6 h-6 rounded-full hidden items-center justify-center bg-black group-hover/close:flex"
        onClick={(e) => {
          e.stopPropagation();
          onCustomRemove();
        }}
        data-testid={`branding-remove-${dataTestId}`}
      >
        <Icon name="close" size={16} color="text-white" />
      </div>
    </div>
  ) : url && !showPreview ? (
    <div className={style}>
      {isVideo ? (
        <video
          src={url}
          className={videoClassName}
          data-testid={`branding-uploaded-${dataTestId}`}
          loop
          muted
          autoPlay
        />
      ) : (
        <img
          src={url}
          className={imageStyle}
          data-testid={`branding-uploaded-${dataTestId}`}
          alt="Image preview"
        />
      )}

      <div
        className="absolute -right-3 -top-3 w-6 h-6 rounded-full hidden items-center justify-center bg-black group-hover/close:flex"
        onClick={(e) => {
          e.stopPropagation();
          onBrandingRemove();
        }}
        data-testid={`branding-remove-${dataTestId}`}
      >
        <Icon name="close" size={16} color="text-white" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2">
      <Icon name="documentUpload" color="text-neutral-900" hover={false} />
      <div
        className="text-neutral-900 font-medium"
        data-testid={`branding-upload${dataTestId}`}
      >
        {title}
      </div>
      <div
        className="mt-1 text-neutral-500 text-xs text-center"
        data-testid={`branding-upload${dataTestId}-msg`}
      >
        {description}
      </div>
    </div>
  );
};

const BrandingSettings: FC = () => {
  const { t } = useTranslation('adminSetting', { keyPrefix: 'branding' });
  const { branding, setBranding } = useBrandingStore();
  const backgroundOption: IRadioListOption[] = [
    {
      data: { value: t('color') },
      dataTestId: 'branding-background-as-color',
    },
    {
      data: { value: t('video') },
      dataTestId: 'branding-background-as-video',
    },
    {
      data: { value: t('image') },
      dataTestId: 'branding-background-as-image',
    },
  ];

  const schema = yup.object({
    text: yup
      .string()
      .trim()
      .min(3, t('min-validation'))
      .max(50, t('max-validation')),
    pageTitle: yup
      .string()
      .trim()
      .min(3, t('min-validation'))
      .max(50, t('max-validation')),
  });
  const { control, setValue, watch, reset, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      primaryColor: branding?.primaryColor || PRIMARY_COLOR,
      secondaryColor: branding?.secondaryColor || SECONDARY_COLOR,
      backgroundType:
        titleCase(branding?.loginConfig?.backgroundType || '') ||
        titleCase(backgroundOption[2].data.value),
      color: branding?.loginConfig?.color || '#777777',
      pageTitle: branding?.pageTitle || t('page-title-default'),
      text: branding?.loginConfig?.text,
    },
  });
  const [tempfile, setTempFile] = useState<File | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedFavicon, setSelectedFavicon] = useState<File | null>(null);
  const [selectedBG, setSelectedBG] = useState<File | null>(null);
  const [selectedBGVideo, setSelectedBGVideo] = useState<File | null>(null);
  const [showSecondaryColor, setShowSecondaryColor] = useState(false);
  const [layoutAlignment, setLayoutAlignment] = useState<
    'CENTER' | 'LEFT' | 'RIGHT'
  >(branding?.loginConfig?.layout || 'RIGHT');
  const [removedMedia, setRemovedMedia] = useState<{
    logo: boolean;
    favicon: boolean;
    bg: boolean;
    bgVideo: boolean;
  }>({ logo: false, favicon: false, bg: false, bgVideo: false });
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveChanges, setShowSaveChanges] = useState(false);

  const [primaryColor, secondaryColor, backgroundType, color, pageTitle, text] =
    watch([
      'primaryColor',
      'secondaryColor',
      'backgroundType',
      'color',
      'pageTitle',
      'text',
    ]);
  const [isEditLogoModalOpen, openEditLogoModal, closeEditLogoModal] =
    useModal();
  const [isEditFaviconModalOpen, openEditFaviconModal, closeEditFaviconModal] =
    useModal();
  const [isEditBGModalOpen, openEditBGModal, closeEditBGModal] = useModal();

  const { uploadMedia } = useUpload();

  const updateBranding = useUpdateBrandingMutation();

  const [validationErrors, setValidationErrors] = useState<{
    logo: string | null;
    favicon: string | null;
    bg: string | null;
    bgVideo: string | null;
  }>({ logo: null, favicon: null, bg: null, bgVideo: null });

  useEffect(() => {
    if (
      selectedLogo ||
      selectedFavicon ||
      selectedBG ||
      selectedBGVideo ||
      removedMedia.logo ||
      removedMedia.favicon ||
      removedMedia.bg ||
      removedMedia.bgVideo
    ) {
      setShowSaveChanges(true);
    }
  }, [
    selectedLogo,
    selectedFavicon,
    selectedBG,
    selectedBGVideo,
    removedMedia,
  ]);

  const {
    getRootProps: getRootPropsLogo,
    getInputProps: getInputPropsLogo,
    inputRef: logoInputRef,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setTempFile(acceptedFiles[0]);
        openEditLogoModal();
        setValidationErrors({ ...validationErrors, logo: null });
      } else {
        setSelectedLogo(null);
        closeEditLogoModal();
      }
    },
    onDropRejected: (rejection) => {
      // extension validation
      const error = rejection[0].errors[0];
      if (error.code === 'file-invalid-type') {
        setValidationErrors({
          ...validationErrors,
          logo: 'Invalid file type.',
        });
        return;
      }
      if (error.code === 'file-size-exceed') {
        setValidationErrors({ ...validationErrors, logo: error.message });
        return;
      }
    },
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/svg': ['.svg'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    validator: (file) => {
      // size validation
      if (file.size > 5 * MB) {
        return {
          code: 'file-size-exceed',
          message: 'The file size exceeds the limit',
        };
      }
      return null;
    },
  });

  const {
    getRootProps: getRootPropsFavicon,
    getInputProps: getInputPropsFavicon,
    inputRef: faviconInputRef,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setTempFile(acceptedFiles[0]);
        openEditFaviconModal();
        setValidationErrors({ ...validationErrors, favicon: null });
      } else {
        setSelectedFavicon(null);
        closeEditFaviconModal();
      }
    },
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/svg': ['.svg'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/x-icon': ['.ico'],
    },
    onDropRejected: (rejection) => {
      // extension validation
      const error = rejection[0].errors[0];
      if (error.code === 'file-invalid-type') {
        setValidationErrors({
          ...validationErrors,
          favicon: 'Invalid file type.',
        });
        return;
      }
      if (error.code === 'file-size-exceed') {
        setValidationErrors({ ...validationErrors, favicon: error.message });
        return;
      }
    },
    validator: (file) => {
      // size validation
      if (file.size > 5 * MB) {
        return {
          code: 'file-size-exceed',
          message: t('fileSize-error'),
        };
      }
      return null;
    },
  });

  const {
    getRootProps: getRootPropsBG,
    getInputProps: getInputPropsBG,
    inputRef: bgInputRef,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setTempFile(acceptedFiles[0]);
        setSelectedBGVideo(null);
        openEditBGModal();
        setValidationErrors({ ...validationErrors, bg: null });
      } else {
        setSelectedBG(null);
        closeEditBGModal();
      }
    },
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    onDropRejected: (rejection) => {
      // extension validation
      const error = rejection[0].errors[0];
      if (error.code === 'file-invalid-type') {
        setValidationErrors({
          ...validationErrors,
          bg: 'Invalid file type.',
        });
        return;
      }
      if (error.code === 'file-size-exceed') {
        setValidationErrors({ ...validationErrors, bg: error.message });
        return;
      }
    },
    validator: (file) => {
      // size validation
      if (file.size > 50 * MB) {
        return {
          code: 'file-size-exceed',
          message: t('fileSize-error'),
        };
      }
      return null;
    },
  });

  const {
    getRootProps: getRootPropsBGVideo,
    getInputProps: getInputPropsBGVideo,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedBGVideo(acceptedFiles[0]);
        setSelectedBG(null);
        setValidationErrors({ ...validationErrors, bgVideo: null });
      } else {
        setSelectedBGVideo(null);
      }
    },
    maxFiles: 1,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    onDropRejected: (rejection) => {
      // extension validation
      const error = rejection[0].errors[0];
      if (error.code === 'file-invalid-type') {
        setValidationErrors({
          ...validationErrors,
          bgVideo: 'Invalid file type.',
        });
        return;
      }
      if (error.code === 'file-size-exceed') {
        setValidationErrors({ ...validationErrors, bgVideo: error.message });
        return;
      }
    },
    validator: (file) => {
      // size validation
      if (file.size > 500 * MB) {
        return {
          code: 'file-size-exceed',
          message: t('fileSize-error'),
        };
      }
      return null;
    },
  });

  const handleSaveChanges = async () => {
    setIsSaving(true);

    // upload logo file if exist
    let uploadedLogo = null;
    if (selectedLogo) {
      uploadedLogo = await uploadMedia(
        [
          BlobToFile(
            selectedLogo,
            `id-${Math.random().toString(16).slice(2)}`,
            selectedLogo.type,
          ),
        ],
        EntityType.OrgLogo,
      );
    } else if (!removedMedia.logo && branding?.logo?.original) {
      uploadedLogo = [branding?.logo];
    }

    // upload favicon file if exist
    let uploadedFavicon = null;
    if (selectedFavicon) {
      uploadedFavicon = await uploadMedia(
        [
          BlobToFile(
            selectedFavicon,
            `id-${Math.random().toString(16).slice(2)}`,
            selectedFavicon.type,
          ),
        ],
        EntityType.OrgFavicon,
      );
    } else if (!removedMedia.favicon && branding?.favicon?.original) {
      uploadedFavicon = [branding?.favicon];
    }

    // upload background file if exist
    let uploadedBG = null;
    if (selectedBG) {
      uploadedBG = await uploadMedia(
        [
          BlobToFile(
            selectedBG,
            `id-${Math.random().toString(16).slice(2)}`,
            selectedBG.type,
          ),
        ],
        EntityType.OrgLoginImage,
      );
    } else if (!removedMedia.bg && branding?.loginConfig?.image?.original) {
      uploadedBG = [branding?.loginConfig?.image];
    }

    // upload background exist
    let uploadedBGVideo = null;
    if (selectedBGVideo) {
      uploadedBGVideo = await uploadMedia(
        [selectedBGVideo],
        EntityType.OrgLoginVideo,
      );
    } else if (
      !removedMedia.bgVideo &&
      branding?.loginConfig?.video?.original
    ) {
      uploadedBGVideo = [branding?.loginConfig?.video];
    }

    // new branding object
    const newBranding = {
      primaryColor,
      secondaryColor:
        secondaryColor === SECONDARY_COLOR ? undefined : secondaryColor,
      pageTitle,
      logo: uploadedLogo ? uploadedLogo[0] : undefined,
      favicon: uploadedFavicon ? uploadedFavicon[0] : undefined,
      loginConfig: {
        layout: layoutAlignment,
        backgroundType: backgroundType.toLocaleUpperCase() as any,
        text,
        color,
        image: uploadedBG ? uploadedBG[0] : undefined,
        video: uploadedBGVideo ? uploadedBGVideo[0] : undefined,
      },
    };
    updateBranding.mutate(newBranding, {
      onSuccess: async (data, _variables, _context) => {
        const newBranding = data?.result?.data?.branding;
        successToastConfig({
          content: t('toast-success'),
          dataTestId: 'branding-changes-saved-toaster',
        });
        await queryClient.refetchQueries(['organization']);
        handleCancel(
          {
            primaryColor: newBranding.primaryColor,
            secondaryColor: newBranding.secondaryColor,
            pageTitle: newBranding?.pageTitle,
            text: newBranding?.loginConfig?.text,
            color: newBranding?.loginConfig?.color,
            backgroundType: titleCase(newBranding?.loginConfig?.backgroundType),
          },
          newBranding?.loginConfig?.layout,
        );
        setBranding(newBranding);
      },
      onError: () => {
        failureToastConfig({
          content: t('toast-fail'),
          dataTestId: 'branding-changes-not-saved-toaster',
        });
        handleCancel();
      },
      onSettled: () => {
        setIsSaving(false);
      },
    });
  };

  const handleCancel = (
    formData?: any,
    layoutAlignment?: 'RIGHT' | 'LEFT' | 'CENTER',
  ) => {
    setShowSaveChanges(false);
    reset(
      !!formData
        ? formData
        : {
            primaryColor: branding?.primaryColor || PRIMARY_COLOR,
            secondaryColor: branding?.secondaryColor || SECONDARY_COLOR,
            backgroundType:
              titleCase(branding?.loginConfig?.backgroundType || '') ||
              titleCase(backgroundOption[2].data.value),
            color: branding?.loginConfig?.color || '#777777',
            pageTitle: branding?.pageTitle || t('page-title-default'),
            text: branding?.loginConfig?.text,
          },
    );
    setSelectedLogo(null);
    setSelectedFavicon(null);
    setSelectedBG(null);
    setSelectedBGVideo(null);
    setLayoutAlignment(
      layoutAlignment
        ? layoutAlignment
        : branding?.loginConfig?.layout || 'RIGHT',
    );
    setRemovedMedia({ logo: false, favicon: false, bg: false, bgVideo: false });
  };

  const validationErrorTemplate = (
    message: string,
    onClick: () => void,
    dataTestId?: string,
  ) => {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        onClick={onClick}
      >
        <Icon name="infoCircle" color="text-red-500" size={32} />
        <p
          className="text-red-500 font-medium text-sm mt-2"
          data-testid={`branding-${dataTestId}-failed`}
        >
          {t('upload-fail')}
        </p>
        <p className="text-neutral-500 text-xs font-medium mt-3">
          {message}{' '}
          <span
            className="text-primary-500 font-bold"
            data-testid="upload-again"
          >
            {t('try-again')}
          </span>
        </p>
      </div>
    );
  };

  const getBackgroundImg = () => {
    if (layoutAlignment === 'CENTER') {
      if (removedMedia.bg) {
        return (
          <img
            className="absolute top-0 left-0 object-cover h-full w-full"
            src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOfficeLarge}
            alt="Background image preview"
          />
        );
      } else {
        if (branding?.loginConfig?.image?.original) {
          return (
            <img
              className="absolute top-0 left-0 object-cover h-full w-full"
              src={
                selectedBG
                  ? getBlobUrl(selectedBG)
                  : branding?.loginConfig?.image?.original
              }
              alt="Background image preview"
            />
          );
        } else {
          return (
            <img
              className="absolute top-0 left-0 object-cover h-full w-full"
              src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOfficeLarge}
              alt="Background image preview"
            />
          );
        }
      }
    } else {
      if (layoutAlignment === 'LEFT') {
        if (removedMedia.bg) {
          return (
            <div className={`absolute top-0 right-0 object-cover h-full w-1/2`}>
              <img
                className="object-cover h-full"
                src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
                alt="Background image preview"
              />
            </div>
          );
        } else {
          if (branding?.loginConfig?.image?.original) {
            return (
              <div
                className={`absolute top-0 right-0 object-cover h-full w-1/2`}
              >
                <img
                  className="object-cover h-full"
                  src={
                    selectedBG
                      ? getBlobUrl(selectedBG)
                      : branding?.loginConfig?.image?.original
                  }
                  alt="Background image preview"
                />
              </div>
            );
          } else {
            return (
              <div
                className={`absolute top-0 right-0 object-cover h-full w-1/2`}
              >
                <img
                  className="object-cover h-full"
                  src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
                  alt="Background image preview"
                />
              </div>
            );
          }
        }
      } else {
        if (removedMedia.bg) {
          return (
            <div className={`absolute top-0 left-0 object-cover h-full w-1/2`}>
              <img
                className="object-cover h-full"
                src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
                alt="Background image preview"
              />
            </div>
          );
        } else {
          if (branding?.loginConfig?.image?.original) {
            return (
              <div className="absolute top-0 left-0 object-cover h-full w-1/2">
                <img
                  className="object-cover h-full"
                  src={
                    selectedBG
                      ? getBlobUrl(selectedBG)
                      : branding?.loginConfig?.image?.original
                  }
                  alt="Background image preview"
                />
              </div>
            );
          } else {
            return (
              <div
                className={`absolute top-0 left-0 object-cover h-full w-1/2`}
              >
                <img
                  className="object-cover h-full"
                  src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
                  alt="Background image preview"
                />
              </div>
            );
          }
        }
      }
    }
  };

  const getBackgroundVideo = () => {
    if (selectedBGVideo) {
      return (
        <video
          className={`absolute top-0 object-cover h-full ${
            layoutAlignment === 'CENTER' ? 'w-full' : 'w-1/2'
          } ${layoutAlignment === 'LEFT' && 'right-0'} ${
            layoutAlignment === 'RIGHT' && 'left-0'
          }`}
          src={getBlobUrl(selectedBGVideo)}
          loop
          muted
          autoPlay
        />
      );
    } else if (
      branding?.loginConfig?.video?.original &&
      !removedMedia.bgVideo
    ) {
      return (
        <video
          className={`absolute top-0 right-0 object-cover h-full ${
            layoutAlignment === 'CENTER' ? 'w-full' : 'w-1/2'
          } ${layoutAlignment === 'LEFT' && 'right-0'} ${
            layoutAlignment === 'RIGHT' && 'left-0'
          }`}
          src={branding?.loginConfig?.video?.original}
          loop
          muted
          autoPlay
        />
      );
    } else {
      return <></>;
    }
  };

  const getSavingButtons = useMemo(
    () => (
      <div className="flex gap-2">
        <Button
          label={t('cancelCTA')}
          variant={Variant.Secondary}
          onClick={(_e) => handleCancel()}
          disabled={isSaving || !formState.isValid}
          dataTestId="branding-cancelcta"
        />
        <Button
          label={t('saveCTA')}
          loading={isSaving}
          onClick={handleSaveChanges}
          dataTestId="branding-savechangescta"
          disabled={!formState.isValid}
        />
      </div>
    ),
    [isSaving, formState],
  );

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-4">
            <p className="text-neutral-900 text-base font-bold">{t('title')}</p>
            {/* <p className="text-neutral-500 text-sm" data-testid="branding-note">
              Branding Options for a Personalized Experience
            </p> */}
          </div>
          <div className="flex flex-col">
            {(formState.isDirty || showSaveChanges) && getSavingButtons}
            <div></div>
          </div>
        </div>
      </Card>
      <Collapse
        defaultOpen
        label={t('page-settings')}
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-pagesettings"
        height={413}
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4 rounded-b-9xl">
          <Divider />
          <Layout
            fields={[
              {
                name: 'pageTitle',
                label: t('page-title'),
                type: FieldType.Input,
                control,
                className: '',
                dataTestId: 'branding-pagetitle',
                error: formState?.errors?.pageTitle?.message,
                helpText:
                  branding?.pageTitle === 'Auzmor office'
                    ? `${t('help-text')}`
                    : '',
                customLabelRightElement: (
                  <span
                    className={`text-sm ${
                      formState?.errors?.pageTitle?.message
                        ? 'text-red-500'
                        : 'text-neutral-500'
                    }`}
                  >
                    {pageTitle?.length || 0} / 50
                  </span>
                ),
              },
            ]}
          />
          <div className="flex gap-[100px]">
            <div className="flex flex-col w-1/2 gap-1">
              <label className="font-bold" htmlFor={getInputPropsLogo().id}>
                {t('logo')}
              </label>
              <div
                {...getRootPropsLogo()}
                className="border border-dashed border-neutral-200 rounded-9xl p-6 w-full h-[186px] flex justify-center items-center cursor-pointer"
              >
                <input {...getInputPropsLogo()} data-testid="upload-logo" />
                {validationErrors.logo ? (
                  validationErrorTemplate(
                    validationErrors.logo,
                    () => {
                      setValidationErrors({ ...validationErrors, logo: null });
                    },
                    'logo',
                  )
                ) : (
                  <Preview
                    file={selectedLogo}
                    url={branding?.logo?.original}
                    title={t('upload-logo')}
                    description={
                      <span>
                        {t('drag-drop')}{' '}
                        <span className="text-primary-500 font-bold">
                          {t('click-here')}
                        </span>{' '}
                        {t('to-upload')} <br /> {t('recommend-size')} 225 x 100
                        px
                      </span>
                    }
                    onCustomRemove={() => {
                      setSelectedLogo(null);
                    }}
                    onBrandingRemove={() => {
                      setRemovedMedia({ ...removedMedia, logo: true });
                    }}
                    showPreview={removedMedia.logo}
                    dataTestId="logo"
                  />
                )}
              </div>
              <p className="text-xxs text-neutral-500">{t('fileSize-5mb')}</p>
            </div>
            <div className="flex flex-col w-1/2 gap-1">
              <label className="font-bold" htmlFor={getInputPropsFavicon().id}>
                {t('favicon')}
              </label>
              <div
                {...getRootPropsFavicon()}
                className="border border-dashed border-neutral-200 rounded-9xl p-6 w-full h-[186px] flex justify-center items-center cursor-pointer"
              >
                <input
                  {...getInputPropsFavicon()}
                  data-testid="upload-favicon"
                />
                {validationErrors.favicon ? (
                  validationErrorTemplate(
                    validationErrors.favicon,
                    () => {
                      setValidationErrors({
                        ...validationErrors,
                        favicon: null,
                      });
                    },
                    'favicon',
                  )
                ) : (
                  <Preview
                    file={selectedFavicon}
                    url={branding?.favicon?.original}
                    title={t('upload-favicon')}
                    description={
                      <span>
                        {t('drag-drop')}{' '}
                        <span className="text-primary-500 font-bold">
                          {t('click-here')}
                        </span>{' '}
                        {t('to-upload')} <br /> {t('recommend-size')} 32 x 32 px
                      </span>
                    }
                    onCustomRemove={() => {
                      setSelectedFavicon(null);
                    }}
                    onBrandingRemove={() => {
                      setRemovedMedia({ ...removedMedia, favicon: true });
                    }}
                    dataTestId="icon"
                    showPreview={removedMedia.favicon}
                  />
                )}
              </div>
              <p className="text-xxs text-neutral-500">{t('fileSize-5mb')}</p>
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Colors"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-colour-theme"
        height={333}
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4 rounded-b-9xl">
          <Divider />
          <div className="flex w-full items-center gap-[160px]">
            <div className="w-2/5 flex flex-col gap-4">
              <Layout
                fields={[
                  {
                    name: 'primaryColor',
                    label: t('primary-color'),
                    type: FieldType.ColorPicker,
                    control,
                    className: '',
                    dataTestId: 'primary',
                    setValue,
                    customLabelRightElement: (
                      <Tooltip
                        tooltipContent={
                          <p className="text-center text-sm font-medium">
                            {t('tool-tip-primary-color')}
                            <br /> {t('tool-tip-primary-color-2')}
                          </p>
                        }
                      >
                        <Icon name="infoCircle" size={16} hover={false} />
                      </Tooltip>
                    ),
                  },
                ]}
              />
              {primaryColor?.toUpperCase() === '#FFFFFF' && (
                <p
                  className="text-xs text-yellow-400 -mt-4"
                  data-testid="readability-warning"
                >
                  <span className="font-semibold">{t('read-alert')}</span>{' '}
                  {t('read-alert-des')}
                </p>
              )}
              {branding?.secondaryColor || showSecondaryColor ? (
                <>
                  <Layout
                    fields={[
                      {
                        name: 'secondaryColor',
                        label: t('secondary-color'),
                        type: FieldType.ColorPicker,
                        control,
                        className: '',
                        dataTestId: 'secondary',
                        setValue,
                        customLabelRightElement: (
                          <Tooltip
                            tooltipContent={
                              <p className="text-center text-sm font-medium">
                                {t('tool-tip-secondary-color')}
                                <br />
                                {t('tool-tip-secondary-color-2')}
                              </p>
                            }
                          >
                            <Icon name="infoCircle" size={16} hover={false} />
                          </Tooltip>
                        ),
                      },
                    ]}
                  />
                  {primaryColor === secondaryColor && (
                    <p
                      className="text-xs text-yellow-400 -mt-4"
                      data-testid="readability-warning"
                    >
                      <span className="font-semibold">{t('read-alert')}</span>{' '}
                      {t('read-alert-des')}
                    </p>
                  )}
                  {secondaryColor?.toUpperCase() === '#FFFFFF' && (
                    <p
                      className="text-xs text-yellow-400 -mt-4"
                      data-testid="readability-warning"
                    >
                      <span className="font-semibold">{t('read-alert')}</span>{' '}
                      {t('read-alert-des')}
                    </p>
                  )}
                </>
              ) : (
                <div
                  className="flex text-primary-500 group cursor-pointer group-hover:text-primary-700 text-base font-bold"
                  onClick={() => setShowSecondaryColor(true)}
                  data-testid="branding-add-secondary-color"
                >
                  <Icon name="add" color="text-primary-500" />
                  <p>{t('add-secondary-color')}</p>
                </div>
              )}
            </div>
            <div className="w-[182px] flex flex-col rounded-7xl overflow-hidden gap-1 border border-neutral-200 shadow-sm">
              <div
                className="p-3 flex gap-2 px-2.5"
                style={{ backgroundColor: secondaryColor }}
              >
                <Icon
                  name="flashIcon"
                  className="text-white"
                  hover={false}
                  size={16}
                />
                <p className="text-white font-bold text-xs">{t('secondary')}</p>
              </div>
              <p className="text-neutral-900 font-bold text-base text-center px-2.5">
                {t('help-card-text')}
              </p>
              <p className="font-normal text-[8px] text-neutral-500 text-center px-2.5">
                {t('help-card-text-2')}
              </p>
              <img
                src={NoAnnouncement}
                className="h-[70px]"
                alt="No announcement"
              />

              <div
                className="flex items-center justify-center text-white rounded-19xl px-2.5 py-2 mx-2.5 text-sm font-bold"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = getTintVariantColor(
                    primaryColor,
                    0.1,
                    'black',
                  ))
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = primaryColor)
                }
                style={{ backgroundColor: primaryColor }}
              >
                {t('primary')}
              </div>
              <p className="font-normal text-[8px] text-neutral-500 text-center px-2.5 mb-4">
                {t('admin-text')}
              </p>
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Login Experience"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-login"
        height={511}
        className="mb-16"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4 rounded-b-9xl">
          <Divider />
          <div className="flex w-full gap-[120px]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  {t('layout')}
                </p>
                <div className="flex gap-[60px]">
                  <div
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setLayoutAlignment('LEFT');
                      if (layoutAlignment !== 'LEFT') {
                        setShowSaveChanges(true);
                      }
                    }}
                    data-testid="branding-select-left-alignment"
                  >
                    <div
                      className={`w-[100px] h-[60px] bg-neutral-100 relative border border-neutral-200 rounded-7xl ${
                        layoutAlignment === 'LEFT' &&
                        'border-primary-500 border-2'
                      }`}
                    >
                      <div className="absolute top-0 left-0 h-full w-[40px] rounded-7xl bg-neutral-400"></div>
                    </div>
                    <p className="text-neutral-900 font-medium text-sm">
                      {t('left')}
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setLayoutAlignment('CENTER');
                      if (layoutAlignment !== 'CENTER') {
                        setShowSaveChanges(true);
                      }
                    }}
                    data-testid="branding-select-center-alignment"
                  >
                    <div
                      className={`w-[100px] h-[60px] bg-neutral-100 flex justify-center border border-neutral-200 rounded-7xl ${
                        layoutAlignment === 'CENTER' &&
                        'border-primary-500 border-2'
                      }`}
                    >
                      <div className="h-full w-[40px] rounded-7xl bg-neutral-400"></div>
                    </div>
                    <p className="text-neutral-900 font-medium text-sm">
                      {t('center')}
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setLayoutAlignment('RIGHT');
                      if (layoutAlignment !== 'RIGHT') {
                        setShowSaveChanges(true);
                      }
                    }}
                    data-testid="branding-select-right-alignment"
                  >
                    <div
                      className={`w-[100px] h-[60px] bg-neutral-100 relative border border-neutral-200 rounded-7xl ${
                        layoutAlignment === 'RIGHT' &&
                        'border-primary-500 border-2'
                      }`}
                    >
                      <div className="absolute top-0 right-0 h-full w-[40px] rounded-7xl bg-neutral-400"></div>
                    </div>
                    <p className="text-neutral-900 font-medium text-sm">
                      {t('right')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  {t('left')}
                </p>
                <Layout
                  fields={[
                    {
                      type: FieldType.Radio,
                      name: 'backgroundType',
                      className: 'flex !flex-row gap-4',
                      control,
                      radioList: backgroundOption,
                      labelRenderer: (option: IRadioListOption) => {
                        return (
                          <p className="pl-1 text-sm">{option.data.value}</p>
                        );
                      },
                    },
                  ]}
                />
              </div>
              {backgroundType === 'Image' && (
                <div className="flex flex-col gap-3">
                  <label
                    className="text-sm font-bold text-neutral-900"
                    htmlFor={getInputPropsBG().id}
                  >
                    {t('upload-img')}
                  </label>
                  <div
                    {...getRootPropsBG()}
                    className="border border-dashed border-neutral-200 rounded-9xl px-5 py-2.5 w-[420px] h-[186px] flex justify-center items-center cursor-pointer"
                  >
                    <input
                      {...getInputPropsBG()}
                      data-testid="upload-background"
                    />
                    {validationErrors.bg ? (
                      validationErrorTemplate(validationErrors.bg, () => {
                        setValidationErrors({ ...validationErrors, bg: null });
                      })
                    ) : (
                      <Preview
                        file={selectedBG}
                        url={branding?.loginConfig?.image?.original}
                        title={t('upload-img')}
                        description={
                          <span>
                            {t('drag-drop')}{' '}
                            <span className="text-primary-500 font-bold">
                              {t('click-here')}
                            </span>{' '}
                            {t('to-upload')} <br /> {t('recommend-size')}{' '}
                            {layoutAlignment === 'CENTER' ? 1440 : 720} x 820 px
                          </span>
                        }
                        onCustomRemove={() => setSelectedBG(null)}
                        onBrandingRemove={() =>
                          setRemovedMedia({ ...removedMedia, bg: true })
                        }
                        imgClassName="w-[321px] h-[166px] rounded-7xl"
                        showPreview={removedMedia.bg}
                      />
                    )}
                  </div>
                  <p className="text-xxs text-neutral-500">
                    {t('fileSize-50mb')}
                  </p>
                </div>
              )}
              {backgroundType === 'Video' && (
                <div className="flex flex-col gap-3">
                  <label
                    className="text-sm font-bold text-neutral-900"
                    htmlFor={getInputPropsBGVideo().id}
                  >
                    {t('upload-video')}
                  </label>
                  <div
                    {...getRootPropsBGVideo()}
                    className="border border-dashed border-neutral-200 rounded-9xl px-5 py-2.5 w-[420px] h-[186px] flex justify-center items-center cursor-pointer"
                  >
                    <input
                      {...getInputPropsBGVideo()}
                      data-testid="upload-background"
                    />
                    {validationErrors.bgVideo ? (
                      validationErrorTemplate(validationErrors.bgVideo, () => {
                        setValidationErrors({
                          ...validationErrors,
                          bgVideo: null,
                        });
                      })
                    ) : (
                      <Preview
                        file={selectedBGVideo}
                        url={branding?.loginConfig?.video?.original}
                        title={t('upload-video')}
                        description={
                          <span>
                            {t('drag-drop')}{' '}
                            <span className="text-primary-500 font-bold">
                              {t('click-here')}
                            </span>{' '}
                            {t('click-here')} <br /> {t('recommend-size')} 1440
                            x 820 px
                          </span>
                        }
                        onCustomRemove={() => setSelectedBGVideo(null)}
                        onBrandingRemove={() =>
                          setRemovedMedia({ ...removedMedia, bgVideo: true })
                        }
                        isVideo
                        videoClassName="w-[321px] h-[166px] rounded-7xl object-cover"
                        showPreview={removedMedia.bgVideo}
                      />
                    )}
                  </div>
                  <p className="text-xxs text-neutral-500">
                    {t('fileSize-500mb')}
                  </p>
                </div>
              )}
              {backgroundType === 'Color' && (
                <>
                  <Layout
                    fields={[
                      {
                        name: 'color',
                        label: t('color-label'),
                        type: FieldType.ColorPicker,
                        control,
                        className: '',
                        dataTestId: 'login',
                        setValue,
                      },
                    ]}
                  />
                  {layoutAlignment !== 'CENTER' && (
                    <Layout
                      fields={[
                        {
                          name: 'text',
                          label: t('text-label'),
                          type: FieldType.Input,
                          control,
                          className: '',
                          dataTestId: 'input-background-text',
                          placeholder: 'ex. welcome to auzmor',
                          error: formState?.errors?.text?.message,
                          customLabelRightElement: (
                            <span
                              className={`text-sm ${
                                formState?.errors?.text?.message
                                  ? 'text-red-500'
                                  : 'text-neutral-500'
                              }`}
                            >
                              {text?.length} / 50
                            </span>
                          ),
                        },
                      ]}
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex relative">
              <div
                className={`w-[360px] h-[205px] flex items-center relative top-0 right-0 rounded-9xl overflow-hidden bg-neutral-200 object-cover ${
                  layoutAlignment === 'RIGHT' && 'justify-end'
                }   ${layoutAlignment === 'LEFT' && 'justify-start'}  ${
                  layoutAlignment === 'CENTER' && 'justify-center'
                }`}
                style={{
                  backgroundColor:
                    backgroundType === 'Color'
                      ? color
                      : twConfig.theme.colors.neutral[200],
                }}
              >
                {backgroundType === 'Image' && getBackgroundImg()}
                {backgroundType === 'Video' && getBackgroundVideo()}
                {layoutAlignment !== 'CENTER' &&
                  backgroundType === 'Color' &&
                  layoutAlignment === 'RIGHT' && (
                    <div className="flex h-full w-1/2 items-center justify-center">
                      <p
                        className={`text-xs font-extrabold ${
                          isDark(color) ? 'text-white' : 'text-neutral-900'
                        } `}
                      >
                        {text}
                      </p>
                    </div>
                  )}
                <div
                  className={`bg-neutral-50 relative flex flex-col items-center gap-1 justify-center ${
                    layoutAlignment === 'CENTER'
                      ? 'h-[152px] rounded-xl w-[128px]'
                      : 'h-full w-1/2'
                  }`}
                >
                  <div className="flex justify-center w-full h-[12px]">
                    {selectedLogo ? (
                      <img
                        src={getBlobUrl(selectedLogo)}
                        className="h-full object-cover"
                        alt="Logo preview"
                      />
                    ) : (
                      <Logo className="!h-[12px]" />
                    )}
                  </div>
                  <div className="w-[110px] p-[5px] flex flex-col gap-1">
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[6px] text-neutral-900 font-bold">
                        {t('sign-in')}
                      </p>
                      <p className="text-[3px] font-medium text-neutral-500">
                        {t('sign-in-text')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[4px] text-neutral-900 font-bold">
                        {t('work-title')}
                      </p>
                      <div className="w-full rounded-7xl border-[0.25px] border-neutral-200 text-neutral-500 px-[5px] py-[3px] text-[4px]">
                        {t('email-field')}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[4px] text-neutral-900 font-bold">
                        {t('password')}
                      </p>
                      <div className="w-full rounded-7xl border-[0.25px] border-neutral-200 text-neutral-500 px-[5px] py-[3px] text-[4px]">
                        {t('enter-password')}
                      </div>
                      <p className="text-[4px] text-neutral-900 font-bold text-right">
                        {t('forgot-password')}
                      </p>
                    </div>
                    <div
                      className="w-full rounded-default px-6 py-[2.5px] text-white text-[4px] text-center font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Sign In
                    </div>
                    <div className="w-full rounded-default px-6 py-[2.5px] text-neutral-900 text-[4px] text-center font-bold bg-neutral-100">
                      Sign in with SSO
                    </div>
                  </div>
                </div>
                {layoutAlignment !== 'CENTER' &&
                  backgroundType === 'Color' &&
                  layoutAlignment === 'LEFT' && (
                    <div className="flex h-full w-1/2 items-center justify-center">
                      <p
                        className={`text-xs font-extrabold ${
                          isDark(color) ? 'text-white' : 'text-neutral-900'
                        } `}
                      >
                        {text}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Collapse>
      {isEditLogoModalOpen && (
        <ImageReposition
          title="Reposition"
          openEditImage={isEditLogoModalOpen}
          closeEditImageModal={closeEditLogoModal}
          image={getBlobUrl(tempfile!)}
          imageRef={logoInputRef}
          setImageFile={setSelectedLogo}
          imageFile={tempfile}
          mimeType={getMimeType(tempfile?.name || '')}
          defaultSize={(cropperState) => {
            const aspectRatio = 153 / 68;
            const w = cropperState.imageSize.width;
            const h = cropperState.imageSize.height;
            const DEFAUTL_MARGIN = 16; // in pixel
            if (h <= w) {
              return {
                width: (h - DEFAUTL_MARGIN) * aspectRatio,
                height: h - DEFAUTL_MARGIN,
              };
            }
            return {
              width: w - DEFAUTL_MARGIN,
              height: (w - DEFAUTL_MARGIN) / aspectRatio,
            };
          }}
        />
      )}
      {isEditFaviconModalOpen && (
        <ImageReposition
          title="Reposition"
          openEditImage={isEditFaviconModalOpen}
          closeEditImageModal={closeEditFaviconModal}
          image={getBlobUrl(tempfile!)}
          imageRef={faviconInputRef}
          setImageFile={setSelectedFavicon}
          imageFile={tempfile}
          shape={Shape.Square}
          mimeType={getMimeType(tempfile?.name || '')}
        />
      )}
      {isEditBGModalOpen && (
        <ImageReposition
          title="Reposition"
          openEditImage={isEditBGModalOpen}
          closeEditImageModal={closeEditBGModal}
          image={getBlobUrl(tempfile!)}
          imageRef={bgInputRef}
          setImageFile={setSelectedBG}
          imageFile={tempfile}
          mimeType={getMimeType(tempfile?.name || '')}
          defaultSize={(cropperState) => {
            const aspectRatio =
              (layoutAlignment === 'CENTER' ? 1440 : 720) / 820;
            const w = cropperState.imageSize.width;
            const h = cropperState.imageSize.height;
            const DEFAUTL_MARGIN = 16; // in pixel
            if (h <= w) {
              return {
                width: (h - DEFAUTL_MARGIN) * aspectRatio,
                height: h - DEFAUTL_MARGIN,
              };
            }
            return {
              width: w - DEFAUTL_MARGIN,
              height: (w - DEFAUTL_MARGIN) / aspectRatio,
            };
          }}
        />
      )}
    </>
  );
};

export default BrandingSettings;
