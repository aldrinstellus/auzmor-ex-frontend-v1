import Button, { Size, Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { IUpdateProfileImage } from 'pages/UserDetail';
import { UploadStatus } from 'hooks/useUpload';
import React, { useRef } from 'react';
import { CropperRef } from 'react-advanced-cropper';

export interface IFooterProps {
  userProfileImageRef: React.RefObject<HTMLInputElement> | null;
  userCoverImageRef?: React.RefObject<HTMLInputElement> | null;
  imageFile?: IUpdateProfileImage | Record<string, any>;
  uploadStatus: UploadStatus;
  isLoading: boolean;
  onSubmit: any;
  cropperRef: React.RefObject<CropperRef>;
  dataTestId?: string;
}

const Footer: React.FC<IFooterProps> = ({
  userProfileImageRef,
  userCoverImageRef,
  imageFile,
  uploadStatus,
  isLoading,
  onSubmit,
  cropperRef,
  dataTestId,
}) => {
  const sliderValueRef = useRef<number>(0);
  const sliderInputRef = useRef<HTMLInputElement>(null);
  const zoomIn = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage({ factor: 1.1 }, { immediately: true }); // zoom-in 1.1x
    }
  };

  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage({ factor: 0.9 }, { immediately: true }); // zoom-out 0.9x
    }
  };
  return (
    <div>
      <Divider />
      <div className="h-[53px] px-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="text-sm font-bold text-neutral-900">Zoom</div>
          <div className="flex items-center space-x-2">
            <Icon
              name="minus"
              size={16}
              dataTestId={`${dataTestId}-zoom-min`}
              onClick={() => {
                const sliderValue = parseInt(
                  (sliderInputRef.current as any).value as any,
                );
                if (sliderValue > 0) {
                  zoomOut();
                  ((sliderInputRef.current as any).value as any) =
                    sliderValue - 1;
                }
              }}
            />
            <input
              type="range"
              className="appearance-none w-[136px] h-1 bg-neutral-200 text-red-400 rounded"
              min={1}
              max={10}
              defaultValue={0}
              onChange={(e) => {
                if (sliderValueRef.current > parseInt(e.target.value)) {
                  zoomOut();
                } else if (sliderValueRef.current < parseInt(e.target.value)) {
                  zoomIn();
                }
                sliderValueRef.current = parseInt(e.target.value);
              }}
              ref={sliderInputRef}
            />
            <Icon
              name="plus"
              size={16}
              dataTestId={`${dataTestId}-zoom-max`}
              onClick={() => {
                const sliderValue = parseInt(
                  (sliderInputRef.current as any).value as any,
                );
                if (sliderValue < 10) {
                  zoomIn();
                  ((sliderInputRef.current as any).value as any) =
                    sliderValue + 1;
                }
              }}
            />
          </div>
        </div>
        <div
          onClick={() => cropperRef?.current?.transformImage({ rotate: -90 })}
          data-testid={`${dataTestId}-tilt`}
        >
          <Icon name="rotateLeft" />
        </div>
      </div>
      <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <div></div>
        <div className="flex space-x-3">
          <Button
            label="Change Photo"
            variant={Variant.Secondary}
            size={Size.Small}
            onClick={() => {
              if (imageFile?.profileImage) {
                userProfileImageRef?.current?.click();
              } else if (imageFile?.coverImage) {
                userCoverImageRef?.current?.click();
              } else {
                if (imageFile?.profileImage) {
                  userProfileImageRef?.current?.click();
                } else {
                  userCoverImageRef?.current?.click();
                }
              }
            }}
            dataTestId={`${dataTestId}-chnagephoto`}
          />
          <Button
            label="Apply"
            onClick={onSubmit}
            loading={uploadStatus === UploadStatus.Uploading || isLoading}
            dataTestId={`${dataTestId}-apply`}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
