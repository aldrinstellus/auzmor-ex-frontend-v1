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
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import DeletePeople from 'pages/Users/components/DeleteModals/People';
import ReactivatePeople from 'pages/Users/components/ReactivateModal/Reactivate';
import DeactivatePeople from 'pages/Users/components/DeactivateModal/Deactivate';
import { useParams } from 'react-router-dom';
import SocialLinksModal from 'components/ProfileInfo/components/SocialLinksModal';
import useAuth from 'hooks/useAuth';
import clsx from 'clsx';
import SocialIcon from './SocialIcon';

export interface IProfileCoverProps {
  userDetails: Record<string, any>;
  editSection?: string;
}

const ProfileCoverSection: FC<IProfileCoverProps> = ({
  userDetails,
  editSection,
}) => {
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

  const updateUserRoleMutation = useMutation({
    mutationFn: updateRoleToAdmin,
    mutationKey: ['update-user-role'],
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userDetails?.id]);
      toast(<SuccessToast content={`User role has been updated to admin`} />, {
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
    },
  });

  return (
    <div>
      <Card
        className="relative bg-white w-full h-[284px]"
        data-testid="profile-details"
      >
        <div className="h-[160px] w-full relative">
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
          {!isCoverImageRemoved && (
            <img
              className="object-cover object-center w-full rounded-t-9xl h-[160px]"
              src={getCoverImage(userDetails)}
              alt={'User Cover Picture Profile'}
              data-testid="user-cover-pic"
            />
          )}
        </div>

        <div className="absolute left-8 bottom-3">
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
          {isOwnerOrAdmin && (
            <div className="absolute bg-white rounded-full p-[5px] cursor-pointer top-1 right-1">
              <Icon
                name="edit"
                size={15}
                color="text-black"
                onClick={() => userProfileImageRef?.current?.click()}
                dataTestId="edit-profilepic"
              />
            </div>
          )}
        </div>
        <div className="ml-[192px] mr-6 mt-2.5">
          <div className="flex justify-between">
            <div
              className="text-2xl font-bold text-neutral-900"
              data-testid="user-name"
            >
              {getFullName(userDetails)}
            </div>
            <div className="flex space-x-2 mt-[-2px]">
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
                    More
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
                  toast(<SuccessToast content="Invitation has been sent" />, {
                    closeButton: (
                      <Icon
                        name="closeCircleOutline"
                        color="text-primary-500"
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
                  resendInviteMutation.mutate(userDetails?.id);
                }}
              />
            </div>
          </div>
          <div className="flex space-x-3 items-center mt-[4px]">
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
                {userDetails?.designation?.name || 'Add designation'}
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
                {userDetails?.department?.name || 'Add department'}
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
                {userDetails?.workLocation?.name || 'Add location'}
              </div>
            </div>
          </div>
          <div
            className="mt-[10px] flex items-center space-x-2 cursor-pointer"
            onClick={(e) => {
              if (!userId || userId === user?.id) {
                e.preventDefault();
                showSocialLinks();
              }
            }}
          >
            {['linkedIn', 'twitter', 'instagram', 'facebook', 'website'].map(
              (s) => (
                <SocialIcon key={s} userDetails={userDetails} socialLink={s} />
              ),
            )}
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
