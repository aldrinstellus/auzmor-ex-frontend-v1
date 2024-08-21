import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { BlobToFile, getBlobUrl, getMimeType } from 'utils/misc';
import { useDropzone } from 'react-dropzone';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { MB } from 'utils/constants';
import { UseFormSetValue } from 'react-hook-form';
import { IAddAppForm } from './AddApp';
import useModal from 'hooks/useModal';
import ImageReposition from 'components/DynamicImagePreview/components/ImageReposition';
import { Shape } from 'components/ImageCropper';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';

type UploadIconButtonProps = {
  setValue: UseFormSetValue<IAddAppForm>;
  icon?: IAddAppForm['icon'];
};

const UploadIconButton: FC<UploadIconButtonProps> = ({ setValue, icon }) => {
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'uploadIconButton',
  });

  const { isLxp } = useProduct();
  const [isEditIconModalOpen, openEditIconModal, closeEditIconModal] =
    useModal();
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  // Callback function to handle file upload
  const handleIconUpload = (file: File) => {
    const iconElement = document.getElementById(
      'add-app-icon',
    ) as HTMLImageElement;
    const blobFile = BlobToFile(file, tempFile?.name || '', file.type);
    iconElement.src = getBlobUrl(blobFile);
    setValue('icon', {
      id: '',
      original: '',
      file: blobFile,
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        openEditIconModal();
        setTempFile(acceptedFiles[0]);
      }
    },
    [openEditIconModal],
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, inputRef } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      onDropRejected: (rejection) => {
        const error = rejection[0].errors[0];
        if (error.code === 'file-invalid-type') {
          showErrorToast(t('fileTypeError'));
          setError(t('unsupportedFileTypes'));
          return;
        }
        if (error.code === 'file-size-exceed') {
          showErrorToast(t('fileSizeError'));
          setError(t('fileSizeExceedsLimit'));
          return;
        }
      },
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        ...(isLxp ? {} : { 'image/svg+xml': ['.svg'] }),
      },
      validator: (file) => {
        if (file.size > 8 * MB) {
          return {
            code: 'file-size-exceed',
            message: t('fileSizeExceedsLimit'),
          };
        }
        return null;
      },
    });

  const clearInput = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setValue('icon', undefined);
  };

  // Edit flow prefill icon
  useEffect(() => {
    let src = '';
    if (icon) {
      if (icon.file) {
        src = URL.createObjectURL(icon.file);
      } else if (icon.original) src = icon.original;
      const iconElement = document.getElementById(
        'add-app-icon',
      ) as HTMLImageElement;
      iconElement.src = src;
    }
    return () => {
      if (icon?.file) URL.revokeObjectURL(src);
    };
  }, []);

  const showErrorToast = (message: string) =>
    failureToastConfig({ content: message, dataTestId: 'comment-toaster' });

  const hasIcon = !!icon?.original || icon?.file;

  return (
    <div>
      <div className="flex justify-between pb-1">
        <p className="text-neutral-900 font-bold text-sm">{t('uploadIcon')}</p>
        <Tooltip
          tooltipContent={
            <div>
              <p className="font-bold text-white align-middle flex justify-center">
                {t('logoAcceptanceTitle')}
              </p>
              <p className="text-white">{`${t('fileTypes')} JPG, PNG ${
                isLxp ? '' : ',SVG'
              }`}</p>
              <p className="text-white">{t('maxSize')}</p>
            </div>
          }
          tooltipPosition="left"
        >
          <Icon
            name="infoCircle"
            color="text-neutral-500"
            hover={false}
            size={16}
            dataTestId="add-app-icon-info"
          />
        </Tooltip>
      </div>
      <div
        className={`border-dashed border-1 border-neutral-200 rounded-9xl ${
          isDragActive && isDragAccept ? 'bg-gray-100' : 'bg-white'
        }`}
        {...getRootProps()}
      >
        <label htmlFor="upload-app-icon" className="cursor-pointer">
          <div
            className="flex flex-col items-center justify-evenly h-[186px] gap-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input id="upload-app-icon" {...getInputProps()} />

            <div
              className={`${
                !hasIcon ? 'block' : 'hidden'
              } flex flex-col items-center justify-between gap-y-2`}
            >
              {error ? (
                <>
                  <Icon
                    name="infoCircle"
                    size={24}
                    className="text-[#F05252]"
                    hover={false}
                  />
                  <p
                    className="text-red-500 font-medium text-sm"
                    data-testid="add-app-icon-failed"
                  >
                    {t('uploadFailed')}
                  </p>
                  <p className="text-neutral-500 font-medium text-xs">
                    {error}
                    <span
                      className="text-primary-500 font-bold cursor-pointer"
                      data-testid="add-app-icon-try-again"
                    >
                      {' '}
                      {t('tryAgain')}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <Icon
                    name="documentUpload"
                    size={24}
                    color="text-neutral-900"
                  />
                  <p className="text-neutral-900 font-medium text-sm">
                    {t('uploadIcon')}
                  </p>
                  <p className="text-neutral-500 font-medium text-xs">
                    {t('dragDropOrClick')}
                    <span
                      className="text-primary-500 font-bold cursor-pointer"
                      data-testid="add-app-icon"
                    >
                      {' '}
                      {t('clickHere')}
                    </span>{' '}
                    {t('toUpload')}
                  </p>
                </>
              )}
            </div>
            <div
              className={`${
                hasIcon && !error
                  ? 'block bg-neutral-100 rounded-lg relative group p-[10.3px] text-neutral-200'
                  : 'hidden'
              }`}
            >
              <div
                className="group-hover:block group-hover:opacity-100 transition hidden cursor-pointer absolute -top-2 -right-2 bg-black rounded-full p-[4px]"
                onClick={(e) => clearInput(e)}
              >
                <Icon
                  name="close"
                  size={16}
                  color="text-white"
                  disabled
                  dataTestId="add-app-remove-icon"
                />
              </div>
              <img
                id="add-app-icon"
                className="h-[52px] w-auto group-hover:opacity-50 transition-opacity duration-100"
                alt={t('appIconAlt')}
              />
            </div>
          </div>
        </label>
      </div>
      {isEditIconModalOpen && (
        <ImageReposition
          title={t('repositionTitle')}
          openEditImage={isEditIconModalOpen}
          closeEditImageModal={closeEditIconModal}
          image={getBlobUrl(tempFile!)}
          imageRef={inputRef}
          setImageFile={handleIconUpload}
          imageFile={tempFile}
          mimeType={getMimeType(tempFile?.name || '')}
          aspectRatio={1}
          shape={Shape.Square}
        />
      )}
    </div>
  );
};

export default UploadIconButton;
