import React from 'react';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Avatar from 'components/Avatar';
import { Variant as InputVariant } from 'components/Input';
import { getBlobUrl } from 'utils/misc';
import { IUpdateProfileImage } from 'pages/UserDetail';
import { EntityType, UploadStatus, useUpload } from 'queries/files';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import useAuth from 'hooks/useAuth';
import queryClient from 'utils/queryClient';
import Header from 'components/ModalHeader';
// import PopupMenu from 'components/PopupMenu';

interface IOptions {
  value: string;
  label: string;
}

export interface IUpdateProfileForm {
  fullName: string;
  firstName: string;
  designation: IOptions;
  department: IOptions;
  preferredName: string;
  workLocation: IOptions;
}

interface IEditProfileModal {
  data: Record<string, any>;
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  file: IUpdateProfileImage | Record<string, any>;
  setFile: (file: IUpdateProfileImage | Record<string, any>) => void;
  userProfileImageRef: React.RefObject<HTMLInputElement> | null;
  userCoverImageRef: React.RefObject<HTMLInputElement> | null;
}

const EditProfileModal: React.FC<IEditProfileModal> = ({
  data,
  showModal,
  setShowModal,
  file,
  setFile,
  userProfileImageRef,
  userCoverImageRef,
}) => {
  const { uploadMedia, uploadStatus } = useUpload();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUpdateProfileForm>({
    mode: 'onSubmit',
    defaultValues: {
      firstName: data?.firstName,
      fullName: data?.fullName,
      preferredName: data?.preferredName,
      designation: data?.designation,
      workLocation: data?.workLocation,
      department: data?.department,
    },
  });
  const nameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      name: 'fullName',
      label: 'Name',
      dataTestId: 'user-profile-name',
      control,
    },
  ];

  const preferredNameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      // placeholder: 'Nickname or first name',
      name: 'preferredName',
      label: 'Preferred Name',
      dataTestId: '',
      control,
    },
  ];

  const positionTitlefields = [
    {
      type: FieldType.SingleSelect,
      name: 'designation',
      // placeholder: 'ex. Tech Lead',
      label: 'Position title',
      options: [
        { value: 'Software Engineer', label: 'Software Engineer' },
        { value: 'Research Analyst', label: 'Research Analyst' },
      ],
      control,
    },
  ];

  // const departmentField = [
  //   {
  //     type: FieldType.SingleSelect,
  //     name: 'department',
  //     // defaultValue: data?.department,
  //     // placeholder: 'ex. Engineering',
  //     label: 'Department',
  //     options: [
  //       { value: 'Sales and Marketing', label: 'Sales and Marketing' },
  //       { value: 'Engineering', label: 'Engineering' },
  //     ],
  //     control,
  //   },
  // ];

  const locationField = [
    {
      type: FieldType.SingleSelect,
      name: 'workLocation',
      label: 'Location',
      options: [
        { value: 'Mumbai, India', label: 'Mumbai, India' },
        { value: 'Hydrabad, Talangana', label: 'Hydrabad, Talangana' },
      ],
      control,
    },
  ];

  const coverImageOption = [
    {
      icon: 'bookmarkOutline',
      label: 'Upload a photo',
      onClick: () => userCoverImageRef?.current?.click(),
    },
    {
      icon: 'copyLink',
      label: 'Reposition',
      onClick: () => null,
    },
    {
      icon: 'copyLink',
      label: 'Delete post',
      onClick: () => null,
    },
  ];
  const { updateUser } = useAuth();

  const updateUsersMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    // need to change the response type
    onSuccess: async (response: Record<string, any>) => {
      const userUpdateResponse = response?.result?.data;
      updateUser({
        name: userUpdateResponse.fullName,
        id: userUpdateResponse.id,
        email: userUpdateResponse.primaryEmail,
        organization: {
          id: userUpdateResponse.org?.id,
          domain: userUpdateResponse.org?.domain,
        },
        workLocation: userUpdateResponse.workLocation,
        preferredName: userUpdateResponse.preferredName,
        designation: userUpdateResponse.designation,
        // department: userUpdateResponse.department,
        location: userUpdateResponse.location,
        profileImage: userUpdateResponse.profileImage?.original,
        coverImage: userUpdateResponse.profileImage?.original,
      });
      setFile({});
      setShowModal(false);
      await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
    },
  });

  const onSubmit = async (user: IUpdateProfileForm) => {
    let profileImageUploadResponse;
    let coverImageUploadResponse;
    // optimize with one uploadMedia function - taking time to upload the files
    if (Object.keys(file).length) {
      profileImageUploadResponse = await uploadMedia(
        [file?.profileImage],
        EntityType.UserProfileImage,
      );
      coverImageUploadResponse = await uploadMedia(
        [file?.coverImage],
        EntityType.UserCoverImage,
      );
    }
    const profileImageFile = profileImageUploadResponse
      ? {
          profileImage: {
            fileId: profileImageUploadResponse[0]?.id,
            original: profileImageUploadResponse[0].original,
          },
        }
      : {};
    const coverImageFile = coverImageUploadResponse
      ? {
          coverImage: {
            fileId: coverImageUploadResponse[0]?.id,
            original: coverImageUploadResponse[0]?.original,
          },
        }
      : {};
    updateUsersMutation.mutate({
      fullName: user.fullName,
      designation: user?.designation?.value,
      preferredName: user?.firstName,
      // department: user?.department?.value,
      workLocation: user?.workLocation?.value,
      ...profileImageFile,
      ...coverImageFile,
    });
  };

  const disableClosed = () => {
    if (
      updateUsersMutation.isLoading ||
      uploadStatus === UploadStatus.Uploading
    ) {
      return null;
    } else {
      return setShowModal(false);
    }
  };

  return (
    <Modal open={showModal} closeModal={disableClosed}>
      <form>
        <Header title="Edit Profile" onClose={disableClosed} />
        <div className="relative cursor-pointer">
          <img
            className="object-cover w-full h-[108px]"
            src={
              (file?.coverImage && getBlobUrl(file?.coverImage)) ||
              data?.coverImage?.original
            }
          />
          {/* <PopupMenu
            triggerNode={
              <div className="cursor-pointer p-2">
                <IconButton
                  icon="edit"
                  className="bg-white m-4 absolute top-0 right-0 p-3 text-black"
                  variant={IconVariant.Secondary}
                  size={Size.Medium}
                  onClick={() => userCoverImageRef?.current?.click()}
                />
              </div>
            }
            menuItems={coverImageOption}
          /> */}
          <IconButton
            icon="edit"
            className="bg-white m-4 absolute top-0 right-0 p-3 text-black"
            variant={IconVariant.Secondary}
            size={Size.Medium}
            onClick={() => userCoverImageRef?.current?.click()}
          />
        </div>
        <div className="ml-8 mb-8 flex items-center">
          <div className="-mt-20">
            <div className="relative">
              <Avatar
                name={data?.fullName}
                image={
                  (file?.profileImage && getBlobUrl(file?.profileImage)) ||
                  data?.profileImage?.original
                }
                size={96}
                className="border-2 border-white mt-8"
              />
              <div>
                <IconButton
                  icon="edit"
                  className="bg-white m-0 absolute top-0 right-0 p-[7px] text-black"
                  variant={IconVariant.Secondary}
                  size={Size.Medium}
                  onClick={() => userProfileImageRef?.current?.click()}
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="mx-6 mb-14 space-y-6 overflow-y-auto">
          <div className="w-full flex space-x-6">
            <Layout fields={nameField} className="w-2/4" />
            <Layout fields={preferredNameField} className="w-2/4" />
          </div>
          <Layout fields={positionTitlefields} />
          {/* <Layout fields={departmentField} className="w-2/4" /> */}
          <Layout fields={locationField} />
        </div>
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
          <Button
            variant={ButtonVariant.Secondary}
            size={Size.Small}
            label={'Cancel'}
            className="mr-3"
            onClick={() => {
              setShowModal(false);
              setFile({});
            }}
          />
          <Button
            label={'Save Changes'}
            size={Size.Small}
            onClick={handleSubmit(onSubmit)}
            loading={
              uploadStatus === UploadStatus.Uploading ||
              updateUsersMutation.isLoading
            }
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
