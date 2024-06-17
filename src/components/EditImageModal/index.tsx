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
import { EntityType } from 'queries/files';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useAuth from 'hooks/useAuth';
import { updateCurrentUser, updateUserById } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import Footer from './Footer';
import ImageCropper from 'components/ImageCropper';
import PageLoader from 'components/PageLoader';

export interface AppProps {
  title: string;
  openEditImage: boolean;
  openEditProfileModal?: () => void;
  closeEditImageModal?: () => void;
  userProfileImageRef: RefObject<HTMLInputElement>;
  userCoverImageRef?: RefObject<HTMLInputElement> | null;
  image: string;
  imageName: string;
  fileEntityType: EntityType;
  setImageFile?: (file: IUpdateProfileImage | Record<string, any>) => void;
  imageFile?: IUpdateProfileImage | Record<string, any>;
  onBoardImageFile?: File;
  openOnBoardModal?: () => void;
  userId?: string;
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
}) => {
  const { updateUser } = useAuth();

  const { uploadMedia, uploadStatus } = useUpload();

  const cropperRef = useRef<CropperRef>(null);

  const [blob, setBlob] = useState<Blob | null>(null);

  // const [height, setHeight] = useState<number>(1000);
  // const [width, setWidth] = useState<number>(1000);
  // const [top, setTop] = useState<number>(0);
  // const [left, setLeft] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  // To determine the custom visible area in the image cropper
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      const _getWidthFactor = (width: number): number => {
        // Need better algorithm here
        let factor = 0.6;
        if (width > 3000) factor = 0.7;
        return factor;
      };

      // setHeight(img.height * 0.8);
      // setWidth(img.width * getWidthFactor(img.width));
      // setTop(img.height / 4);
      // setLeft(img.width / 4);
      setIsImageLoading(false);
    };

    img.src = image;
  }, []);

  const updateUsersPictureMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (response: Record<string, any>) => {
      if (!userId) {
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
          message: `${
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
      ?.toBlob((blobImage: SetStateAction<Blob | null>) => {
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
          aspectRatio={7.38}
        />
      )}
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
    </Modal>
  );
};

export default EditImageModal;
