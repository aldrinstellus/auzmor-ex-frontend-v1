import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import React, { useCallback, useRef, useState } from 'react';
import { twConfig } from 'utils/misc';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { UseFormSetValue } from 'react-hook-form';
import { IAddAppForm } from './AddApp';

type UploadIconButtonProps = {
  setValue: UseFormSetValue<IAddAppForm>;
};

const UploadIconButton: React.FC<UploadIconButtonProps> = ({ setValue }) => {
  // Callback function to handle file upload
  const handleIconUpload = (file: File) => {
    let isError = false;
    // 1. File is of jpeg/jpg, png or svg
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      isError = true;
      showErrorToast('Only JPEG/PNG/SVG filetypes are supported!');
    }

    // 2. File is under 8MB
    if (file.size > 8 * 1024 * 1024) {
      isError = true;
      showErrorToast('Uploaded image must be less than 8MB in size!');
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
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setAppIcon([]);
  };

  const showErrorToast = (message: string) => {
    toast(<FailureToast content={message} dataTestId="comment-toaster" />, {
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
    });
  };

  return (
    <div>
      <div className="flex justify-between pb-2">
        <p className="text-neutral-900 font-bold">Upload Icon</p>
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
            stroke={twConfig.theme.colors.neutral['500']}
            hover={false}
            disabled={true}
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
            className="flex flex-col items-center justify-evenly p-6 gap-y-2"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div
              className={`${
                appIcon ? 'hidden' : 'block'
              } flex flex-col items-center justify-between gap-y-2`}
            >
              <Icon
                name="documentUpload"
                size={24}
                stroke={twConfig.theme.colors.neutral['900']}
              />
              <p className="text-neutral-900 font-medium">Upload App Icon</p>
              <p className="text-neutral-500 font-medium">
                Drag and drop or{' '}
                <span className="text-primary-500 font-bold cursor-pointer">
                  click here
                </span>{' '}
                to upload file
              </p>
            </div>

            <div className={`${appIcon ? 'block' : 'block'}`}>
              <img id="icon" />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadIconButton;
