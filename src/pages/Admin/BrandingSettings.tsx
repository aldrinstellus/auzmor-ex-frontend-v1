import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import NoAnnouncement from 'images/NoAnnouncement.svg';
import { useDropzone } from 'react-dropzone';
import { getMediaObj } from 'utils/misc';
import {
  IMediaValidationError,
  MediaValidationError,
} from 'contexts/CreatePostContext';
import { MB } from 'utils/constants';
import { IRadioListOption } from 'components/RadioGroup';

const BrandingSettings: FC = () => {
  const { control, setValue, watch } = useForm();
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedFavicon, setSelectedFavicon] = useState<File | null>(null);
  const [selectedBG, setSelectedBG] = useState<File | null>(null);
  const [logoValidation, setLogoValidation] = useState<IMediaValidationError[]>(
    [],
  );
  const [faviconValidation, setFaviconValidation] = useState<
    IMediaValidationError[]
  >([]);
  const [bgValidation, setBGValidation] = useState<IMediaValidationError[]>([]);
  const [showSecondaryColor, setShowSecondaryColor] = useState(false);
  const [layoutAlignment, setLayoutAlignment] = useState<
    'CENTER' | 'LEFT' | 'RIGHT'
  >('RIGHT');

  const [primaryColor, secondaryColor, loginBackgroundType] = watch([
    'primaryColor',
    'secondaryColor',
    'loginBackgroundType',
  ]);

  console.log(loginBackgroundType);

  const { getRootProps: getRootPropsLogo, getInputProps: getInputPropsLogo } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        setSelectedLogo(acceptedFiles[0]);
      },
      onDropRejected: (rejection) => {
        // extension validation
        const error = rejection[0].errors[0];
        const fimeName = rejection[0].file.name;
        if (error.code === 'file-invalid-type') {
          setLogoValidation([
            ...logoValidation.filter(
              (error) =>
                error.errorType !== MediaValidationError.FileTypeNotSupported,
            ),
            {
              errorMsg: `File type must be .png, .jpg, .jpeg, .svg`,
              errorType: MediaValidationError.IncorrectDimension,
              fileName: fimeName,
            },
          ]);
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
        if (file.size > 1 * MB) {
          setLogoValidation([
            ...logoValidation.filter(
              (error) =>
                error.errorType !== MediaValidationError.ImageSizeExceed,
            ),
            {
              errorMsg: `Max file size 5mb`,
              errorType: MediaValidationError.ImageSizeExceed,
              fileName: file.name,
            },
          ]);
        }

        // dimension validation
        const image = new Image();
        image.src = getMediaObj([file])[0].original;
        image.onload = () => {
          const { height, width } = image;
          console.log(width, height);
          if (height != 30 || width != 150) {
            setLogoValidation([
              ...logoValidation.filter(
                (error) =>
                  error.errorType !== MediaValidationError.IncorrectDimension,
              ),
              {
                errorMsg: `Dimension should be 150 x 30 px`,
                errorType: MediaValidationError.IncorrectDimension,
                fileName: file.name,
              },
            ]);
          }
        };
        return null;
      },
    });
  const {
    getRootProps: getRootPropsFavicon,
    getInputProps: getInputPropsFavicon,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFavicon(acceptedFiles[0]);
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
      const fimeName = rejection[0].file.name;
      if (error.code === 'file-invalid-type') {
        setFaviconValidation([
          ...faviconValidation.filter(
            (error) =>
              error.errorType !== MediaValidationError.FileTypeNotSupported,
          ),
          {
            errorMsg: `File type must be .png, .jpg, .jpeg, .svg, .ico`,
            errorType: MediaValidationError.IncorrectDimension,
            fileName: fimeName,
          },
        ]);
      }
    },
    validator: (file) => {
      // size validation
      if (file.size > 5 * MB) {
        setFaviconValidation([
          ...faviconValidation.filter(
            (error) => error.errorType !== MediaValidationError.ImageSizeExceed,
          ),
          {
            errorMsg: `Max file size 5mb`,
            errorType: MediaValidationError.ImageSizeExceed,
            fileName: file.name,
          },
        ]);
      }

      // dimension validation
      const image = new Image();
      image.src = getMediaObj([file])[0].original;
      image.onload = () => {
        const { height, width } = image;
        if (height !== 32 || width !== 32) {
          setFaviconValidation([
            ...logoValidation.filter(
              (error) =>
                error.errorType !== MediaValidationError.IncorrectDimension,
            ),
            {
              errorMsg: `Dimension should be 32 x 32 px`,
              errorType: MediaValidationError.IncorrectDimension,
              fileName: file.name,
            },
          ]);
        }
      };
      return null;
    },
  });

  const { getRootProps: getRootPropsBG, getInputProps: getInputPropsBG } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        setSelectedBG(acceptedFiles[0]);
      },
      maxFiles: 1,
      accept: {
        'image/png': ['.png'],
        'image/svg': ['.svg'],
        'image/jpeg': ['.jpg', '.jpeg'],
      },
      onDropRejected: (rejection) => {
        // extension validation
        const error = rejection[0].errors[0];
        const fimeName = rejection[0].file.name;
        if (error.code === 'file-invalid-type') {
          setBGValidation([
            ...faviconValidation.filter(
              (error) =>
                error.errorType !== MediaValidationError.FileTypeNotSupported,
            ),
            {
              errorMsg: `File type must be .png, .jpg, .jpeg, .svg, .ico`,
              errorType: MediaValidationError.IncorrectDimension,
              fileName: fimeName,
            },
          ]);
        }
      },
      validator: (file) => {
        // size validation
        if (file.size > 1 * MB) {
          setBGValidation([
            ...faviconValidation.filter(
              (error) =>
                error.errorType !== MediaValidationError.ImageSizeExceed,
            ),
            {
              errorMsg: `Max file size 5mb`,
              errorType: MediaValidationError.ImageSizeExceed,
              fileName: file.name,
            },
          ]);
        }

        // dimension validation
        const image = new Image();
        image.src = getMediaObj([file])[0].original;
        image.onload = () => {
          const { height, width } = image;
          if (height !== 32 || width !== 32) {
            setBGValidation([
              ...logoValidation.filter(
                (error) =>
                  error.errorType !== MediaValidationError.IncorrectDimension,
              ),
              {
                errorMsg: `Dimension should be 32 x 32 px`,
                errorType: MediaValidationError.IncorrectDimension,
                fileName: file.name,
              },
            ]);
          }
        };
        return null;
      },
    });

  const resetValidationError = (type: 'LOGO' | 'FAVICON' | 'BG') => {
    switch (type) {
      case 'LOGO':
        setLogoValidation([]);
        return;
      case 'FAVICON':
        setFaviconValidation([]);
    }
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
              <Button label="Save changes" />
            </div>
            <div></div>
          </div>
        </div>
      </Card>
      <Collapse
        defaultOpen
        label="Page settings"
        className="rounded-9xl overflow-hidden"
        headerClassName="px-6 py-4 bg-white"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-pagesettings"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4">
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
                defaultValue: 'Auzmor Office',
              },
            ]}
          />
          <div className="flex gap-[100px]">
            <div className="flex flex-col w-1/2 gap-1">
              <div>Logo</div>
              <div
                {...getRootPropsLogo()}
                className="border border-dashed border-neutral-200 rounded-9xl p-6 w-full h-[186px] flex justify-center items-center"
              >
                <input {...getInputPropsLogo()} />
                {selectedLogo && !!!logoValidation?.length ? (
                  <div className="max-h-full max-w-full relative">
                    <img
                      src={getMediaObj([selectedLogo])[0].original}
                      className="max-h-full max-w-full"
                    />
                    <div
                      className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLogo(null);
                        resetValidationError('LOGO');
                      }}
                    >
                      <Icon name="close" size={16} color="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <Icon
                      name="documentUpload"
                      color="text-neutral-900"
                      hover={false}
                    />
                    <div className="text-neutral-900 font-medium">
                      Upload Logo
                    </div>
                    <div className="mt-1 text-neutral-500 text-xs text-center">
                      Drag and drop or click here to upload file. <br /> Ideal
                      image size: 150 x 30 px
                    </div>
                  </div>
                )}
              </div>
              {logoValidation?.length > 0 && (
                <p className="text-xxs text-neutral-500">
                  {logoValidation[0].errorMsg}
                </p>
              )}
            </div>
            <div className="flex flex-col w-1/2 gap-1">
              <div>Favicon</div>
              <div
                {...getRootPropsFavicon()}
                className="border border-dashed border-neutral-200 rounded-9xl p-6 w-full h-[186px] flex justify-center items-center"
              >
                <input {...getInputPropsFavicon()} />
                {selectedFavicon && !!!faviconValidation?.length ? (
                  <div className="max-h-full max-w-full relative">
                    <img
                      src={getMediaObj([selectedFavicon])[0].original}
                      className="max-h-full max-w-full"
                    />
                    <div
                      className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFavicon(null);
                        resetValidationError('FAVICON');
                      }}
                    >
                      <Icon name="close" size={16} color="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <Icon
                      name="documentUpload"
                      color="text-neutral-900"
                      hover={false}
                    />
                    <div className="text-neutral-900 font-medium">
                      Upload Icon
                    </div>
                    <div className="mt-1 text-neutral-500 text-xs text-center">
                      Drag and drop or click here to upload file. <br /> Ideal
                      image size: 32 x 32 px
                    </div>
                  </div>
                )}
              </div>
              {faviconValidation?.length > 0 && (
                <p className="text-xxs text-neutral-500">
                  {faviconValidation[0].errorMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Colour theme"
        className="rounded-9xl"
        headerClassName="px-6 py-4 bg-white"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-colour-theme"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4">
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
                    defaultValue: '#10B981',
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
                      defaultValue: '#1d4ed8',
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
                style={{ backgroundColor: secondaryColor || '#1d4ed8' }}
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
                style={{ backgroundColor: primaryColor || '#10B981' }}
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
        className="rounded-9xl overflow-hidden"
        headerClassName="px-6 py-4 bg-white"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-login"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4">
          <Divider />
          <div className="flex justify-between w-full items-center">
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
                      name: 'loginBackgroundType',
                      className: 'flex !flex-row gap-4',
                      control,
                      radioList: [
                        { data: { type: 'Color' }, dataTestId: 'color' },
                        { data: { type: 'Video' }, dataTestId: 'video' },
                        { data: { type: 'Image' }, dataTestId: 'image' },
                      ],
                      labelRenderer: (option: IRadioListOption) => {
                        return (
                          <p className="pl-1 text-sm">{option.data.type}</p>
                        );
                      },
                    },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  Upload Image
                </p>
                <div
                  {...getRootPropsBG()}
                  className="border border-dashed border-neutral-200 rounded-9xl p-6 w-full h-[186px] flex justify-center items-center"
                >
                  <input {...getInputPropsBG()} />
                  {selectedBG && !!!bgValidation?.length ? (
                    <div className="max-h-full max-w-full relative">
                      <img
                        src={getMediaObj([selectedBG])[0].original}
                        className="max-h-full max-w-full"
                      />
                      <div
                        className="absolute -right-3 -top-3 w-6 h-6 rounded-full flex items-center justify-center bg-black group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBG(null);
                          resetValidationError('BG');
                        }}
                      >
                        <Icon name="close" size={16} color="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Icon
                        name="documentUpload"
                        color="text-neutral-900"
                        hover={false}
                      />
                      <div className="text-neutral-900 font-medium">
                        Upload Image
                      </div>
                      <div className="mt-1 text-neutral-500 text-xs text-center">
                        Drag and drop or click here to upload file. <br /> Ideal
                        image size: 1920 x 860 px
                      </div>
                    </div>
                  )}
                </div>
                {bgValidation?.length > 0 && (
                  <p className="text-xxs text-neutral-500">
                    {bgValidation[0].errorMsg}
                  </p>
                )}
              </div>
            </div>
            <div className="flex">
              <iframe
                width={400}
                height={180}
                src="https://office.auzmor.com"
              />
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default BrandingSettings;
