import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import DefaultCoverImage from 'images/png/CoverImage.png';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Avatar from 'components/Avatar';
import { Variant as InputVariant } from 'components/Input';
import { twConfig } from 'utils/misc';
import { IUpdateProfileImage } from 'pages/UserDetail';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import useAuth from 'hooks/useAuth';
import queryClient from 'utils/queryClient';
import Header from 'components/ModalHeader';
import PopupMenu from 'components/PopupMenu';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import Icon from 'components/Icon';

interface IOptions {
  value: string;
  label: string;
}

export interface IUpdateProfileForm {
  fullName: string;
  designation: IOptions;
  department: IOptions;
  preferredName: string;
  workLocation: IOptions;
}

interface IEditProfileModal {
  userDetails: Record<string, any>;
  openEditProfile: boolean;
  closeEditProfileModal: () => void;
  openEditImageModal: () => void;
  imageFile: IUpdateProfileImage | Record<string, any>;
  setImageFile?: (file: IUpdateProfileImage | Record<string, any>) => void;
  userProfileImageRef: React.RefObject<HTMLInputElement> | null;
  userCoverImageRef: React.RefObject<HTMLInputElement> | null;
  dataTestId?: string;
  isCoverImageRemoved?: boolean;
  setIsCoverImageRemoved?: (flag: boolean) => void;
}

const EditProfileModal: React.FC<IEditProfileModal> = ({
  userDetails,
  openEditProfile,
  closeEditProfileModal,
  openEditImageModal,
  imageFile,
  setImageFile,
  userProfileImageRef,
  userCoverImageRef,
  dataTestId,
  isCoverImageRemoved = false,
  setIsCoverImageRemoved = () => {},
}) => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<IUpdateProfileForm>({
    mode: 'onSubmit',
    defaultValues: {
      fullName: userDetails?.fullName,
      preferredName: userDetails?.preferredName,
      designation: {
        value: userDetails?.designation,
        label: userDetails?.designation,
      },
      workLocation: {
        value: userDetails?.workLocation,
        label: userDetails?.workLocation,
      },
      department: {
        value: userDetails?.department,
        label: userDetails?.department,
      },
    },
  });

  const nameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      defaultValue: getValues().fullName,
      name: 'fullName',
      label: 'Name*',
      dataTestId: `${dataTestId}-name`,
      control,
    },
  ];

  const preferredNameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      defaultValue: getValues().preferredName,
      name: 'preferredName',
      label: 'Preferred Name',
      dataTestId: `${dataTestId}-perferred-name`,
      control,
    },
  ];

  const positionTitlefields = [
    {
      type: FieldType.SingleSelect,
      name: 'designation',
      defaultValue: getValues().designation,
      dataTestId: `${dataTestId}`,
      label: 'Position title',
      disabled: true,
      options: [
        { value: 'Software Engineer', label: 'Software Engineer' },
        { value: 'Research Analyst', label: 'Research Analyst' },
      ],
      control,
      menuPlacement: 'top',
    },
  ];

  // const departmentField = [
  //   {
  //     type: FieldType.SingleSelect,
  //     name: 'department',
  //     // defaultValue: data?.department,
  //     // placeholder: 'ex. Engineering',
  //     label: 'Department',
  //     dataTestId: `${dataTestId}`,
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
      disabled: true,
      defaultValue: getValues().workLocation?.label,
      dataTestId: `${dataTestId}`,
      label: 'Location',
      options: [
        { value: 'Mumbai, India', label: 'Mumbai, India' },
        { value: 'Hydrabad, Talangana', label: 'Hydrabad, Talangana' },
      ],
      control,
      menuPlacement: 'top',
    },
  ];

  const coverImageOption = [
    {
      icon: 'exportOutline',
      label: 'Upload a photo',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        userCoverImageRef?.current?.click();
      },
      dataTestId: 'edit-coverpic-upload',
    },
    {
      icon: 'maximizeOutline',
      label: 'Reposition',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        openEditImageModal();
        closeEditProfileModal();
      },
      dataTestId: 'edit-coverpic-reposition',
    },
    {
      icon: 'trashOutline',
      label: 'Delete post',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        if (imageFile?.coverImage) {
          if (imageFile?.profileImage) {
            setImageFile &&
              setImageFile({
                profileImage: imageFile?.profileImage,
              });
          } else {
            setImageFile && setImageFile({});
          }
        }
        setIsCoverImageRemoved(true);
      },
      dataTestId: 'edit-coverpic-deletepost',
    },
  ];
  const { updateUser } = useAuth();

  useEffect(
    () => () => {
      setIsCoverImageRemoved(false);
    },
    [],
  );

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
        workLocation: userUpdateResponse.workLocation,
        preferredName: userUpdateResponse.preferredName,
        designation: userUpdateResponse.designation,
        // department: userUpdateResponse.department,
        location: userUpdateResponse.location,
        profileImage: userUpdateResponse.profileImage?.original,
        coverImage: userUpdateResponse.profileImage?.original,
      });
      toast(<SuccessToast content={'User Profile Updated Successfully'} />, {
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
      closeEditProfileModal();
      await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
    },
  });

  const onSubmit = async (user: IUpdateProfileForm) => {
    updateUsersMutation.mutate({
      fullName: user.fullName,
      designation: user?.designation?.value,
      preferredName: user?.preferredName,
      // department: user?.department?.value,
      workLocation: user?.workLocation?.value,
    });
  };

  const disableClosed = () => {
    if (updateUsersMutation.isLoading) {
      return null;
    } else {
      return closeEditProfileModal();
    }
  };

  return (
    <Modal open={openEditProfile}>
      <form>
        <Header title="Edit Profile" onClose={disableClosed} />
        <div className="relative">
          <div className="w-full h-[108px] overflow-hidden">
            {userDetails?.coverImage?.original && !isCoverImageRemoved ? (
              <img
                className="object-cover w-full"
                src={userDetails?.coverImage?.original}
              />
            ) : (
              <img
                className="object-cover h-full w-full"
                src={DefaultCoverImage}
              />
            )}
          </div>
          <PopupMenu
            triggerNode={
              <div className="cursor-pointer absolute top-4 right-4">
                <IconButton
                  icon="edit"
                  className="bg-white p-2.5 text-black"
                  variant={IconVariant.Secondary}
                  size={Size.Medium}
                  dataTestId="edit-coverpic-btn"
                />
              </div>
            }
            className="top-16 right-4"
            menuItems={coverImageOption}
          />
        </div>
        <div className="ml-8 mb-8 flex items-center">
          <div className="-mt-20">
            <div className="relative">
              <Avatar
                name={userDetails?.fullName}
                image={userDetails?.profileImage?.original}
                size={96}
                className="border-2 border-white overflow-hidden"
              />
              <div>
                <IconButton
                  icon="edit"
                  className="bg-white m-0 absolute top-0 right-0 p-[7px] text-black"
                  variant={IconVariant.Secondary}
                  size={Size.Medium}
                  onClick={() => {
                    userProfileImageRef?.current?.click();
                  }}
                  dataTestId={`${dataTestId}-profilepic-btn`}
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="mx-4 px-2 mb-10 pb-4 space-y-6 overflow-y-auto">
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
              closeEditProfileModal();
            }}
            dataTestId={`${dataTestId}-savechanges`}
          />
          <Button
            label={'Save Changes'}
            size={Size.Small}
            onClick={handleSubmit(onSubmit)}
            loading={updateUsersMutation.isLoading}
            dataTestId={`${dataTestId}-cancel`}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
