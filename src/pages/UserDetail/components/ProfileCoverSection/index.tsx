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
import DefaultCoverImage from 'images/png/CoverImage.png';
import useModal from 'hooks/useModal';
import EditImageModal from 'components/EditImageModal';
import { getBlobUrl } from 'utils/misc';
import { EntityType } from 'queries/files';

export interface IProfileCoverProps {
  userDetails: Record<string, any>;
  canEdit: boolean;
}

const ProfileCoverSection: React.FC<IProfileCoverProps> = ({
  userDetails,
  canEdit,
}) => {
  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );

  const [openEditProfile, openEditProfileModal, closeEditProfileModal] =
    useModal(false);
  const [openEditImage, openEditImageModal, closeEditImageModal] =
    useModal(false);

  const [isCoverImageRemoved, setIsCoverImageRemoved] = useState(false);

  const userProfileImageRef = useRef<HTMLInputElement>(null);
  const userCoverImageRef = useRef<HTMLInputElement>(null);

  const [profileImageName, setProfileImageName] = useState<string>('');
  const [coverImageName, setCoverImageName] = useState<string>('');

  const getBlobFile = file?.profileImage
    ? getBlobUrl(file?.profileImage)
    : file?.coverImage && getBlobUrl(file?.coverImage);

  return (
    <div>
      <Card
        className="bg-white pb-1 w-full h-[290.56px]"
        data-testid="profile-details"
      >
        <div className="relative cursor-pointer">
          <div
            className="w-full h-[180px] overflow-hidden rounded-9xl"
            data-testid={coverImageName}
          >
            {userDetails?.coverImage?.original && !isCoverImageRemoved ? (
              <img
                className="object-cover h-[180px] w-full"
                src={userDetails?.coverImage?.original}
                alt={'User Cover Picture Profile'}
                data-testid="user-cover-pic"
                onClick={() => canEdit && openEditProfileModal()}
              />
            ) : (
              <img
                className="object-cover w-full"
                src={DefaultCoverImage}
                alt="Default Image"
                data-testid="user-cover-pic"
                onClick={() => canEdit && openEditProfileModal()}
              />
            )}
          </div>
          {canEdit && (
            <IconButton
              icon="edit"
              className="bg-white m-4 absolute top-0 right-0 p-3 text-black"
              variant={IconVariant.Secondary}
              size={Size.Medium}
              onClick={() => {
                openEditProfileModal();
              }}
              dataTestId="edit-cover-pic"
            />
          )}
        </div>
        <div className="flex">
          <div className="-mt-[75px] ml-8">
            <Avatar
              name={userDetails?.fullName}
              image={userDetails?.profileImage?.original}
              size={80}
              className="border-2 border-white mt-8 overflow-hidden"
              dataTestId={profileImageName || 'edit-profile-pic'}
            />
          </div>
          <div className="ml-4 mb-7 flex flex-col space-y-5 w-full">
            <div className="flex items-center">
              <div className="mr-6 mt-2 flex justify-between w-full">
                <div className="flex space-x-4">
                  <div className="text-2xl font-bold" data-testid="user-name">
                    {userDetails?.fullName}
                  </div>
                  {/* <div className="p-1">
                    {!canEdit && (
                      <div className="border-1 rounded-full px-3 py-1 flex justify-center items-center space-x-2">
                        <Icon name="outOfOfficeIcon" size={16} />
                        <div className="text-xxs font-medium">
                          {profileCoverData?.status?.charAt(0) +
                            profileCoverData?.status?.slice(1)?.toLowerCase()}
                        </div>
                      </div>
                    )}
                  </div> */}
                </div>
                <Button
                  className="flex"
                  leftIconClassName="mr-2"
                  label={canEdit ? 'Edit Profile' : 'Follow'}
                  leftIcon={canEdit ? 'edit' : 'addCircle'}
                  size={ButtonSize.Medium}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    canEdit && openEditProfileModal();
                  }}
                  dataTestId={canEdit ? 'edit-profile' : 'follow'}
                />
              </div>
            </div>
            <div className="flex space-x-4 items-center">
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
            title={getBlobFile ? 'Apply Changes' : 'Reposition'}
            openEditImage={openEditImage}
            closeEditImageModal={closeEditImageModal}
            openEditProfileModal={openEditProfileModal}
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
    </div>
  );
};

export default ProfileCoverSection;
