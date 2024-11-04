import { FC, RefObject, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import IconButton, {
  Size as IconSize,
  Variant as IconVariant,
} from 'components/IconButton';
import DefaultCoverImage from 'images/png/CoverImage.png';
import Button, {
  Size as ButtonSize,
  Variant as ButtonVariant,
} from 'components/Button';
import Avatar from 'components/Avatar';
import { Variant as InputVariant } from 'components/Input';
import { getProfileImage, twConfig } from 'utils/misc';
import { IUpdateProfileImage } from 'pages/UserDetail';
import { useMutation } from '@tanstack/react-query';
import useAuth from 'hooks/useAuth';
import queryClient from 'utils/queryClient';
import Header from 'components/ModalHeader';
import PopupMenu from 'components/PopupMenu';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useRole from 'hooks/useRole';
import { useDebounce } from 'hooks/useDebounce';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

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
  const { t } = useTranslation('profile', { keyPrefix: 'EditProfileModal' });
  const { isAdmin } = useRole();
  const { getApi } = usePermissions();
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
  const useGooglePlaces = getApi(ApiEnum.GetGooglePlaces);
  const { data: fetchedLocations, isLoading: isLocationsLoading } =
    useGooglePlaces({
      q: debouncedLocationSearchValue,
    });

  const fieldDisabledMap = {
    fullName: !isAdmin && userDetails.freezeEdit?.fullName,
    designation: !isAdmin && userDetails.freezeEdit?.designation,
    department: !isAdmin && userDetails.freezeEdit?.department,
  };

  const nameField = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      error: errors.fullName?.message,
      name: 'fullName',
      label: t('nameLabel'),
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
      name: 'preferredName',
      label: t('preferredNameLabel'),
      dataTestId: `${dataTestId}-perferred-name`,
      control,
      inputClassName: 'h-[40px] !text-sm',
    },
  ];

  const useInfiniteDesignations = getApi(ApiEnum.GetDesignations);
  const positionTitlefields = [
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      name: 'designation',
      defaultValue: getValues().designation,
      placeholder: t('positionTitlePlaceholder'),
      dataTestId: `${dataTestId}-title`,
      label: t('positionTitleLabel'),
      disabled: fieldDisabledMap.designation,
      control,
      fetchQuery: (q: any) =>
        useInfiniteDesignations({ q, startFetching: true }),
      getFormattedData: (data: any) =>
        formatCreatableOptions(data, 'designation-option'),
      queryParams: {},
      disableCreate: !isAdmin,
      getPopupContainer: document.body,
      noOptionsMessage: t('noDesignationsFound'),
      height: 40,
    },
  ];

  const useInfiniteDepartments = getApi(ApiEnum.GetDepartments);
  const departmentField = [
    {
      type: FieldType.CreatableSearch,
      name: 'department',
      defaultValue: getValues().department,
      placeholder: t('departmentPlaceholder'),
      label: t('departmentLabel'),
      dataTestId: `${dataTestId}-department`,
      fetchQuery: useInfiniteDepartments,
      getFormattedData: (data: any) =>
        formatCreatableOptions(data, 'dept-option'),
      queryParams: {},
      disabled: fieldDisabledMap.department,
      disableCreate: !isAdmin,
      getPopupContainer: document.body,
      noOptionsMessage: t('noDepartmentsFound'),
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
      placeholder: t('locationPlaceholder'),
      label: t('locationLabel'),
      options:
        fetchedLocations?.map((location: any) => ({
          value: location.name.description,
          label: location.name.description,
          dataTestId: `${dataTestId}-location-${location.name.description}`,
        })) || [],
      onSearch: (searchString: string) => setLocationSearchString(searchString),
      noOptionsMessage: t('noLocationsFound'),
      height: 40,
      isLoading: isLocationsLoading,
      getPopupContainer: document.body,
      menuPlacement: 'topLeft',
    },
  ];

  const coverImageOption = [
    {
      icon: 'exportOutline',
      label: t('uploadPhoto'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        userCoverImageRef?.current?.click();
      },
      dataTestId: 'edit-coverpic-upload',
      hidden: false,
    },
    {
      icon: 'maximizeOutline',
      label: t('reposition'),
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        reset();
        openEditImageModal();
        closeEditProfileModal();
      },
      dataTestId: 'edit-coverpic-reposition',
      hidden: userDetails?.coverImage?.original == null,
    },
    {
      icon: 'trashOutline',
      label: t('deletePhoto'),
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
      hidden: userDetails?.coverImage?.original == null,
    },
  ].filter((option) => option.hidden !== true);

  const { updateUser } = useAuth();

  useEffect(
    () => () => {
      setIsCoverImageRemoved(false);
    },
    [],
  );

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateUserById = getApi(ApiEnum.UpdateUser);
  const updateUsersMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : (data: Record<string, any>) => updateCurrentUser(data),
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
            name: userUpdateResponse.org?.name,
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

      successToastConfig({ content: 'User Profile Updated Successfully' });
      reset();
      closeEditProfileModal();
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      await queryClient.invalidateQueries({ queryKey: ['locations'] });
      await queryClient.invalidateQueries(['users']); // invalidate the all user queries

      if (userId) {
        await queryClient.invalidateQueries(['user', userId]); // single user by id
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
        <Header title={t('editProfile')} onClose={disableClosed} />
        <div className="relative">
          <div className="w-full h-[108px] overflow-hidden">
            {userDetails?.coverImage?.original && !isCoverImageRemoved ? (
              <img
                className="object-cover w-full"
                src={userDetails?.coverImage?.original}
                alt="Cover Image"
              />
            ) : (
              <img
                className="object-cover h-full w-full"
                src={DefaultCoverImage}
                alt="Cover Image"
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
                  size={IconSize.Medium}
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
                  size={IconSize.Medium}
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
            size={ButtonSize.Small}
            label={t('cancel')}
            className="mr-3"
            onClick={() => {
              reset();
              closeEditProfileModal();
            }}
            dataTestId={`${dataTestId}-cancel`}
          />
          <Button
            label={t('saveChanges')}
            size={ButtonSize.Small}
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
