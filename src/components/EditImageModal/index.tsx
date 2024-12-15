import {
  FC,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { IUpdateProfileImage } from 'pages/UserDetail';
import Header from 'components/ModalHeader';
import { BlobToFile } from 'utils/misc';
import Modal from 'components/Modal';
import { EntityType } from 'interfaces';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useAuth from 'hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import Footer from './Footer';
import ImageCropper from 'components/ImageCropper';
import PageLoader from 'components/PageLoader';
import useProduct from 'hooks/useProduct';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export interface AppProps {
  title: string;
  openEditImage: boolean;
  openEditProfileModal?: () => void;
  closeEditImageModal?: () => void;
  userProfileImageRef?: RefObject<HTMLInputElement>;
  userCoverImageRef?: RefObject<HTMLInputElement> | null;
  image: string;
  imageName: string;
  fileEntityType: EntityType;
  setImageFile?: (file: IUpdateProfileImage | Record<string, any>) => void;
  imageFile?: IUpdateProfileImage | Record<string, any>;
  onBoardImageFile?: File;
  openOnBoardModal?: () => void;
  userId?: string;
  channelId?: string;
  aspectRatio?: number;
}

export enum Shape {
  Circle = 'circle',
  Rectangle = 'rectangle',
}

const EditImageModal: FC<AppProps> = ({
  title,
  openEditImage,
  image,
  onBoardImageFile,
  imageName,
  imageFile,
  setImageFile,
  closeEditImageModal = () => {},
  userProfileImageRef,
  userCoverImageRef,
  fileEntityType,
  userId,
  channelId = '',
  aspectRatio = 4.426,
}) => {
  const { isLxp } = useProduct();
  const { updateUser } = useAuth();
  const { getApi } = usePermissions();

  const { uploadMedia, uploadStatus } = useUpload();

  const cropperRef = useRef<CropperRef>(null);

  const [blob, setBlob] = useState<Blob | null>(null);

  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setIsImageLoading(false);
    };
  }, []);

  const updateChannel = getApi(ApiEnum.UpdateChannel);
  const uploadLearnMedia = getApi(ApiEnum.UploadImage);

  const updateChannelMutation = useMutation({
    mutationFn: (data: any) => updateChannel(channelId, data),
    mutationKey: ['update-channel-name-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (_response: any) => {
      setImageFile && setImageFile({});
      successToastConfig({
        content: `${
          fileEntityType === EntityType.UserCoverImage
            ? 'Cover Picture'
            : 'Logo Picture'
        } Updated Successfully`,
      });

      closeEditImageModal();
      setBlob(null);
      if (channelId) {
        await queryClient.invalidateQueries(['channel']);
      }
    },
  });

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateUserById = getApi(ApiEnum.UpdateUser);
  const updateUsersPictureMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : (data: Record<string, any>) => updateCurrentUser(data),
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (response: Record<string, any>) => {
      if (!userId && !isLxp) {
        const userUpdateResponse = response?.result?.data;
        updateUser({
          name: userUpdateResponse?.fullName,
          id: userUpdateResponse?.id,
          email: userUpdateResponse?.primaryEmail,
          role: userUpdateResponse?.role,
          organization: {
            id: userUpdateResponse?.org?.id,
            domain: userUpdateResponse?.org?.domain,
            name: userUpdateResponse?.org?.name,
          },
          profileImage: userUpdateResponse?.profileImage?.original,
          coverImage: userUpdateResponse?.coverImage?.original,
        });
        setImageFile && setImageFile({});
        successToastConfig({
          content: `${
            fileEntityType === EntityType.UserProfileImage
              ? 'Profile Picture'
              : 'Cover Picture'
          } Updated Successfully`,
        });
      }

      closeEditImageModal();
      setBlob(null);
      if (userId) {
        await queryClient.invalidateQueries({ queryKey: ['user', userId] });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
      }
    },
  });

  const { isLoading } = updateUsersPictureMutation;
  const { isLoading: isLoadingChannel } = updateChannelMutation;

  const uploadMediaFn = async () => {
    // return if blob is incorrect
    if (!blob) return;

    // covert blob to jpg image type file
    const newFile = BlobToFile(
      blob,
      imageName || `id-${Math.random().toString(16).slice(2)}.jpg`,
    );

    // return if file is incorrect
    if (!newFile) return;

    if (isLxp) {
      // upload for lxp
      if (fileEntityType === EntityType.UserProfileImage) {
        const formData = new FormData();
        formData.append('url', newFile);
        const res = await uploadLearnMedia(formData);
        const uploadedFile = res.result?.data?.url;
        updateChannelMutation.mutate({
          displayImageUrl: uploadedFile,
        });
      } else {
        const formData = new FormData();
        formData.append('url', newFile);
        const res = await uploadLearnMedia(formData);
        const uploadedFile = res.result?.data?.url;
        updateChannelMutation.mutate({
          bannerUrl: uploadedFile,
        });
      }
    } else {
      // upload for office
      const profileImageUploadResponse = await uploadMedia(
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
  };

  useEffect(() => {
    if (blob) {
      uploadMediaFn();
    }
  }, [blob]);

  const onSubmit = async () => {
    cropperRef?.current
      ?.getCanvas()
      ?.toBlob((blobImage: SetStateAction<Blob | null>) => {
        if (blobImage) {
          setBlob(blobImage);
        }
      }, 'image/jpeg');
  };

  const disableClosed = () => {
    if (
      updateUsersPictureMutation.isLoading ||
      uploadStatus === UploadStatus.Uploading ||
      updateChannelMutation.isLoading
    ) {
      return null;
    } else {
      closeEditImageModal();
      setImageFile && setImageFile({});
    }
  };

  return (
    <Modal
      open={openEditImage}
      closeModal={() => {
        if (imageFile) {
          return null;
        }
      }}
      className={
        !imageFile?.profileImage
          ? 'max-w-[648px] flex flex-col justify-between'
          : undefined
      }
    >
      <Header
        title={title}
        onClose={disableClosed}
        closeBtnDataTestId={
          imageFile?.profileImage || onBoardImageFile
            ? 'profile-pic-close'
            : 'reposition-close'
        }
      />
      {isImageLoading ? (
        <div className="w-full h-full">
          <PageLoader />
        </div>
      ) : (
        <ImageCropper
          src={image}
          cropperRef={cropperRef}
          shape={
            imageFile?.profileImage || onBoardImageFile
              ? Shape.Circle
              : Shape.Rectangle
          }
          handlers={
            !(imageFile?.profileImage || onBoardImageFile)
              ? {
                  north: false,
                  eastNorth: false,
                  westNorth: false,
                  east: false,
                  west: false,
                  south: false,
                  westSouth: false,
                  eastSouth: false,
                }
              : undefined
          }
          aspectRatio={aspectRatio}
        />
      )}
      <Footer
        cropperRef={cropperRef}
        userProfileImageRef={userProfileImageRef}
        userCoverImageRef={userCoverImageRef}
        imageFile={imageFile}
        uploadStatus={uploadStatus}
        isLoading={isLoading || isLoadingChannel}
        onSubmit={onSubmit}
        dataTestId={
          imageFile?.profileImage || onBoardImageFile
            ? 'profile-pic'
            : 'reposition'
        }
      />
    </Modal>
  );
};

export default EditImageModal;
