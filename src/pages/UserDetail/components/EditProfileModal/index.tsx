import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import debounce from 'lodash/debounce';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { getGooglePlaces } from 'queries/location';
import { IDepartment, useInfiniteDepartments } from 'queries/department';
import useRole from 'hooks/useRole';

interface IOptions {
  value: string;
  label: string;
}

export interface IUpdateProfileForm {
  fullName: string;
  designation: IOptions;
  department: IOptions | null;
  preferredName: string;
  workLocation: IOptions | null;
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

const EditProfileSchema = yup.object({
  fullName: yup.string().required('This field cannot be empty'),
});

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
  const { isAdmin } = useRole();
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<IUpdateProfileForm>({
    resolver: yupResolver(EditProfileSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: userDetails?.fullName,
      preferredName: userDetails?.preferredName,
      designation: userDetails?.designation,
      workLocation: userDetails?.workLocation?.name
        ? {
            value: userDetails?.workLocation?.name,
            label: userDetails?.workLocation?.name,
          }
        : null,
      department: userDetails?.department?.name
        ? {
            value: userDetails?.department?.name,
            label: userDetails?.department?.name,
          }
        : null,
    },
  });

  const loadLocations = async (
    inputValue: string,
    callback: (options: any[]) => void,
  ) => {
    const data = await getGooglePlaces({
      q: inputValue || userDetails?.workLocation?.name || 'a',
    });
    callback(
      data.map((place: any) => ({ label: place.name, value: place.name })),
    );
  };

  const formatDepartments = (data: any) => {
    const departmentsData = data?.pages.flatMap((page: any) => {
      return page?.data?.result?.data.map((department: any) => {
        try {
          return { ...department, label: department.name };
        } catch (e) {
          console.log('Error', { department });
        }
      });
    });
    const transformedOption = departmentsData?.map(
      (department: IDepartment) => ({
        value: department?.id,
        label: department?.name,
        id: department?.id,
        dataTestId: `dept-option-${department?.name}`,
      }),
    );
    return transformedOption;
  };

  // Declare a debounced version of loadLocations
  const debouncedLoadLocations = debounce(loadLocations, 500);

  const nameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      defaultValue: getValues().fullName,
      error: errors.fullName?.message,
      name: 'fullName',
      label: 'Name*',
      dataTestId: `${dataTestId}-name`,
      control,
      inputClassName: 'py-[9px]',
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
      inputClassName: 'py-[9px]',
    },
  ];

  const positionTitlefields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      name: 'designation',
      defaultValue: getValues().designation,
      placeholder: 'ex. software engineer',
      dataTestId: `${dataTestId}-title`,
      label: 'Position title',
      control,
      inputClassName: 'py-[9px]',
    },
  ];

  const departmentField = [
    {
      type: FieldType.CreatableSearch,
      name: 'department',
      defaultValue: getValues().department,
      placeholder: 'ex. engineering',
      label: 'Department',
      dataTestId: `${dataTestId}-department`,
      fetchQuery: useInfiniteDepartments,
      getFormattedData: formatDepartments,
      queryParams: {},
      disableCreate: !isAdmin,
      noOptionsMessage: () => 'No Departments found',
      control,
    },
  ];
  const locationField = [
    {
      type: FieldType.AsyncSingleSelect,
      name: 'workLocation',
      defaultValue: getValues().workLocation,
      dataTestId: `${dataTestId}-location`,
      placeholder: 'Select a location',
      label: 'Location',
      loadOptions: (inputValue: string, callback: (options: any[]) => void) => {
        debouncedLoadLocations(inputValue, callback);
      },
      noOptionsMessage: () => 'No locations',
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
        reset();
        openEditImageModal();
        closeEditProfileModal();
      },
      dataTestId: 'edit-coverpic-reposition',
    },
    {
      icon: 'trashOutline',
      label: 'Delete photo',
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
        department: userUpdateResponse.department,
        location: userUpdateResponse.location,
        profileImage: userUpdateResponse.profileImage?.original,
        coverImage: userUpdateResponse.profileImage?.original,
      });
      toast(<SuccessToast content={'User Profile Updated Successfully'} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
      reset();
      closeEditProfileModal();
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
    },
  });

  const onSubmit = async (user: IUpdateProfileForm) => {
    updateUsersMutation.mutate({
      fullName: user.fullName,
      designation: user?.designation,
      preferredName: user?.preferredName,
      department: user?.department?.label,
      workLocation: user?.workLocation?.label,
      ...(isCoverImageRemoved && {
        coverImage: {
          fileId: '',
        },
      }),
    });
  };

  const disableClosed = () => {
    if (updateUsersMutation.isLoading) {
      return null;
    } else {
      reset();
      return closeEditProfileModal();
    }
  };

  return (
    <Modal open={openEditProfile} className="max-w-[648px] max-h-[605px]">
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
        <div className="ml-8 flex items-center">
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
        <div className="max-h-[300px] mr-1 pt-8 mb-10 overflow-y-auto">
          <div className="ml-4 mr-3 px-2 pb-4 space-y-6">
            <div className="w-full flex space-x-6">
              <Layout fields={nameField} className="w-2/4" />
              <Layout fields={preferredNameField} className="w-2/4" />
            </div>
            <div className="flex items-center gap-6">
              <Layout fields={positionTitlefields} className="w-2/4" />
              <Layout fields={departmentField} className="w-2/4" />
            </div>
            <Layout fields={locationField} />
          </div>
        </div>
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            variant={ButtonVariant.Secondary}
            size={Size.Small}
            label={'Cancel'}
            className="mr-3"
            onClick={() => {
              reset();
              closeEditProfileModal();
            }}
            dataTestId={`${dataTestId}-cancel`}
          />
          <Button
            label={'Save Changes'}
            size={Size.Small}
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
            loading={updateUsersMutation.isLoading}
            dataTestId={`${dataTestId}-savechanges `}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
