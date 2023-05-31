import React, { memo, useEffect, useRef, useState } from 'react';
import { CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import './index.css';
import { IUpdateProfileImage } from 'pages/UserDetail';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import { BlobToFile, getBlobUrl, twConfig } from 'utils/misc';
import Modal from 'components/Modal';
import { EntityType, UploadStatus, useUpload } from 'queries/files';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';
import { updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import Footer from './Footer';
import CircleCropper from './components/CircleCropper';
import RectangleCropper from './components/RectangleCropper';

export interface ICropPictureModalProps {
  title: string;
  showPictureCropModal: boolean;
  setShowPictureCropModal: (showModal: boolean) => void;
  setShowEditProfileModal?: (showModal: boolean) => void;
  file?: IUpdateProfileImage | Record<string, any>;
  userProfilePictureFile?: Record<string, any>;
  setUserProfilePictureFile?: (file: File[]) => void;
  setFile?: (file: IUpdateProfileImage | Record<string, any>) => void;
  userProfileImageRef: React.RefObject<HTMLInputElement> | null;
  userCoverImageRef?: React.RefObject<HTMLInputElement> | null;
  coverImage?: Record<string, any>;
  openModal?: any;
  setError?: (error: boolean) => void;
  setLoading?: (loading: boolean) => void;
}

const CropPictureModal: React.FC<ICropPictureModalProps> = ({
  title,
  showPictureCropModal,
  setShowPictureCropModal,
  setShowEditProfileModal,
  userProfilePictureFile,
  setUserProfilePictureFile,
  setFile,
  file,
  userCoverImageRef,
  userProfileImageRef,
  openModal,
  setError,
  setLoading,
}) => {
  const { updateUser } = useAuth();

  const { uploadMedia, uploadStatus } = useUpload();

  const cropperProfilePictureRef = useRef<CropperRef>(null);
  const cropperCoverPictureRef = useRef<CropperRef>(null);

  const [cropperBlobProfileImage, setCropperBlobProfileImage] =
    useState<Blob | null>(null);
  const [cropperBlobCoverImage, setCropperBlobCoverImage] =
    useState<Blob | null>(null);

  const updateUsersPictureMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (response: Record<string, any>) => {
      const userUpdateResponse = response?.result?.data;
      updateUser({
        name: userUpdateResponse?.fullName,
        id: userUpdateResponse?.id,
        email: userUpdateResponse?.primaryEmail,
        role: userUpdateResponse?.role,
        organization: {
          id: userUpdateResponse?.org?.id,
          domain: userUpdateResponse?.org?.domain,
        },
        profileImage: userUpdateResponse?.profileImage?.original,
        coverImage: userUpdateResponse?.coverImage?.original,
      });
      setFile && setFile({});
      setUserProfilePictureFile && setUserProfilePictureFile([]);
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
      setShowEditProfileModal && setShowEditProfileModal(true);
      openModal && openModal();
      setShowPictureCropModal(false);
      setCropperBlobProfileImage(null);
      setCropperBlobCoverImage(null);
      await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
    },
  });

  const { isLoading } = updateUsersPictureMutation;

  const onSubmit = async () => {
    if (file?.profileImage || userProfilePictureFile) {
      const canvas = cropperProfilePictureRef?.current?.getCanvas();
      // this is causing the issue....
      canvas?.toBlob((blobImage) => {
        if (blobImage) {
          setCropperBlobProfileImage(blobImage);
        }
      }, 'image/jpeg');

      const newFile =
        cropperBlobProfileImage &&
        BlobToFile(
          cropperBlobProfileImage,
          file?.profileImage?.name || userProfilePictureFile?.name,
        );

      let profileImageUploadResponse;
      console.log(newFile);
      if (newFile) {
        profileImageUploadResponse = await uploadMedia(
          [newFile],
          EntityType.UserProfileImage,
        );
        updateUsersPictureMutation.mutate({
          profileImage: {
            fileId:
              profileImageUploadResponse && profileImageUploadResponse[0]?.id,
            original:
              profileImageUploadResponse &&
              profileImageUploadResponse[0].original,
          },
        });
      }
    } else if (file?.coverImage) {
      // this is causing the issue....
      cropperCoverPictureRef?.current?.getCanvas()?.toBlob((blobImage) => {
        setCropperBlobCoverImage(blobImage);
      }, 'image/jpeg');

      let coverImageUploadResponse;
      const newFile =
        cropperBlobCoverImage &&
        BlobToFile(cropperBlobCoverImage, file?.coverImage?.name);
      if (newFile) {
        coverImageUploadResponse = await uploadMedia(
          [newFile],
          EntityType.UserProfileImage,
        );
        updateUsersPictureMutation.mutate({
          coverImage: {
            fileId: coverImageUploadResponse && coverImageUploadResponse[0]?.id,
            original:
              coverImageUploadResponse && coverImageUploadResponse[0].original,
          },
        });
      }
    } else {
      console.log('repositioning.....');
    }
  };

  const disableClosed = () => {
    if (
      updateUsersPictureMutation.isLoading ||
      uploadStatus === UploadStatus.Uploading
    ) {
      return null;
    } else {
      setShowPictureCropModal(false);
      setShowEditProfileModal && setShowEditProfileModal(true);
      openModal && openModal();
      setFile && setFile([{}]);
      setUserProfilePictureFile && setUserProfilePictureFile([]);
    }
  };
  const Circle =
    file?.profileImage || userProfilePictureFile ? (
      <CircleCropper
        blobFile={getBlobUrl(file?.profileImage || userProfilePictureFile)}
        cropperRef={cropperProfilePictureRef}
      />
    ) : null;
  const Rectangle = file?.coverImage ? (
    <RectangleCropper
      blobFile={getBlobUrl(file?.coverImage)}
      cropperRef={cropperCoverPictureRef}
    />
  ) : null;

  return (
    <Modal open={showPictureCropModal} closeModal={disableClosed}>
      <Header title={title} onClose={disableClosed} />
      <div>
        <div className="min-h-[320px]">
          {Circle}
          {Rectangle}
        </div>
        <Footer
          userProfileImageRef={userProfileImageRef}
          userCoverImageRef={userCoverImageRef}
          file={file}
          uploadStatus={uploadStatus}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </Modal>
  );
};

export default memo(CropPictureModal);
