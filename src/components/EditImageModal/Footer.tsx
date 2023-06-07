import Button, { Size, Variant } from 'components/Button';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import { IUpdateProfileImage } from 'pages/UserDetail';
import { UploadStatus } from 'queries/files';
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
}

const Footer: React.FC<IFooterProps> = ({
  userProfileImageRef,
  userCoverImageRef,
  imageFile,
  uploadStatus,
  isLoading,
  onSubmit,
  cropperRef,
}) => {
  const sliderValueRef = useRef<number>(0);
  const zoomIn = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage({ factor: 1.1 }, { immediately: true }); // zoom-in 2x
    }
  };

  const zoomOut = () => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage({ factor: 0.9 }, { immediately: true }); // zoom-out 2x
    }
  };
  return (
    <div>
      <Divider />
      <div className="h-[53px] px-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="text-sm font-bold text-neutral-900">Zoom</div>
          <div className="flex items-center space-x-2">
            <Icon name="minus" size={16} />
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
            />
            <Icon name="plus" size={16} />
          </div>
        </div>
        <div
          onClick={() => cropperRef?.current?.transformImage({ rotate: 90 })}
        >
          <Icon name="rotateLeft" />
        </div>
      </div>
      <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
        <div></div>
        <div className="flex space-x-3">
          <Button
            label="Change Photo"
            variant={Variant.Secondary}
            size={Size.Small}
            onClick={() => {
              if (imageFile?.profileImage) {
                userProfileImageRef?.current?.click();
              } else {
                userCoverImageRef?.current?.click();
              }
            }}
          />
          <Button
            label="Apply"
            onClick={onSubmit}
            loading={uploadStatus === UploadStatus.Uploading || isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
