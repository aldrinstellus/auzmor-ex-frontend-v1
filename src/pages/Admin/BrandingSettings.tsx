import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import NoAnnouncement from 'images/NoAnnouncement.svg';
import { useDropzone } from 'react-dropzone';
import {
  BlobToFile,
  getBlobUrl,
  getMediaObj,
  getMimeType,
  titleCase,
  twConfig,
} from 'utils/misc';
import { MB, TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { IRadioListOption } from 'components/RadioGroup';
import {
  useOrganization,
  useUpdateBrandingMutation,
} from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import { IBranding } from 'contexts/AuthContext';
import useModal from 'hooks/useModal';
import ImageResosition from 'components/DynamicImagePreview/components/ImageReposition';
import clsx from 'clsx';
import { useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { slideInAndOutTop } from 'utils/react-toastify';
import Tooltip from 'components/Tooltip';
import { Logo } from 'components/Logo';
import welcomeToOffice from 'images/welcomeToOffice.png';
import welcomeToOfficeLarge from 'images/welcomeToOfficeLarge.png';
import { getTintVariantColor } from 'utils/branding';
import queryClient from 'utils/queryClient';

const PRIMARY_COLOR = '#10B981';
const SECONDARY_COLOR = '#1D4ED8FF';

interface IBrandingSettingsProps {
  branding?: IBranding;
}

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
  imgClassName,
  videoClassName,
  className = '',
  dataTestId,
  showPreview = true,
}) => {
  const style = clsx({
    'max-h-full max-w-full relative': true,
    [className]: true,
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
          className={imgClassName}
          data-testid={`branding-uploaded-${dataTestId}`}
        />
      )}

      <div
        className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
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
          className={imgClassName}
          data-testid={`branding-uploaded-${dataTestId}`}
        />
      )}

      <div
        className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
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

const BrandingSettings: FC<IBrandingSettingsProps> = () => {
  const { data } = useOrganization();
  const branding = data?.branding;
  useEffect(() => {
    reset({
      primaryColor: branding?.primaryColor || PRIMARY_COLOR,
      secondaryColor: branding?.secondaryColor || SECONDARY_COLOR,
      backgroundType:
        titleCase(branding?.loginConfig?.backgroundType || '') ||
        titleCase(backgroundOption[2].data.value),
      color: branding?.loginConfig?.color || '#777777',
      pageTitle: branding?.pageTitle || 'Auzmor Office',
      text: branding?.loginConfig?.text,
    });
  }, [branding]);
  const backgroundOption: IRadioListOption[] = [
    {
      data: { value: 'Color' },
      dataTestId: 'branding-background-as-color',
    },
    {
      data: { value: 'Video' },
      dataTestId: 'branding-background-as-video',
    },
    {
      data: { value: 'Image' },
      dataTestId: 'branding-background-as-image',
    },
  ];
  const { control, setValue, watch, reset, formState } = useForm({
    defaultValues: {
      primaryColor: branding?.primaryColor || PRIMARY_COLOR,
      secondaryColor: branding?.secondaryColor || SECONDARY_COLOR,
      backgroundType:
        titleCase(branding?.loginConfig?.backgroundType || '') ||
        titleCase(backgroundOption[2].data.value),
      color: branding?.loginConfig?.color || '#777777',
      pageTitle: branding?.pageTitle || 'Auzmor Office',
      text: branding?.loginConfig?.text,
    },
  });
  const setBranding = useBrandingStore((state) => state.setBranding);
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
        setSelectedLogo(acceptedFiles[0]);
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
        setSelectedFavicon(acceptedFiles[0]);
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
          message: 'The file size exceeds the limit',
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
        setSelectedBG(acceptedFiles[0]);
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
      if (file.size > 5 * MB) {
        return {
          code: 'file-size-exceed',
          message: 'The file size exceeds the limit',
        };
      }
      return null;
    },
  });

  const handleSaveChanges = async () => {
    setIsSaving(true);
    let uploadedLogo = null;
    if (selectedLogo) {
      uploadedLogo = await uploadMedia(
        [BlobToFile(selectedLogo, `id-${Math.random().toString(16).slice(2)}`)],
        EntityType.OrgLogo,
      );
    } else if (!removedMedia.logo && branding?.logo?.original) {
      uploadedLogo = [branding?.logo];
    }
    let uploadedFavicon = null;
    if (selectedFavicon) {
      uploadedFavicon = await uploadMedia(
        [
          BlobToFile(
            selectedFavicon,
            `id-${Math.random().toString(16).slice(2)}`,
          ),
        ],
        EntityType.OrgFavicon,
      );
    } else if (!removedMedia.favicon && branding?.favicon?.original) {
      uploadedFavicon = [branding?.favicon];
    }
    let uploadedBG = null;
    if (selectedBG) {
      uploadedBG = await uploadMedia(
        [BlobToFile(selectedBG, `id-${Math.random().toString(16).slice(2)}`)],
        EntityType.OrgLoginImage,
      );
    } else if (!removedMedia.bg && branding?.loginConfig?.image?.original) {
      uploadedBG = [branding?.loginConfig?.image];
    }
    let uploadedBGVideo = null;
    if (selectedBGVideo) {
      uploadedBGVideo = await uploadMedia(
        [
          BlobToFile(
            selectedBGVideo,
            `id-${Math.random().toString(16).slice(2)}`,
          ),
        ],
        EntityType.OrgLoginVideo,
      );
    } else if (
      !removedMedia.bgVideo &&
      branding?.loginConfig?.video?.original
    ) {
      uploadedBGVideo = [branding?.loginConfig?.video];
    }
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
    setBranding(newBranding);
    updateBranding.mutate(newBranding, {
      onSuccess: () => {
        toast(
          <SuccessToast
            content={'Changes you made have been saved'}
            dataTestId="branding-changes-saved-toaster"
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
        queryClient.refetchQueries(['organization']);
      },
      onSettled: () => {
        setIsSaving(false);
        handleCancel();
      },
    });
  };

  const handleCancel = () => {
    setShowSaveChanges(false);
    reset({
      primaryColor: branding?.primaryColor || PRIMARY_COLOR,
      secondaryColor: branding?.secondaryColor || SECONDARY_COLOR,
      backgroundType:
        titleCase(branding?.loginConfig?.backgroundType || '') ||
        titleCase(backgroundOption[2].data.value),
      color: branding?.loginConfig?.color || '#777777',
      pageTitle: branding?.pageTitle || 'Auzmor Office',
      text: branding?.loginConfig?.text,
    });
    setSelectedLogo(null);
    setSelectedFavicon(null);
    setSelectedBG(null);
    setSelectedBGVideo(null);
    setLayoutAlignment(branding?.loginConfig?.layout || 'RIGHT');
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
          Oops! Upload failed
        </p>
        <p className="text-neutral-500 text-xs font-medium mt-3">
          {message}{' '}
          <span
            className="text-primary-500 font-bold"
            data-testid="upload-again"
          >
            Try again
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
            />
          );
        } else {
          return (
            <img
              className="absolute top-0 left-0 object-cover h-full w-full"
              src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOfficeLarge}
            />
          );
        }
      }
    } else {
      if (layoutAlignment === 'LEFT') {
        if (removedMedia.bg) {
          return (
            <img
              className={`absolute top-0 right-0 object-cover h-full ${
                selectedBG ? 'w-full' : 'w-1/2'
              }`}
              src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
            />
          );
        } else {
          if (branding?.loginConfig?.image?.original) {
            return (
              <img
                className="absolute top-0 right-0 object-cover h-full w-full"
                src={
                  selectedBG
                    ? getBlobUrl(selectedBG)
                    : branding?.loginConfig?.image?.original
                }
              />
            );
          } else {
            return (
              <img
                className={`absolute top-0 right-0 object-cover h-full ${
                  selectedBG ? 'w-full' : 'w-1/2'
                }`}
                src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
              />
            );
          }
        }
      } else {
        if (removedMedia.bg) {
          return (
            <img
              className={`absolute top-0 left-0 object-cover h-full ${
                selectedBG ? 'w-full' : 'w-1/2'
              }`}
              src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
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
              />
            );
          } else {
            return (
              <img
                className={`absolute top-0 left-0 object-cover h-full ${
                  selectedBG ? 'w-full' : 'w-1/2'
                }`}
                src={selectedBG ? getBlobUrl(selectedBG) : welcomeToOffice}
              />
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
          className={`absolute top-0 right-0 object-cover h-full w-full`}
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
          className={`absolute top-0 right-0 object-cover h-full w-full`}
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

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-4">
            <p className="text-neutral-900 text-base font-bold">Branding</p>
            <p className="text-neutral-500 text-sm" data-testid="branding-note">
              Branding Options for a Personalized Experience
            </p>
          </div>
          <div className="flex flex-col">
            {(formState.isDirty || showSaveChanges) && (
              <div className="flex gap-2">
                <Button
                  label="Cancel"
                  variant={Variant.Secondary}
                  onClick={handleCancel}
                  disabled={isSaving}
                  dataTestId="branding-cancelcta"
                />
                <Button
                  label="Save changes"
                  loading={isSaving}
                  onClick={handleSaveChanges}
                  dataTestId="branding-savechangescta"
                />
              </div>
            )}
            <div></div>
          </div>
        </div>
      </Card>
      <Collapse
        defaultOpen
        label="Page settings"
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
                label: 'Page Title',
                type: FieldType.Input,
                control,
                className: '',
                dataTestId: 'branding-pagetitle',
                helpText:
                  branding?.pageTitle === 'Auzmor office'
                    ? `Replace 'Auzmor office' name from UI with your own name`
                    : '',
                maxLenght: 50,
                customLabelRightElement: (
                  <span className="text-neutral-500 text-sm">
                    {pageTitle?.length || 0} / 50
                  </span>
                ),
              },
            ]}
          />
          <div className="flex gap-[100px]">
            <div className="flex flex-col w-1/2 gap-1">
              <div>Logo</div>
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
                    title="Upload Image"
                    description={
                      <span>
                        Drag and drop or{' '}
                        <span className="text-primary-500 font-bold">
                          click here
                        </span>{' '}
                        to upload file. <br /> Ideal image size: 250 x 150 px
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
              <p className="text-xxs text-neutral-500">Max file size 5mb</p>
            </div>
            <div className="flex flex-col w-1/2 gap-1">
              <div>Favicon</div>
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
                    title="Upload Icon"
                    description={
                      <span>
                        Drag and drop or{' '}
                        <span className="text-primary-500 font-bold">
                          click here
                        </span>{' '}
                        to upload file. <br /> Ideal image size: 32 x 32 px
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
              <p className="text-xxs text-neutral-500">Max file size 5mb</p>
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Colour theme"
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
                    label: 'Primary/action colour',
                    type: FieldType.ColorPicker,
                    control,
                    className: '',
                    dataTestId: 'primary',
                    setValue,
                    customLabelRightElement: (
                      <Tooltip
                        tooltipContent={
                          <p className="text-center text-sm font-medium">
                            It is used in CTA&apos;s, Links,
                            <br /> Icons, etc.
                          </p>
                        }
                      >
                        <Icon name="infoCircle" size={16} hover={false} />
                      </Tooltip>
                    ),
                  },
                ]}
              />
              {(primaryColor.toLocaleUpperCase() === '#FFF' ||
                primaryColor.toLocaleUpperCase() === '#FFFFFF') && (
                <p className="text-xs text-yellow-400 -mt-4">
                  <span className="font-semibold">Readability Alert:</span> We
                  suggest using high-contrast colors for better readability.
                </p>
              )}
              {branding?.secondaryColor || showSecondaryColor ? (
                <>
                  <Layout
                    fields={[
                      {
                        name: 'secondaryColor',
                        label: 'Secondary/action colour',
                        type: FieldType.ColorPicker,
                        control,
                        className: '',
                        dataTestId: 'secondary',
                        setValue,
                        customLabelRightElement: (
                          <Tooltip
                            tooltipContent={
                              <p className="text-center text-sm font-medium">
                                It is used in secondary <br />
                                buttons, highlights, etc.
                              </p>
                            }
                          >
                            <Icon name="infoCircle" size={16} hover={false} />
                          </Tooltip>
                        ),
                      },
                    ]}
                  />
                  {(secondaryColor.toLocaleUpperCase() === '#FFF' ||
                    secondaryColor.toLocaleUpperCase() === '#FFFFFF') && (
                    <p className="text-xs text-yellow-400 -mt-4">
                      <span className="font-semibold">Readability Alert:</span>{' '}
                      We suggest using high-contrast colors for better
                      readability.
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
                  <p>Add secondary colour</p>
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
                <p className="text-white font-bold text-xs">Secondary</p>
              </div>
              <p className="text-neutral-900 font-bold text-base text-center px-2.5">
                Lorem ipsum dolor
              </p>
              <p className="font-normal text-[8px] text-neutral-500 text-center px-2.5">
                Lorem ipsum dolor si amet. Lorem ipsum dolor si amet
              </p>
              <img src={NoAnnouncement} className="h-[70px]" />

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
                Primary
              </div>
              <p className="font-normal text-[8px] text-neutral-500 text-center px-2.5 mb-4">
                Only admins can see this.
              </p>
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Login"
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
                  Layout alignment
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
                    <p className="text-neutral-900 font-medium text-sm">Left</p>
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
                      Center
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
                      Right
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  Select Background type
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
                  <p className="text-sm font-bold text-neutral-900">
                    Upload Image
                  </p>
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
                        title="Upload Image"
                        description={
                          <span>
                            Drag and drop or{' '}
                            <span className="text-primary-500 font-bold">
                              click here
                            </span>{' '}
                            to upload file. <br /> Ideal image size: 1920 x 860
                            px
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
                  <p className="text-xxs text-neutral-500">Max file size 5mb</p>
                </div>
              )}
              {backgroundType === 'Video' && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-neutral-900">
                    Upload Video
                  </p>
                  <div
                    {...getRootPropsBGVideo()}
                    className="border border-dashed border-neutral-200 rounded-9xl px-5 py-2.5 w-[420px] h-[186px] flex justify-center items-center"
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
                        title="Upload Video"
                        description={
                          <span>
                            Drag and drop or{' '}
                            <span className="text-primary-500 font-bold">
                              click here
                            </span>{' '}
                            to upload file. <br /> Ideal video size: 1920 x 860
                            px
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
                  <p className="text-xxs text-neutral-500">Max file size 5mb</p>
                </div>
              )}
              {backgroundType === 'Color' && (
                <>
                  <Layout
                    fields={[
                      {
                        name: 'color',
                        label: 'primary/action colour',
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
                          label: 'Add text',
                          type: FieldType.Input,
                          control,
                          className: '',
                          dataTestId: 'input-background-text',
                          placeholder: 'ex. welcome to auzmor',
                          maxLength: 50,
                          customLabelRightElement: (
                            <span className="text-neutral-500 text-sm">
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
                    <div className="flex h-full w-1/2 items-center pl-2">
                      <p className="text-xs font-extrabold text-white">
                        {text}
                      </p>
                    </div>
                  )}
                <div
                  className={`bg-neutral-50 pt-5 relative flex flex-col items-center gap-1 ${
                    layoutAlignment === 'CENTER'
                      ? 'h-[191px] rounded-xl w-[159px]'
                      : 'h-full w-1/2'
                  }`}
                >
                  <div className="flex justify-center w-full h-[12px]">
                    {selectedLogo ? (
                      <img
                        src={getBlobUrl(selectedLogo)}
                        className="h-full object-cover"
                      />
                    ) : (
                      <Logo className="!h-[12px]" />
                    )}
                  </div>
                  <div className="w-[110px] p-[5px] h-full flex flex-col gap-1">
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[6px] text-neutral-900 font-bold">
                        Signin
                      </p>
                      <p className="text-[3px] font-medium text-neutral-500">
                        Hi, enter your details to get signed in to your account
                      </p>
                    </div>
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[4px] text-neutral-900 font-bold">
                        Work Email / Username
                      </p>
                      <div className="w-full rounded-7xl border-[0.25px] border-neutral-200 text-neutral-500 px-[5px] py-[3px] text-[4px]">
                        Enter your email address / username
                      </div>
                    </div>
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[4px] text-neutral-900 font-bold">
                        Password
                      </p>
                      <div className="w-full rounded-7xl border-[0.25px] border-neutral-200 text-neutral-500 px-[5px] py-[3px] text-[4px]">
                        Enter password
                      </div>
                      <p className="text-[4px] text-neutral-900 font-bold text-right">
                        Forgot Password?
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
                    <div className="flex h-full w-1/2 items-center pl-2">
                      <p className="text-xs font-extrabold text-white">
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
        <ImageResosition
          title="Reposition"
          openEditImage={isEditLogoModalOpen}
          closeEditImageModal={closeEditLogoModal}
          image={getBlobUrl(selectedLogo!)}
          imageRef={logoInputRef}
          setImageFile={setSelectedLogo}
          imageFile={selectedLogo}
          aspectRatio={250 / 150}
          width={250}
          height={150}
          mimeType={getMimeType(selectedLogo?.name || '')}
        />
      )}
      {isEditFaviconModalOpen && (
        <ImageResosition
          title="Reposition"
          openEditImage={isEditFaviconModalOpen}
          closeEditImageModal={closeEditFaviconModal}
          image={getBlobUrl(selectedFavicon!)}
          imageRef={faviconInputRef}
          setImageFile={setSelectedFavicon}
          imageFile={selectedFavicon}
          aspectRatio={32 / 32}
          width={32}
          height={32}
          mimeType={getMimeType(selectedFavicon?.name || '')}
        />
      )}
      {isEditBGModalOpen && (
        <ImageResosition
          title="Reposition"
          openEditImage={isEditBGModalOpen}
          closeEditImageModal={closeEditBGModal}
          image={getBlobUrl(selectedBG!)}
          imageRef={bgInputRef}
          setImageFile={setSelectedBG}
          imageFile={selectedBG}
          aspectRatio={1920 / 860}
          mimeType={getMimeType(selectedBG?.name || '')}
        />
      )}
    </>
  );
};

export default BrandingSettings;
