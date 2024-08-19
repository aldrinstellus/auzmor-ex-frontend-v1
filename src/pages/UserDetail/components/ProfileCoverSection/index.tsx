import Card from 'components/Card';
import { FC, useRef, useState } from 'react';
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
  getFullName,
  getProfileImage,
  twConfig,
} from 'utils/misc';
import { EntityType } from 'queries/files';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EditUserSection,
  UserStatus,
  updateCurrentUser,
  updateRoleToAdmin,
  updateUserById,
  useResendInvitation,
} from 'queries/users';
import UserProfileDropdown from 'components/UserProfileDropdown';
import useHover from 'hooks/useHover';
import useRole from 'hooks/useRole';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import DeletePeople from 'pages/Users/components/DeleteModals/People';
import ReactivatePeople from 'pages/Users/components/ReactivateModal/Reactivate';
import DeactivatePeople from 'pages/Users/components/DeactivateModal/Deactivate';
import { useParams } from 'react-router-dom';
import SocialLinksModal from 'components/ProfileInfo/components/SocialLinksModal';
import useAuth from 'hooks/useAuth';
import clsx from 'clsx';
import SocialIcon from './SocialIcon';
import { isOutOfOffice } from 'utils/time';
import Chip from 'components/Chip';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useTranslation } from 'react-i18next';

export interface IProfileCoverProps {
  userDetails: Record<string, any>;
  editSection?: string;
}

const ProfileCoverSection: FC<IProfileCoverProps> = ({
  userDetails,
  editSection,
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'profileCoverSection' });
  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );
  const { userId = '' } = useParams();
  const { user } = useAuth();
  const { isOwnerOrAdmin } = useRole({ userId: userId || user?.id });
  const canEdit = isOwnerOrAdmin;
  const queryClient = useQueryClient();
  const [openEditProfile, openEditProfileModal, closeEditProfileModal] =
    useModal(editSection === EditUserSection.PROFILE, false);
  const [openEditImage, openEditImageModal, closeEditImageModal] = useModal(
    undefined,
    false,
  );
  const [socialLink, showSocialLinks, closeSocialLinks] = useModal();
  const isSelf = !userId;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-users-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries(['user', userId]); // single user by id
      } else {
        queryClient.invalidateQueries({ queryKey: ['current-user-me'] });
      }
    },
  });

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
      hidden: userDetails?.coverImage?.original == null,
    },
  ].filter((option) => option.hidden !== true);

  const [openDelete, openDeleteModal, closeDeleteModal] = useModal();
  const [openReactivate, openReactivateModal, closeReactivateModal] =
    useModal();
  const [openDeactivate, openDeactivateModal, closeDeactivateModal] =
    useModal();

  const resendInviteMutation = useResendInvitation();

  const updateUserRoleMutation = useMutation({
    mutationFn: updateRoleToAdmin,
    mutationKey: ['update-user-role'],
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userDetails?.id]);
      successToastConfig({ content: t('toastMessages.updateRoleSuccess') });
    },
  });

  const commonSocialLinks = [
    'linkedIn',
    'twitter',
    'instagram',
    'facebook',
    'website',
  ];
  const socialLinks = isSelf
    ? [...commonSocialLinks, 'edit']
    : commonSocialLinks;
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string,
  ) => {
    const files = e.target.files;

    if (files?.length) {
      const selectedFile = files[0];
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
      ];

      if (!validImageTypes.includes(selectedFile.type)) {
        failureToastConfig({
          content: t('toastMessages.fileNotSupported'),
        });
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        failureToastConfig({
          content: t('toastMessages.fileMaxSizeError'),
        });
        return;
      }
      if (fileType === 'profileImage') {
        setFile({
          ...file,
          profileImage: selectedFile,
        });
        setProfileImageName(selectedFile.name);
      } else {
        setFile({
          ...file,
          coverImage: selectedFile,
        });
        setCoverImageName(selectedFile.name);
      }
      openEditImageModal();
    }
  };
  return (
    <div>
      <Card
        className="relative bg-white w-full   "
        data-testid="profile-details"
      >
        <div className=" w-full relative">
          {canEdit && (
            <PopupMenu
              triggerNode={
                <div className="bg-white absolute rounded-full top-4 right-4 text-black">
                  <IconButton
                    icon="edit"
                    variant={IconVariant.Secondary}
                    size={Size.Medium}
                    dataTestId="edit-cover-pic"
                    onClick={() => (showEditProfile.current = false)}
                  />
                </div>
              }
              className="absolute top-12 right-4"
              menuItems={coverImageOption}
            />
          )}
          {
            <img
              className="object-cover  object-center w-full rounded-t-9xl "
              src={getCoverImage(userDetails)}
              alt={'User Cover Picture Profile'}
              data-testid="user-cover-pic"
            />
          }
        </div>

        <div className="absolute left-8 bottom-6">
          <Avatar
            name={getFullName(userDetails)}
            image={getProfileImage(userDetails, 'medium')}
            size={144}
            bgColor={
              userDetails?.status === UserStatus.Inactive
                ? '#ffffff'
                : '#343434'
            }
            dataTestId={profileImageName || 'edit-profile-pic'}
          />
          {isOwnerOrAdmin ? (
            <div className="absolute bg-white rounded-full p-[5px] cursor-pointer top-1 right-1">
              <Icon
                name="edit"
                size={15}
                color="text-black"
                onClick={() => userProfileImageRef?.current?.click()}
                dataTestId="edit-profilepic"
              />
            </div>
          ) : (
            isOutOfOffice(
              userDetails?.outOfOffice?.start,
              userDetails?.outOfOffice?.end,
            ) && (
              <div className="absolute  rounded-full p-[5px]  top-1 right-1">
                <Icon name="outOfOffice" dataTestId="edit-profilepic" />
              </div>
            )
          )}
        </div>
        <div className="ml-[192px] mr-6 mt-2.5  min-h-[92px]">
          <div className="flex ">
            <div
              className="text-2xl font-bold text-neutral-900"
              data-testid="user-name"
            >
              {getFullName(userDetails)}
            </div>
            {isOutOfOffice(
              userDetails?.outOfOffice?.start,
              userDetails?.outOfOffice?.end,
            ) && (
              <div className="ml-4 ">
                <Chip
                  label={'out of office'}
                  icon="outOfOffice"
                  className="bg-red-100 flex space-x-1 px-3 py-1 items-center leading-4 font-medium border-red-200 text-neutral-900"
                />
              </div>
            )}

            <div className="flex  ml-auto space-x-2 mt-[-2px]">
              {!!userId && (
                <Button
                  className="flex"
                  label={'Follow'}
                  labelClassName={'text-sm'}
                  leftIcon={'addCircle'}
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Secondary}
                  dataTestId={'follow'}
                  disabled
                />
              )}
              <UserProfileDropdown
                showDirectOption
                triggerNode={
                  <div
                    className="rounded-[24px] font-bold border py-[7.5px] px-[16px] text-sm border-[#e5e5e5] cursor-pointer"
                    data-testid="profile-more-cta"
                  >
                    {t('more')}
                  </div>
                }
                id={userDetails.id}
                role={userDetails.role}
                status={userDetails.status}
                isHovered={isHovered}
                showOnHover={false}
                className="mt-[3.5%] right-8 border border-[#e5e5e5]"
                onDeleteClick={openDeleteModal}
                onReactivateClick={openReactivateModal}
                onPromoteClick={() =>
                  updateUserRoleMutation.mutate({ id: userDetails?.id })
                }
                onDeactivateClick={openDeactivateModal}
                onEditClick={() => {
                  openEditProfileModal();
                }}
                onResendInviteClick={() => () => {
                  successToastConfig({
                    content: t('toastMessages.inviteSuccess'),
                  });
                  resendInviteMutation.mutate(userDetails?.id);
                }}
              />
            </div>
          </div>
          <div className=" absolute right-10 flex space-x-3 items-center mt-[8px]">
            <div
              className={clsx(
                { 'flex space-x-2 items-center': true },
                { 'cursor-pointer': isOwnerOrAdmin },
              )}
              onClick={() => {
                if (isOwnerOrAdmin) {
                  openEditProfileModal();
                }
              }}
            >
              <IconWrapper
                type={Type.Square}
                className="cursor-pointer rounded-6xl"
                dataTestId="edit-user-role"
              >
                <Icon name="userRole" size={15} color="text-primary-500" />
              </IconWrapper>
              <div
                className="text-sm font-normal text-neutral-400"
                data-testid="user-designation"
              >
                {userDetails?.designation?.name || t('addDesignation')}
              </div>
            </div>
            <Divider variant={DividerVariant.Vertical} className="!h-6" />
            <div
              className={clsx(
                { 'flex space-x-2 items-center': true },
                { 'cursor-pointer': isOwnerOrAdmin },
              )}
              onClick={() => {
                if (isOwnerOrAdmin) {
                  openEditProfileModal();
                }
              }}
            >
              <IconWrapper
                type={Type.Square}
                className="cursor-pointer rounded-6xl"
                dataTestId="edit-user-department"
              >
                <Icon name="briefcase" size={15} color="text-primary-500" />
              </IconWrapper>
              <div
                className="text-sm font-normal text-neutral-400"
                data-testid="user-department"
              >
                {userDetails?.department?.name || t('addDepartment')}
              </div>
            </div>
            <Divider variant={DividerVariant.Vertical} className="!h-6" />
            <div
              className={clsx(
                { 'flex space-x-2 items-center': true },
                { 'cursor-pointer': isOwnerOrAdmin },
              )}
              onClick={() => {
                if (isOwnerOrAdmin) {
                  openEditProfileModal();
                }
              }}
            >
              <IconWrapper
                type={Type.Square}
                className="cursor-pointer rounded-6xl"
                dataTestId="edit-user-location"
              >
                <Icon name="location" size={15} color="text-primary-500" />
              </IconWrapper>
              <div
                className="text-sm font-normal text-neutral-400"
                data-testid="user-location"
              >
                {userDetails?.workLocation?.name || t('addLocation')}
              </div>
            </div>
          </div>
          <div
            className="mt-[10px] w-fit flex items-center space-x-2 cursor-pointer"
            onClick={(e) => {
              if (!userId || userId === user?.id) {
                e.preventDefault();
              }
            }}
          >
            {socialLinks.map((s) => (
              <SocialIcon
                key={s}
                openModal={showSocialLinks}
                userDetails={userDetails}
                socialLink={s}
              />
            ))}
          </div>
        </div>
      </Card>
      {openEditProfile && (
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
      )}

      {openEditImage && (
        <EditImageModal
          userId={userId}
          title={getBlobFile ? t('applyChanges') : t('reposition')}
          openEditImage={openEditImage}
          closeEditImageModal={closeEditImageModal}
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
            id="file-input-user-profile"
            type="file"
            ref={userProfileImageRef}
            data-testid="edit-profile-profilepic"
            className="hidden"
            accept="image/*"
            multiple={false}
            onClick={clearInputValue}
            onChange={(e) => handleFileChange(e, 'profileImage')}
            aria-label="upload profile picture"
          />
          <input
            id="file-input-cover-image"
            type="file"
            ref={userCoverImageRef}
            className="hidden"
            accept="image/*"
            multiple={false}
            data-testid="edit-profile-coverpic"
            onClick={clearInputValue}
            onChange={(e) => handleFileChange(e, 'coverImage')}
            aria-label="upload cover picture"
          />
        </div>
      )}
      {socialLink && (
        <SocialLinksModal
          open={socialLink}
          closeModal={closeSocialLinks}
          socialLinks={userDetails?.personal?.socialAccounts}
        />
      )}
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
