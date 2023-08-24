import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { twConfig } from 'utils/misc';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { UseFormSetValue } from 'react-hook-form';
import { IAddAppForm } from './AddApp';
import { AppIcon } from 'queries/apps';

type UploadIconButtonProps = {
  setValue: UseFormSetValue<IAddAppForm>;
  icon?: AppIcon;
};

const UploadIconButton: React.FC<UploadIconButtonProps> = ({
  setValue,
  icon,
}) => {
  const [error, setError] = useState('');
  // Callback function to handle file upload
  const handleIconUpload = (file: File) => {
    let isError = false;
    // 1. File is of jpeg/jpg, png or svg
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      isError = true;
      showErrorToast('Only JPEG/PNG/SVG filetypes are supported!');
      setError('Unsupported filetypes.');
    }

    // 2. File is under 8MB
    if (file.size > 8 * 1024 * 1024) {
      isError = true;
      showErrorToast('Uploaded image must be less than 8MB in size!');
      setError('The file size exceed the limit.');
    }

    // 3. File is of max 100 x 100 resolution
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      // If the image has unsupported dimensions, throw an error
      if (img.width > 100 || img.height > 100) {
        isError = true;
        showErrorToast(
          'Uploaded image must not be more than 100x100px resolution',
        );
        setError('File resolution not matched.');
      }
      // If the image has supported dimensions, then call setAppIcon
      else if (!isError) {
        setValue('icon', file);
        setAppIcon(Array.prototype.slice.call([file]));

        const iconElement = document.getElementById('icon') as HTMLImageElement;

        iconElement.src = objectURL;
      }
      URL.revokeObjectURL(objectURL);
    };
    img.src = objectURL;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    if (acceptedFiles.length) {
      handleIconUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept } =
    useDropzone({
      onDrop,
      accept: {
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'image/svg+xml': ['.svg', '.xml'],
      },
    });

  const [appIcon, setAppIcon] = useState<File[]>();
  const [currentIcon, setCurrentIcon] = useState<AppIcon | undefined>(icon);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setValue('icon', undefined);
    setCurrentIcon(undefined);
    setAppIcon([]);
  };

  // Edit flow prefill icon
  useEffect(() => {
    if (icon) {
      setCurrentIcon(icon);
      const iconElement = document.getElementById('icon') as HTMLImageElement;

      iconElement.src = icon.original;
    }
  }, []);

  const showErrorToast = (message: string) => {
    toast(<FailureToast content={message} dataTestId="comment-toaster" />, {
      closeButton: (
        <Icon
          name="closeCircleOutline"
          color={twConfig.theme.colors.red['500']}
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
    });
  };

  const hasIcon = currentIcon?.id || (appIcon && appIcon.length > 0);

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
              <p className="text-white">Resolution: 100 x 100 px</p>
              <p className="text-white">Max size: 8MB</p>
            </div>
          }
          tooltipPosition="left"
        >
          <Icon
            name="infoCircle"
            color={twConfig.theme.colors.neutral['500']}
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
        <label htmlFor="upload-app-icon">
          <div
            className="flex flex-col items-center justify-evenly h-[176px] gap-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {!hasIcon && (
              <input
                id="upload-app-icon"
                {...getInputProps()}
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/svg+xml"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    // Check for all three conditions:
                    const file = e.target.files[0];
                    handleIconUpload(file);
                  }
                }}
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = '';
                  }
                }}
              />
            )}

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
                    color={twConfig.theme.colors.neutral['900']}
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
                  color="#fff"
                  disabled
                  dataTestId="add-app-remove-icon"
                />
              </div>
              <img
                id="icon"
                className="h-[71px] w-auto group-hover:opacity-50 transition-opacity duration-100"
              />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadIconButton;
