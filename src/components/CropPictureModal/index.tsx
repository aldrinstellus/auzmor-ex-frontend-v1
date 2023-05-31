import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  CropperRef,
  Cropper,
  CircleStencil,
  Coordinates,
  Scale,
  FixedCropper,
  ImageRestriction,
} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import './index.css';

import { IUpdateProfileImage } from 'pages/UserDetail';
import Header from 'components/ModalHeader';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import { BlobToFile, getBlobUrl, twConfig } from 'utils/misc';
import Modal from 'components/Modal';
import { EntityType, useUpload } from 'queries/files';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';
import { updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';

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
  const { uploadMedia, uploadStatus } = useUpload();

  const cropperRef = useRef<CropperRef>(null);
  const [cropperBlobImage, setCropperBlobImage] = useState<Blob | null>(null);
  const [zoomValue, setZoomValue] = useState<number | Scale>(0);

  // 1. current blob image to show the image in cropper modal

  // 2. zoom functionality on going...
  const zoom = () => cropperRef?.current?.zoomImage(zoomValue);

  // 3. rotate functionality on going..
  // const rotate = (angle: number) => cropperRef?.current?.rotate(angle);

  const { updateUser } = useAuth();

  useEffect(() => {
    const getBlobProfileImage =
      file?.profileImage && getBlobUrl(file?.profileImage);
    const getBlobCoverImage = file?.coverImage && getBlobUrl(file?.coverImage);
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (getBlobProfileImage) {
        URL.revokeObjectURL(getBlobProfileImage);
      } else {
        URL.revokeObjectURL(getBlobCoverImage);
      }
    };
  }, []);

  const disableClosed = () => {
    setShowPictureCropModal(false);
    setShowEditProfileModal(true);
    setFile([{}]);
  };

  const updateUsersMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (response: Record<string, any>) => {
      const userUpdateResponse = response?.result?.data;
      updateUser({
        name: userUpdateResponse.fullName,
        id: userUpdateResponse.id,
        email: userUpdateResponse.primaryEmail,
        role: userUpdateResponse.role,
        organization: {
          id: userUpdateResponse.org?.id,
          domain: userUpdateResponse.org?.domain,
        },
        profileImage: userUpdateResponse.profileImage?.original,
      });
      setFile({});
      toast(<SuccessToast content={'Profile Picture Updated Successfully'} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            stroke={twConfig.theme.colors.primary['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: 2000,
      });
      setShowEditProfileModal(true);
      setShowPictureCropModal(false);
      await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
    },
  });

  const onSubmit = async () => {
    const canvas = cropperRef?.current?.getCanvas();
    canvas?.toBlob((blobImage) => {
      setCropperBlobImage(blobImage);
    }, 'image/jpeg');
    const newFile = cropperBlobImage
      ? BlobToFile(cropperBlobImage, 'newFile')
      : null;
    let profileImageUploadResponse;
    if (newFile) {
      profileImageUploadResponse = await uploadMedia(
        [newFile],
        EntityType.UserProfileImage,
      );
    }
    updateUsersMutation.mutate({
      profileImage: {
        fileId: profileImageUploadResponse && profileImageUploadResponse[0]?.id,
        original:
          profileImageUploadResponse && profileImageUploadResponse[0].original,
      },
    });
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
          <Cropper
            src={
              (file?.profileImage && getBlobUrl(file?.profileImage)) ||
              profileImage?.original
            }
            ref={cropperRef}
            stencilComponent={CircleStencil}
            stencilProps={{
              aspectRatio: 6 / 9,
              movable: true,
              resizable: true,
              // className: '', // define the entire stecil
              // movingClassName: '', // define moving the stecil
              // resizingClassName: '', // define while resizing the stecil
              previewClassName: 'preview', // define the preview inside
              overlayClassName: 'overlay',
              // boundingBoxClassName: '',
              handlerClassNames: '',
            }}
            className={'cropper'}
          />
        ) : (
          <FixedCropper
            src={
              (file?.coverImage && getBlobUrl(file?.coverImage)) ||
              coverImage?.original
            }
            stencilProps={{
              handlers: false,
              lines: false,
              movable: true,
              resizable: false,
            }}
            stencilSize={{
              width: 507,
              height: 209,
            }}
            imageRestriction={ImageRestriction.stencil}
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
                min="1"
                max="10"
                onChange={(e) => {
                  setZoomValue(parseInt(e?.target?.value));
                }}
              />
              <Icon name="plus" size={16} />
            </div>
          </div>
          <div
            onClick={() => {
              cropperRef?.current?.rotateImage(90);
            }}
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
                if (file?.profileImage) {
                  userProfileImageRef?.current?.click();
                } else {
                  userCoverImageRef?.current?.click();
                }
              }}
            />
            <Button
              label="Apply"
              onClick={onSubmit}
              disabled={updateUsersMutation?.isLoading}
              loading={updateUsersMutation?.isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(CropPictureModal);
