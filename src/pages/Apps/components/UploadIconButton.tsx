import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { BlobToFile, getBlobUrl, getMimeType, twConfig } from 'utils/misc';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { MB, TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { UseFormSetValue } from 'react-hook-form';
import { IAddAppForm } from './AddApp';
import useModal from 'hooks/useModal';
import ImageReposition from 'components/DynamicImagePreview/components/ImageReposition';

type UploadIconButtonProps = {
  setValue: UseFormSetValue<IAddAppForm>;
  icon?: IAddAppForm['icon'];
};

const UploadIconButton: FC<UploadIconButtonProps> = ({ setValue, icon }) => {
  const [isEditIconModalOpen, openEditIconModal, closeEditIconModal] =
    useModal();
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  // Callback function to handle file upload
  const handleIconUpload = (file: File) => {
    console.log(file);

    const iconElement = document.getElementById(
      'add-app-icon',
    ) as HTMLImageElement;
    const blobFile = BlobToFile(
      file,
      `id-${Math.random().toString(16).slice(2)}`,
      file.type,
    );
    iconElement.src = getBlobUrl(blobFile);
    setValue('icon', { id: '', original: '', file: blobFile });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    if (acceptedFiles.length) {
      openEditIconModal();
      setTempFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, inputRef } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      onDropRejected: (rejection) => {
        // extension validation
        const error = rejection[0].errors[0];
        if (error.code === 'file-invalid-type') {
          showErrorToast('Only JPEG/PNG/SVG filetypes are supported!');
          setError('Unsupported filetypes.');
          return;
        }
        if (error.code === 'file-size-exceed') {
          showErrorToast('Uploaded image must be less than 8MB in size!');
          setError('The file size exceed the limit.');
          return;
        }
      },
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/svg': ['.svg'],
      },
      validator: (file) => {
        // size validation
        if (file.size > 8 * MB) {
          return {
            code: 'file-size-exceed',
            message: 'The file size exceeds the limit',
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

  const showErrorToast = (message: string) => {
    toast(<FailureToast content={message} dataTestId="comment-toaster" />, {
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
    });
  };

  const hasIcon = !!icon?.original || icon?.file;

  return (
    <div>
      <div className="flex justify-between pb-1">
        <p className="text-neutral-900 font-bold text-sm">Upload Icon</p>
        <Tooltip
          tooltipContent={
            <div>
              <p className="font-bold text-white align-middle flex justify-center">
                Logo Acceptance:
              </p>
              <p className="text-white">File types: JPG, PNG, SVG</p>
              <p className="text-white">Max size: 8MB</p>
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
                    Oops! Upload failed
                  </p>
                  <p className="text-neutral-500 font-medium text-xs">
                    {error}
                    <span
                      className="text-primary-500 font-bold cursor-pointer"
                      data-testid="add-app-icon-try-again"
                    >
                      {' '}
                      Try again
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
                    Upload App Icon
                  </p>
                  <p className="text-neutral-500 font-medium text-xs">
                    Drag and drop or{' '}
                    <span
                      className="text-primary-500 font-bold cursor-pointer"
                      data-testid="add-app-icon"
                    >
                      click here
                    </span>{' '}
                    to upload file
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
              />
            </div>
          </div>
        </label>
      </div>
      {isEditIconModalOpen && (
        <ImageReposition
          title="Reposition"
          openEditImage={isEditIconModalOpen}
          closeEditImageModal={closeEditIconModal}
          image={getBlobUrl(tempFile!)}
          imageRef={inputRef}
          setImageFile={handleIconUpload}
          imageFile={tempFile}
          mimeType={getMimeType(tempFile?.name || '')}
          defaultSize={(cropperState) => {
            const aspectRatio = 1;
            const w = cropperState.imageSize.width;
            const h = cropperState.imageSize.height;
            const DEFAUTL_MARGIN = 8; // in pixel
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
    </div>
  );
};

export default UploadIconButton;
