import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { FC, ReactNode, useState } from 'react';
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
import { MB } from 'utils/constants';
import { IRadioListOption } from 'components/RadioGroup';
import { useUpdateBrandingMutation } from 'queries/organization';
import { useBrandingStore } from 'stores/branding';
import { IBranding } from 'contexts/AuthContext';
import useModal from 'hooks/useModal';
import ImageResosition from 'components/DynamicImagePreview/components/ImageReposition';
import clsx from 'clsx';
import { useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';

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
}) => {
  const [removePreview, setRemovePreview] = useState(false);
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
        />
      ) : (
        <img src={getMediaObj([file])[0].original} className={imgClassName} />
      )}

      <div
        className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
        onClick={(e) => {
          e.stopPropagation();
          onCustomRemove();
        }}
      >
        <Icon name="close" size={16} color="text-white" />
      </div>
    </div>
  ) : url && !removePreview ? (
    <div className={style}>
      {isVideo ? (
        <video src={url} className={videoClassName} />
      ) : (
        <img src={url} className={imgClassName} />
      )}

      <div
        className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
        onClick={(e) => {
          e.stopPropagation();
          setRemovePreview(true);
          onBrandingRemove();
        }}
      >
        <Icon name="close" size={16} color="text-white" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center gap-2">
      <Icon name="documentUpload" color="text-neutral-900" hover={false} />
      <div className="text-neutral-900 font-medium">{title}</div>
      <div className="mt-1 text-neutral-500 text-xs text-center">
        {description}
      </div>
    </div>
  );
};

const BrandingSettings: FC<IBrandingSettingsProps> = ({ branding }) => {
  const backgroundOption: IRadioListOption[] = [
    {
      data: { value: 'Color' },
      dataTestId: 'color',
    },
    {
      data: { value: 'Video' },
      dataTestId: 'video',
    },
    {
      data: { value: 'Image' },
      dataTestId: 'image',
    },
  ];
  const { control, setValue, watch } = useForm({
    defaultValues: {
      primaryColor: branding?.primaryColor || '#10B981',
      secondaryColor: branding?.secondaryColor || '#1d4ed8',
      backgroundType:
        titleCase(branding?.loginConfig?.backgroundType || '') ||
        titleCase(backgroundOption[2].data.value),
      color: branding?.loginConfig?.color || '#123456',
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
        EntityType.OrgBanner,
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
      secondaryColor,
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
      onSettled: () => {
        setIsSaving(false);
      },
    });
  };

  const validationErrorTemplate = (message: string, onClick: () => void) => {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        onClick={onClick}
      >
        <Icon name="infoCircle" color="text-red-500" size={32} />
        <p className="text-red-500 font-medium text-sm mt-2">
          Oops! Upload failed
        </p>
        <p className="text-neutral-500 text-xs font-medium mt-3">
          {message}{' '}
          <span className="text-primary-500 font-bold">Try again</span>
        </p>
      </div>
    );
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-4">
            <p className="text-neutral-900 text-base font-bold">Branding</p>
            <p className="text-neutral-500 text-sm">
              Branding Options for a Personalized Experience
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Button label="Cancel" variant={Variant.Secondary} />
              <Button
                label="Save changes"
                loading={isSaving}
                onClick={handleSaveChanges}
              />
            </div>
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
                dataTestId: 'page-title',
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
                <input {...getInputPropsLogo()} />
                {validationErrors.logo ? (
                  validationErrorTemplate(validationErrors.logo, () => {
                    setValidationErrors({ ...validationErrors, logo: null });
                  })
                ) : (
                  <Preview
                    file={selectedLogo}
                    url={branding?.logo?.original}
                    title="Upload Image"
                    description={
                      <span>
                        Drag and drop or click here to upload file. <br /> Ideal
                        image size: 150 x 65 px
                      </span>
                    }
                    onCustomRemove={() => setSelectedLogo(null)}
                    onBrandingRemove={() =>
                      setRemovedMedia({ ...removedMedia, logo: true })
                    }
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
                <input {...getInputPropsFavicon()} />
                {validationErrors.favicon ? (
                  validationErrorTemplate(validationErrors.favicon, () => {
                    setValidationErrors({ ...validationErrors, favicon: null });
                  })
                ) : (
                  <Preview
                    file={selectedFavicon}
                    url={branding?.favicon?.original}
                    title="Upload Icon"
                    description={
                      <span>
                        Drag and drop or click here to upload file. <br /> Ideal
                        image size: 32 x 32 px
                      </span>
                    }
                    onCustomRemove={() => setSelectedFavicon(null)}
                    onBrandingRemove={() =>
                      setRemovedMedia({ ...removedMedia, favicon: true })
                    }
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
                    dataTestId: 'primary-color',
                    setValue,
                  },
                ]}
              />
              {showSecondaryColor ? (
                <Layout
                  fields={[
                    {
                      name: 'secondaryColor',
                      label: 'Secondary/action colour',
                      type: FieldType.ColorPicker,
                      control,
                      className: '',
                      dataTestId: 'secondary-color',
                      setValue,
                    },
                  ]}
                />
              ) : (
                <div
                  className="flex text-primary-500 group cursor-pointer group-hover:text-primary-700 text-base font-bold"
                  onClick={() => setShowSecondaryColor(true)}
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
                    className="flex flex-col items-center gap-2"
                    onClick={() => setLayoutAlignment('LEFT')}
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
                    className="flex flex-col items-center gap-2"
                    onClick={() => setLayoutAlignment('CENTER')}
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
                    className="flex flex-col items-center gap-2"
                    onClick={() => setLayoutAlignment('RIGHT')}
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
                    <input {...getInputPropsBG()} />
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
                            Drag and drop or click here to upload file. <br />{' '}
                            Ideal image size: 1920 x 860 px
                          </span>
                        }
                        onCustomRemove={() => setSelectedBG(null)}
                        onBrandingRemove={() =>
                          setRemovedMedia({ ...removedMedia, bg: true })
                        }
                        imgClassName="w-[321px] h-[166px] rounded-7xl"
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
                    className="border border-dashed border-neutral-200 rounded-9xl p-6 w-[420px] h-[186px] flex justify-center items-center"
                  >
                    <input {...getInputPropsBGVideo()} />
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
                            Drag and drop or click here to upload file. <br />{' '}
                            Ideal video size: 1920 x 860 px
                          </span>
                        }
                        onCustomRemove={() => setSelectedBGVideo(null)}
                        onBrandingRemove={() =>
                          setRemovedMedia({ ...removedMedia, bgVideo: true })
                        }
                        isVideo
                      />
                    )}
                    <Preview
                      file={selectedBGVideo}
                      url={branding?.loginConfig?.video?.original}
                      title="Upload Video"
                      description={
                        <span>
                          Drag and drop or click here to upload file. <br />{' '}
                          Ideal video size: 1920 x 860 px
                        </span>
                      }
                      onCustomRemove={() => setSelectedBGVideo(null)}
                      onBrandingRemove={() =>
                        setRemovedMedia({ ...removedMedia, bgVideo: true })
                      }
                      isVideo
                    />
                  </div>
                  <p className="text-xxs text-neutral-500">Max file size 5mb</p>
                </div>
              )}
              {backgroundType === 'Color' && (
                <Layout
                  fields={[
                    {
                      name: 'color',
                      label: 'primary/action colour',
                      type: FieldType.ColorPicker,
                      control,
                      className: '',
                      dataTestId: 'text-color',
                      setValue,
                    },
                    {
                      name: 'text',
                      label: 'Add text',
                      type: FieldType.Input,
                      control,
                      className: '',
                      dataTestId: 'text',
                      placeholder: 'ex. welcome to auzmor',
                      maxLength: 50,
                    },
                  ]}
                />
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
                  backgroundImage: `url(${
                    backgroundType === 'Image' && selectedBG
                      ? getBlobUrl(selectedBG)
                      : backgroundType === 'Image' &&
                        branding?.loginConfig?.image?.original
                      ? branding?.loginConfig?.image?.original
                      : backgroundType === 'Image' && removedMedia.bg
                      ? undefined
                      : undefined
                  })`,
                }}
              >
                <div
                  className={`bg-white pt-5 pl-8 pr-[47px] pb-2 relative ${
                    layoutAlignment === 'CENTER'
                      ? 'h-[191px] rounded-xl w-[159px]'
                      : 'h-full w-3/5'
                  }`}
                ></div>
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
          aspectRatio={150 / 65}
          width={150}
          height={65}
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
