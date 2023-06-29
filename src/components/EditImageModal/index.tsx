import React, { useEffect, useRef, useState } from 'react';
import { CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { IUpdateProfileImage } from 'pages/UserDetail';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import { BlobToFile, twConfig } from 'utils/misc';
import Modal from 'components/Modal';
import { EntityType, UploadStatus, useUpload } from 'queries/files';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';
import { updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import Footer from './Footer';
import ImageCropper from 'components/ImageCropper';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';

export interface IEditImageModalProps {
  title: string;
  openEditImage: boolean;
  openEditProfileModal?: () => void;
  closeEditImageModal?: () => void;
  userProfileImageRef: React.RefObject<HTMLInputElement>;
  userCoverImageRef?: React.RefObject<HTMLInputElement> | null;
  image: string;
  imageName: string;
  fileEntityType: EntityType;
  setImageFile?: (file: IUpdateProfileImage | Record<string, any>) => void;
  imageFile?: IUpdateProfileImage | Record<string, any>;
  onBoardImageFile?: File;
  openOnBoardModal?: () => void;
}

export enum Shape {
  Circle = 'circle',
  Rectangle = 'rectangle',
}

const EditImageModal: React.FC<IEditImageModalProps> = ({
  title,
  openEditImage,
  image,
  onBoardImageFile,
  imageName,
  imageFile,
  setImageFile,
  openEditProfileModal = () => {},
  closeEditImageModal = () => {},
  userProfileImageRef,
  userCoverImageRef,
  fileEntityType,
  openOnBoardModal = () => {},
}) => {
  const { updateUser } = useAuth();

  const { uploadMedia, uploadStatus } = useUpload();

  const cropperRef = useRef<CropperRef>(null);

  const [blob, setBlob] = useState<Blob | null>(null);

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
      setImageFile && setImageFile({});
      toast(
        <SuccessToast
          content={`${
            fileEntityType === EntityType.UserProfileImage
              ? 'Profile Picture'
              : 'Cover Picture'
          } Updated Successfully`}
        />,
        {
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
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
        },
      );
      closeEditImageModal();
      openEditProfileModal();
      setBlob(null);
      await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
    },
  });

  const { isLoading } = updateUsersPictureMutation;

  const uploadMediaFn = async () => {
    if (blob) {
      const newFile = BlobToFile(
        blob,
        imageName || `id-${Math.random().toString(16).slice(2)}`,
      );
      let profileImageUploadResponse;
      if (newFile) {
        profileImageUploadResponse = await uploadMedia(
          [newFile],
          fileEntityType,
        );
        if (fileEntityType === EntityType.UserProfileImage) {
          updateUsersPictureMutation.mutate({
            profileImage: {
              fileId:
                profileImageUploadResponse && profileImageUploadResponse[0]?.id,
              original:
                profileImageUploadResponse &&
                profileImageUploadResponse[0].original,
            },
          });
        } else {
          updateUsersPictureMutation.mutate({
            coverImage: {
              fileId:
                profileImageUploadResponse && profileImageUploadResponse[0]?.id,
              original:
                profileImageUploadResponse &&
                profileImageUploadResponse[0].original,
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (blob) {
      uploadMediaFn();
    }
  }, [blob]);

  const onSubmit = async () => {
    cropperRef?.current
      ?.getCanvas()
      ?.toBlob((blobImage: React.SetStateAction<Blob | null>) => {
        if (blobImage) {
          setBlob(blobImage);
        }
      }, 'image/jpeg');
  };

  const disableClosed = () => {
    if (
      updateUsersPictureMutation.isLoading ||
      uploadStatus === UploadStatus.Uploading
    ) {
      return null;
    } else {
      closeEditImageModal();
      setImageFile && setImageFile({});
      openEditProfileModal();
      openOnBoardModal();
    }
  };

  return (
    <Modal open={openEditImage} closeModal={disableClosed}>
      <Header
        title={title}
        onClose={disableClosed}
        closeBtnDataTestId={
          imageFile?.profileImage || onBoardImageFile
            ? 'profile-pic-close'
            : 'reposition-close'
        }
      />
      <div>
        <ImageCropper
          src={image}
          cropperRef={cropperRef}
          shape={
            imageFile?.profileImage || onBoardImageFile
              ? Shape.Circle
              : Shape.Rectangle
          }
        />
        <Footer
          cropperRef={cropperRef}
          userProfileImageRef={userProfileImageRef}
          userCoverImageRef={userCoverImageRef}
          imageFile={imageFile}
          uploadStatus={uploadStatus}
          isLoading={isLoading}
          onSubmit={onSubmit}
          dataTestId={
            imageFile?.profileImage || onBoardImageFile
              ? 'profile-pic'
              : 'reposition'
          }
        />
      </div>
    </Modal>
  );
};

export default EditImageModal;
