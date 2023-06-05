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
import CropPictureModal from 'components/CropPictureModal';

export interface IProfileCoverProps {
  profileCoverData: Record<string, any>;
  showEditProfileModal: boolean;
  setShowEditProfileModal: (showModal: boolean) => void;
  showPictureCropModal: boolean;
  setShowPictureCropModal: (showModal: boolean) => void;
  canEdit: boolean;
}

const ProfileCoverSection: React.FC<IProfileCoverProps> = ({
  profileCoverData,
  showEditProfileModal,
  setShowEditProfileModal,
  showPictureCropModal,
  setShowPictureCropModal,
  canEdit,
}) => {
  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );
  const [isCoverImageRemoved, setIsCoverImageRemoved] = useState(false);
  const userProfileImageRef = useRef<HTMLInputElement>(null);
  const userCoverImageRef = useRef<HTMLInputElement>(null);
  const [profileImageName, setProfileImageName] = useState<string>('');
  const [coverImageName, setCoverImageName] = useState<string>('');

  return (
    <>
      <Card
        className="bg-white pb-1 w-full h-[290.56px]"
        data-testid="profile-details"
      >
        <div className="relative cursor-pointer">
          <div
            className="w-full h-[179.56px] overflow-hidden rounded-9xl"
            data-testid={coverImageName}
          >
            {!isCoverImageRemoved && (
              <img
                className="object-cover w-full"
                src={
                  profileCoverData?.coverImage?.original || DefaultCoverImage
                }
                alt={'User Cover Picture Profile'}
                data-testid="user-cover-pic"
                onClick={() => canEdit && setShowEditProfileModal(true)}
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
                setShowEditProfileModal(true);
              }}
              dataTestId="edit-cover-pic"
            />
          )}
        </div>
        <div className="flex">
          <div className="-mt-[75px] ml-8">
            <Avatar
              name={profileCoverData?.fullName}
              image={profileCoverData?.profileImage?.original}
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
                    {profileCoverData?.fullName}
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
                {/* <Button
                  className="flex"
                  leftIconClassName="mr-2"
                  label={canEdit ? 'Edit Profile' : 'Follow'}
                  leftIcon={canEdit ? 'edit' : 'addCircle'}
                  size={ButtonSize.Medium}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    canEdit && setShowEditProfileModal(true);
                  }}
                  dataTestId={canEdit ? 'edit-profile' : 'follow'}
                /> */}
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <div
                className="text-xs font-normal text-neutral-900"
                data-testid="user-designation"
              >
                {profileCoverData?.designation || 'N/A'}
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
                  {profileCoverData?.department || 'N/A'}
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
                  {profileCoverData?.workLocation || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {showEditProfileModal && (
          <EditProfileModal
            data={profileCoverData}
            showEditProfileModal={showEditProfileModal}
            setShowEditProfileModal={setShowEditProfileModal}
            setShowPictureCropModal={setShowPictureCropModal}
            userProfileImageRef={userProfileImageRef}
            userCoverImageRef={userCoverImageRef}
            file={file}
            setFile={setFile}
            key={'edit-profile'}
            dataTestId="edit-profile"
            isCoverImageRemoved={isCoverImageRemoved}
            setIsCoverImageRemoved={setIsCoverImageRemoved}
          />
        )}
        {showPictureCropModal && (
          <CropPictureModal
            title={file?.profileImage ? 'Apply Changes' : 'Reposition'}
            showPictureCropModal={showPictureCropModal}
            setShowPictureCropModal={setShowPictureCropModal}
            setShowEditProfileModal={setShowEditProfileModal}
            file={file}
            setFile={setFile}
            userProfileImageRef={userProfileImageRef}
            userCoverImageRef={userCoverImageRef}
            profileImage={profileCoverData?.profileImage}
            coverImage={profileCoverData?.coverImage}
          />
        )}
        {canEdit && (
          <>
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
                  setShowPictureCropModal(true);
                  setShowEditProfileModal(false);
                  setProfileImageName(e?.target?.files[0]?.name);
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
                  setShowPictureCropModal(true);
                  setShowEditProfileModal(false);
                  setCoverImageName(e?.target?.files[0]?.name);
                }
              }}
            />
          </>
        )}
      </Card>
    </>
  );
};

export default ProfileCoverSection;
