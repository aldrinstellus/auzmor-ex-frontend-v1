import Card from 'components/Card';
import React, { useRef, useState } from 'react';
import Avatar from 'components/Avatar';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import Button, {
  Size as ButtonSize,
  Variant as ButtonVariant,
} from 'components/Button';
import Icon from 'components/Icon';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import EditProfileModal from '../EditProfileModal';
import { IUpdateProfileImage } from 'pages/UserDetail';
import useModal from 'hooks/useModal';
import EditImageModal from 'components/EditImageModal';
import {
  clearInputValue,
  getBlobUrl,
  getCoverImage,
  getEditSection,
  getFullName,
  getProfileImage,
  twConfig,
} from 'utils/misc';
import { EntityType } from 'queries/files';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserStatus,
  updateCurrentUser,
  updateRoleToAdmin,
  updateStatus,
  useResendInvitation,
} from 'queries/users';
import UserProfileDropdown from 'components/UserProfileDropdown';
import useHover from 'hooks/useHover';
import useRole from 'hooks/useRole';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import DeletePeople from 'pages/Users/components/DeleteModals/People';
import ReactivatePeople from 'pages/Users/components/ReactivateModal/Reactivate';
import DeactivatePeople from 'pages/Users/components/DeactivateModal/Deactivate';
import useAuth from 'hooks/useAuth';

export interface IProfileCoverProps {
  userDetails: Record<string, any>;
  canEdit: boolean;
  setSearchParams?: any;
  searchParams?: URLSearchParams;
}

const ProfileCoverSection: React.FC<IProfileCoverProps> = ({
  userDetails,
  canEdit,
  setSearchParams,
  searchParams,
}) => {
  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const queryClient = useQueryClient();
  const [openEditProfile, openEditProfileModal, closeEditProfileModal] =
    useModal(undefined, false);
  const [openEditImage, openEditImageModal, closeEditImageModal] = useModal(
    undefined,
    false,
  );
  const [isHovered, eventHandlers] = useHover();
  const [isCoverImageRemoved, setIsCoverImageRemoved] = useState(false);

  const userProfileImageRef = useRef<HTMLInputElement>(null);
  const userCoverImageRef = useRef<HTMLInputElement>(null);

  const [profileImageName, setProfileImageName] = useState<string>('');
  const [coverImageName, setCoverImageName] = useState<string>('');

  const showEditProfile = useRef<boolean>(true);

  const getBlobFile = file?.profileImage
    ? getBlobUrl(file?.profileImage)
    : file?.coverImage && getBlobUrl(file?.coverImage);

  const deleteCoverImageMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: (data) => {
      console.log('Successfully deleted user cover image', data);
    },
  });

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
      label: 'Delete photo',
      stroke: twConfig.theme.colors.neutral['900'],
      onClick: () => {
        if (file?.coverImage) {
          if (file?.profileImage) {
            setFile({
              profileImage: file?.profileImage,
            });
          } else {
            setFile({});
          }
        }
        setIsCoverImageRemoved(true);
        deleteCoverImageMutation.mutate({
          coverImage: {
            fileId: '',
          },
        });
      },
      dataTestId: 'edit-coverpic-deletepost',
    },
  ];

  const [openDelete, openDeleteModal, closeDeleteModal] = useModal();
  const [openReactivate, openReactivateModal, closeReactivateModal] =
    useModal();
  const [openDeactivate, openDeactivateModal, closeDeactivateModal] =
    useModal();

  const resendInviteMutation = useResendInvitation();
  const updateUserStatusMutation = useMutation({
    mutationFn: updateStatus,
    mutationKey: ['update-user-status'],
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userDetails?.id]);
      toast(
        <SuccessToast
          content={`User has been ${
            (userDetails?.status as any) === UserStatus.Inactive
              ? 'reactivated'
              : 'deactivated'
          }`}
          dataTestId="deactivate -toaster-msg"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color={twConfig.theme.colors.primary['500']}
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
          theme: 'dark',
        },
      );
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: updateRoleToAdmin,
    mutationKey: ['update-user-role'],
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userDetails?.id]);
      toast(<SuccessToast content={`User role has been updated to admin`} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            color={twConfig.theme.colors.primary['500']}
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
        theme: 'dark',
      });
    },
  });

  return (
    <div {...eventHandlers}>
      <Card className="bg-white pb-6 w-full" data-testid="profile-details">
        <div className="relative">
          <div
            className="w-full overflow-hidden h-[180px]"
            data-testid={coverImageName}
          >
            {userDetails?.coverImage?.original && !isCoverImageRemoved ? (
              <img
                className="object-cover w-full"
                src={getCoverImage(userDetails)}
                alt={'User Cover Picture Profile'}
                data-testid="user-cover-pic"
              />
            ) : (
              <img
                className="object-cover w-full"
                src={getCoverImage(userDetails)}
                alt="Default Image"
                data-testid="user-cover-pic"
              />
            )}
          </div>
          <div className="absolute left-8 bottom-[-6rem]">
            <Avatar
              name={getFullName(userDetails)}
              image={getProfileImage(userDetails)}
              size={150}
              className="mt-8 overflow-hidden"
              bgColor={
                userDetails?.status === UserStatus.Inactive
                  ? '#ffffff'
                  : '#343434'
              }
              dataTestId={profileImageName || 'edit-profile-pic'}
            />
          </div>
          {canEdit && (
            <PopupMenu
              triggerNode={
                <IconButton
                  icon="edit"
                  className="bg-white m-4 absolute top-0 right-0 p-3 text-black"
                  variant={IconVariant.Secondary}
                  size={Size.Medium}
                  dataTestId="edit-cover-pic"
                  onClick={() => (showEditProfile.current = false)}
                />
              }
              className="top-16 right-4"
              menuItems={coverImageOption}
            />
          )}
        </div>
        <div className="flex ml-[12rem]">
          <div className="flex flex-col w-full">
            <div className="flex items-center">
              <div className="mr-6 mt-2 flex justify-between w-full">
                <div className="flex space-x-4">
                  <div className="text-2xl font-bold" data-testid="user-name">
                    {getFullName(userDetails)}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    className="flex"
                    leftIconClassName="mr-2"
                    label={'Follow'}
                    leftIcon={'addCircle'}
                    size={ButtonSize.Medium}
                    variant={ButtonVariant.Secondary}
                    dataTestId={'follow'}
                    disabled
                  />
                  <UserProfileDropdown
                    triggerNode={
                      <div
                        className="rounded-[24px] font-bold border py-[8px] px-[16px] border-[#e5e5e5]"
                        data-testid="profile-more-cta"
                      >
                        More
                      </div>
                    }
                    id={userDetails.id}
                    role={userDetails.role}
                    status={userDetails.status}
                    isAdmin={isAdmin}
                    isHovered={isHovered}
                    showOnHover={false}
                    className="mt-[3%] border border-[#e5e5e5]"
                    onDeleteClick={openDeleteModal}
                    onReactivateClick={openReactivateModal}
                    onPromoteClick={() =>
                      updateUserRoleMutation.mutate({ id: userDetails?.id })
                    }
                    onDeactivateClick={() => openDeactivateModal}
                    onEditClick={() => {
                      searchParams?.append(
                        'edit',
                        getEditSection(
                          userDetails?.id,
                          user?.id,
                          isAdmin,
                          userDetails?.role,
                        ),
                      );
                      setSearchParams(searchParams);
                    }}
                    onResendInviteClick={() => () => {
                      toast(
                        <SuccessToast content="Invitation has been sent" />,
                        {
                          closeButton: (
                            <Icon
                              name="closeCircleOutline"
                              color={twConfig.theme.colors.primary['500']}
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
                          theme: 'dark',
                        },
                      );
                      resendInviteMutation.mutate(userDetails?.id);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-3 items-center">
              <div
                className="text-xs font-normal text-neutral-900"
                data-testid="user-designation"
              >
                {userDetails?.designation || 'N/A'}
              </div>
              <Divider variant={DividerVariant.Vertical} className="h-8" />
              <div className="flex space-x-3 items-center">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="briefcase" size={16} />
                </IconWrapper>
                <div
                  className="text-xs font-normal text-neutral-900"
                  data-testid="user-department"
                >
                  {userDetails?.department || 'N/A'}
                </div>
              </div>
              <Divider variant={DividerVariant.Vertical} className="h-8" />
              <div className="flex space-x-3 items-center">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="location" size={16} />
                </IconWrapper>
                <div
                  className="text-xs font-normal text-neutral-900"
                  data-testid="user-location"
                >
                  {userDetails?.workLocation || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <EditProfileModal
          userDetails={userDetails}
          openEditProfile={openEditProfile}
          openEditImageModal={openEditImageModal}
          closeEditProfileModal={closeEditProfileModal}
          userProfileImageRef={userProfileImageRef}
          userCoverImageRef={userCoverImageRef}
          key={'edit-profile'}
          dataTestId="edit-profile"
          isCoverImageRemoved={isCoverImageRemoved}
          setIsCoverImageRemoved={setIsCoverImageRemoved}
          setImageFile={setFile}
          imageFile={file}
        />

        {openEditImage && (
          <EditImageModal
            title={getBlobFile ? 'Apply Changes' : 'Reposition'}
            openEditImage={openEditImage}
            closeEditImageModal={closeEditImageModal}
            openEditProfileModal={
              showEditProfile.current ? openEditProfileModal : undefined
            }
            image={getBlobFile || userDetails?.coverImage?.original}
            userCoverImageRef={userCoverImageRef}
            setImageFile={setFile}
            imageFile={file}
            imageName={profileImageName || coverImageName}
            fileEntityType={
              file?.profileImage
                ? EntityType?.UserProfileImage
                : EntityType?.UserCoverImage
            }
            userProfileImageRef={userProfileImageRef}
          />
        )}

        {canEdit && (
          <div>
            <input
              id="file-input"
              type="file"
              ref={userProfileImageRef}
              data-testid="edit-profile-profilepic"
              className="hidden"
              accept="image/*"
              multiple={false}
              onClick={clearInputValue}
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFile({
                    ...file,
                    profileImage: Array.prototype.slice.call(e.target.files)[0],
                  });
                  setProfileImageName(e?.target?.files[0]?.name);
                  openEditImageModal();
                  closeEditProfileModal();
                }
              }}
            />
            <input
              id="file-input"
              type="file"
              ref={userCoverImageRef}
              className="hidden"
              accept="image/*"
              multiple={false}
              data-testid="edit-profile-coverpic"
              onClick={clearInputValue}
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFile({
                    ...file,
                    coverImage: Array.prototype.slice.call(e.target.files)[0],
                  });
                  setCoverImageName(e?.target?.files[0]?.name);
                  openEditImageModal();
                  closeEditProfileModal();
                }
              }}
            />
          </div>
        )}
      </Card>
      <DeletePeople
        open={openDelete}
        openModal={openDeleteModal}
        closeModal={closeDeleteModal}
        userId={userDetails?.id}
      />
      <DeactivatePeople
        open={openDeactivate}
        openModal={openDeactivateModal}
        closeModal={closeDeactivateModal}
        userId={userDetails?.id}
      />
      <ReactivatePeople
        open={openReactivate}
        openModal={openReactivateModal}
        closeModal={closeReactivateModal}
        userId={userDetails?.id}
      />
    </div>
  );
};

export default ProfileCoverSection;
