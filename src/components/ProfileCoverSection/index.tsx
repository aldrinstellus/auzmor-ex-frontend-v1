import Card from 'components/Card';
import React, { useContext, useRef } from 'react';
import Avatar from 'components/Avatar';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import Button, {
  Size as ButtonSize,
  Variant as ButtonVariant,
} from 'components/Button';
import Icon from 'components/Icon';
import OutOfOffice from 'images/out-of-office.svg';
import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import EditProfileModal from './components/EditProfileModal';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';

export interface IProfileCoverProps {
  profileCoverData: Record<string, any>;
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  canEdit: boolean;
}

const ProfileCoverSection: React.FC<IProfileCoverProps> = ({
  profileCoverData,
  showModal,
  setShowModal,
  canEdit,
}) => {
  const coverImageRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Card className="bg-white pb-1 w-full h-[290.56px]">
        {/* Image Cover */}
        <div className="relative cursor-pointer">
          <img
            className="object-cover w-full h-[179.56px] rounded-9xl"
            src="https://libg.s3.us-east-2.amazonaws.com/download/Blue-And-Red-Over-The-Mountains.jpg"
          />
          {canEdit && (
            <IconButton
              icon="edit"
              className="bg-white m-4 absolute top-0 right-0 p-3 text-black"
              variant={IconVariant.Secondary}
              size={Size.Medium}
              onClick={() => {
                setShowModal(true);
              }}
            />
          )}
        </div>
        <div className="flex">
          {/* Profile Picture */}
          <div className="-mt-20 ml-8">
            <Avatar
              name={profileCoverData?.fullName || 'U'}
              image={
                profileCoverData?.profileImage?.original ||
                'https://play-lh.googleusercontent.com/7Ac5TgaL15Ra4bvFVHJKCdJp4qvnL4djZj5bKc6RN-MZjzrvkeHbJytek0NPTSdZcp8'
              }
              size={96}
              className="border-2 border-white mt-8"
            />
          </div>

          <div className="ml-4 mb-7 flex flex-col space-y-5 w-full">
            <div className="flex items-center">
              <div className="mr-6 mt-2 flex justify-between w-full">
                <div className="flex space-x-4">
                  <div className="text-2xl font-bold">
                    {profileCoverData?.userName || 'Megan Berry'}
                  </div>
                  {!canEdit && (
                    <div className="bg-red-100 border-1 border-red-200 rounded-full px-3 flex justify-center items-center space-x-2">
                      <Icon name="outOfOfficeIcon" size={16} />
                      <div className="text-xxs font-medium">
                        {profileCoverData?.status}
                      </div>
                    </div>
                  )}
                </div>
                {canEdit ? (
                  <Button
                    className="flex"
                    leftIconClassName="mr-2"
                    label="Edit Profile"
                    leftIcon="edit"
                    size={ButtonSize.Small}
                    variant={ButtonVariant.Secondary}
                    onClick={() => {
                      setShowModal(true);
                    }}
                  />
                ) : (
                  <Button
                    className="flex"
                    label="Follow"
                    leftIconClassName="mr-2"
                    leftIcon="addCircle"
                    size={ButtonSize.Small}
                    variant={ButtonVariant.Secondary}
                    onClick={() => {
                      // follow/unfollow functionality
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <div className="text-xs font-normal text-neutral-900">
                <div>{profileCoverData?.designation || 'Tech Lead'}</div>
              </div>
              <div className="bg-neutral-100">
                <Divider variant={DividerVariant.Vertical} />
              </div>
              <div className="flex space-x-3 items-center">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="briefcase" size={16} />
                </IconWrapper>
                <div className="text-xs font-normal text-neutral-900">
                  {profileCoverData?.department || 'Engineering'}
                </div>
              </div>
              <div className="bg-neutral-100">
                <Divider variant={DividerVariant.Vertical} />
              </div>
              <div className="flex space-x-3 items-center">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="location" size={16} />
                </IconWrapper>
                <div className="text-xs font-normal text-neutral-900">
                  {profileCoverData?.location || 'Mumbai, India'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <EditProfileModal
          data={profileCoverData}
          showModal={showModal}
          setShowModal={setShowModal}
          coverImageRef={coverImageRef}
        />
      </Card>
      <input
        type="file"
        className="hidden"
        ref={coverImageRef}
        accept="image/*"
        onChange={(e) => {
          console.log('wwwww', e.target.files);
        }}
      />
    </>
  );
};

export default ProfileCoverSection;
