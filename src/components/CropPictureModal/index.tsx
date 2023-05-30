import React, { useState } from 'react';
import { IUpdateProfileImage } from 'pages/UserDetail';
import Header from 'components/ModalHeader';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import { getBlobUrl } from 'utils/misc';
import Modal from 'components/Modal';

export interface ICropPictureModalProps {
  title: string;
  showPictureCropModal: boolean;
  setShowPictureCropModal: (showModal: boolean) => void;
  setShowEditProfileModal: (showModal: boolean) => void;
  file: IUpdateProfileImage | Record<string, any>;
  setFile: (file: IUpdateProfileImage | Record<string, any>) => void;
  userProfileImageRef: React.RefObject<HTMLInputElement> | null;
  userCoverImageRef: React.RefObject<HTMLInputElement> | null;
  profileImage: Record<string, any>;
  coverImage: Record<string, any>;
}

const CropPictureModal: React.FC<ICropPictureModalProps> = ({
  title,
  showPictureCropModal,
  setShowPictureCropModal,
  setShowEditProfileModal,
  setFile,
  file,
  userCoverImageRef,
  userProfileImageRef,
  profileImage,
  coverImage,
}) => {
  const disableClosed = () => {
    setShowPictureCropModal(false);
    setShowEditProfileModal(true);
    setFile([{}]);
  };

  return (
    <Modal
      open={showPictureCropModal}
      closeModal={() => {
        setShowPictureCropModal(false);
        setShowEditProfileModal(false);
      }}
    >
      <Header title={title} onClose={disableClosed} />
      <div>
        {file?.profileImage ? (
          <img
            src={
              (file?.profileImage && getBlobUrl(file?.profileImage)) ||
              profileImage?.original
            }
            alt="profile image crop"
            className="h-[320px] w-full"
          />
        ) : file?.coverImage ? (
          <img
            src={file?.coverImage && getBlobUrl(file?.coverImage)}
            alt="Cover Image Crop"
            className="h-[320px] w-full"
          />
        ) : (
          <img
            src={coverImage?.original}
            alt="Cover Image Crop"
            className="h-[320px] w-full"
          />
        )}
        <Divider />
        <div className="h-[53px] px-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="text-sm font-bold text-neutral-900">Zoom</div>
            <div className="flex items-center space-x-2">
              <Icon name="minus" size={16} />
              <input
                type="range"
                className="appearance-none w-[136px] h-1 bg-neutral-200 text-red-400 rounded"
                min="-10"
                max="10"
              />
              <Icon name="plus" size={16} />
            </div>
          </div>
          <div
            onClick={() => {
              console.log('rotate image');
            }}
          >
            <Icon name="plus" />
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
                if (file?.profileImage) {
                  userProfileImageRef?.current?.click();
                } else {
                  userCoverImageRef?.current?.click();
                }
              }}
            />
            <Button
              label="Apply"
              onClick={() => {
                console.log('Applying....');
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CropPictureModal;
