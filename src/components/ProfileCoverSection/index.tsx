import Card from 'components/Card';
import React, { useRef } from 'react';
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
            src={profileCoverData?.coverImage?.original}
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
              name={profileCoverData?.fullName}
              image={profileCoverData?.profileImage?.original}
              size={96}
              className="border-2 border-white mt-8"
            />
          </div>

          <div className="ml-4 mb-7 flex flex-col space-y-5 w-full">
            <div className="flex items-center">
              <div className="mr-6 mt-2 flex justify-between w-full">
                <div className="flex space-x-4">
                  <div className="text-2xl font-bold">
                    {profileCoverData?.fullName}
                  </div>
                  <div className="p-1">
                    {!canEdit && (
                      <div className="bg-red-100 border-1 border-red-200 rounded-full px-3 py-1 flex justify-center items-center space-x-2">
                        <Icon name="outOfOfficeIcon" size={16} />
                        <div className="text-xxs font-medium">
                          {profileCoverData?.status}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  className="flex"
                  leftIconClassName="mr-2"
                  label={canEdit ? 'Edit Profile' : 'Follow'}
                  leftIcon={canEdit ? 'edit' : 'addCircle'}
                  size={ButtonSize.Small}
                  variant={ButtonVariant.Secondary}
                  onClick={() => {
                    canEdit && setShowModal(true);
                  }}
                />
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <div className="text-xs font-normal text-neutral-900">
                <div>{profileCoverData?.designation}</div>
              </div>
              {profileCoverData?.department && (
                <>
                  <Divider variant={DividerVariant.Vertical} />
                  <div className="flex space-x-3 items-center">
                    <IconWrapper type={Type.Square} className="cursor-pointer">
                      <Icon name="briefcase" size={16} />
                    </IconWrapper>
                    <div className="text-xs font-normal text-neutral-900">
                      {profileCoverData?.department}
                    </div>
                  </div>
                </>
              )}
              {profileCoverData?.location && (
                <>
                  <Divider variant={DividerVariant.Vertical} />
                  <div className="flex space-x-3 items-center">
                    <IconWrapper type={Type.Square} className="cursor-pointer">
                      <Icon name="location" size={16} />
                    </IconWrapper>
                    <div className="text-xs font-normal text-neutral-900">
                      {profileCoverData?.location}
                    </div>
                  </div>
                </>
              )}
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
    </>
  );
};

export default ProfileCoverSection;
