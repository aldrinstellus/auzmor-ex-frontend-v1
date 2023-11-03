import { FC, RefObject, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { getProfileImage, twConfig } from 'utils/misc';
import { IUpdateProfileImage } from 'pages/UserDetail';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser, updateUserById } from 'queries/users';
import useAuth from 'hooks/useAuth';
import queryClient from 'utils/queryClient';
import Header from 'components/ModalHeader';
import PopupMenu from 'components/PopupMenu';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import Icon from 'components/Icon';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { useGooglePlaces } from 'queries/location';
import { useInfiniteDepartments } from 'queries/department';
import useRole from 'hooks/useRole';
import { useInfiniteDesignations } from 'queries/designation';
import { useDebounce } from 'hooks/useDebounce';
import { useParams } from 'react-router-dom';

interface IOptions {
  value: string;
  label: string;
}

export interface IUpdateProfileForm {
  fullName: string;
  designation: IOptions | null;
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
  userProfileImageRef: RefObject<HTMLInputElement> | null;
  userCoverImageRef: RefObject<HTMLInputElement> | null;
  dataTestId?: string;
  isCoverImageRemoved?: boolean;
  setIsCoverImageRemoved?: (flag: boolean) => void;
}

const EditProfileSchema = yup.object({
  fullName: yup.string().required('This field cannot be empty'),
});

const EditProfileModal: FC<IEditProfileModal> = ({
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
  const { userId = '' } = useParams();
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
      designation: userDetails?.designation?.name
        ? {
            value: userDetails?.designation?.name,
            label: userDetails?.designation?.name,
          }
        : null,
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

  const formatCreatableOptions = (data: any, dataTestId: string) => {
    const optionsData = data?.pages.flatMap((page: any) => {
      return page?.data?.result?.data.map((option: any) => {
        try {
          return { ...option, label: option.name };
        } catch (e) {
          console.log('Error', { option });
        }
      });
    });
    const transformedOption = optionsData?.map((option: any) => ({
      value: option?.name,
      label: option?.name,
      id: option?.id,
      dataTestId: `${dataTestId}-${option?.name}`,
    }));
    return transformedOption;
  };

  const [locationSearchString, setLocationSearchString] = useState<string>('');

  // fetch members on search
  const debouncedLocationSearchValue = useDebounce(
    locationSearchString || 'a',
    300,
  );
  const { data: fetchedLocations, isLoading: isLocationsLoading } =
    useGooglePlaces({
      q: debouncedLocationSearchValue,
    });

  const fieldDisabledMap = {
    fullName: userDetails.freezeEdit?.fullName,
    designation: !isAdmin && userDetails.freezeEdit?.designation,
    department: !isAdmin && userDetails.freezeEdit?.department,
  };

  const nameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      defaultValue: getValues().fullName,
      error: errors.fullName?.message,
      name: 'fullName',
      label: 'Name',
      required: true,
      dataTestId: `${dataTestId}-name`,
      disabled: fieldDisabledMap.fullName,
      control,
      inputClassName: 'h-[40px] !text-sm',
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
      inputClassName: 'h-[40px] !text-sm',
    },
  ];

  const positionTitlefields = [
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      name: 'designation',
      defaultValue: getValues().designation,
      placeholder: 'ex. software engineer',
      dataTestId: `${dataTestId}-title`,
      label: 'Position title',
      disabled: fieldDisabledMap.designation,
      control,
      fetchQuery: (q: any) =>
        useInfiniteDesignations({ q, startFetching: true }),
      getFormattedData: (data: any) =>
        formatCreatableOptions(data, 'designation-option'),
      queryParams: {},
      disableCreate: !isAdmin,
      getPopupContainer: document.body,
      noOptionsMessage: 'No Designations found',
      height: 40,
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
      getFormattedData: (data: any) =>
        formatCreatableOptions(data, 'dept-option'),
      queryParams: {},
      disabled: fieldDisabledMap.department,
      disableCreate: !isAdmin,
      getPopupContainer: document.body,
      noOptionsMessage: 'No Departments found',
      height: 40,
      control,
    },
  ];

  const locationField = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'workLocation',
      defaultValue: getValues().workLocation,
      dataTestId: `${dataTestId}-location`,
      placeholder: 'Select a location',
      label: 'Location',
      options:
        fetchedLocations?.map((location: any) => ({
          value: location.name.description,
          label: location.name.description,
          dataTestId: `${dataTestId}-location-${location.name.description}`,
        })) || [],
      onSearch: (searchString: string) => setLocationSearchString(searchString),
      noOptionsMessage: 'No locations',
      height: 40,
      isLoading: isLocationsLoading,
      getPopupContainer: document.body,
      menuPlacement: 'topLeft',
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
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: async (response: Record<string, any>) => {
      const userUpdateResponse = response?.result?.data;
      if (!userId) {
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
      }

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
      if (userId) {
        await queryClient.invalidateQueries(['user', userId]);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
      }
    },
  });

  const onSubmit = async (user: IUpdateProfileForm) => {
    const payload: Record<string, any> = {
      preferredName: user?.preferredName,
      workLocation: user?.workLocation?.label,
      ...(isCoverImageRemoved && {
        coverImage: {
          fileId: '',
        },
      }),
    };

    if (!fieldDisabledMap.fullName) {
      payload['fullName'] = user.fullName;
    }

    if (!fieldDisabledMap.designation) {
      payload['designation'] = user?.designation?.label;
    }

    if (!fieldDisabledMap.department) {
      payload['department'] = user?.department?.label;
    }

    updateUsersMutation.mutate(payload);
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
    <Modal open={openEditProfile} className="max-w-[638px] max-h-[605px]">
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
                image={getProfileImage(userDetails)}
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
        <div className="max-h-[300px] mr-1 my-[23px] overflow-y-auto">
          <div className="ml-4 mr-3 px-2 pb-4 space-y-4">
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
