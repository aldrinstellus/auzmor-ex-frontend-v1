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
  const [file, setFile] = useState<IUpdateProfileImage | Record<string, any>>(
    {},
  );
  const [isCoverImageRemoved, setIsCoverImageRemoved] = useState(false);
  const userProfileImageRef = useRef<HTMLInputElement>(null);
  const userCoverImageRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Card
        className="bg-white pb-1 w-full h-[290.56px]"
        data-testid="profile-details"
      >
        <div className="relative cursor-pointer">
          <div className="w-full h-[179.56px] overflow-hidden rounded-9xl">
            {!isCoverImageRemoved && (
              <img
                className="object-cover w-full"
                src={profileCoverData?.coverImage?.original}
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
                setShowModal(true);
              }}
              dataTestId="edit-cover-pic"
            />
          )}
        </div>
        <div className="flex">
          <div className="-mt-20 ml-8">
            <Avatar
              name={profileCoverData?.fullName}
              image={profileCoverData?.profileImage?.original}
              size={96}
              className="border-2 border-white mt-8 overflow-hidden"
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
                  dataTestId={canEdit ? 'edit-profile' : 'follow'}
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
              {profileCoverData?.workLocation && (
                <>
                  <Divider variant={DividerVariant.Vertical} />
                  <div className="flex space-x-3 items-center">
                    <IconWrapper type={Type.Square} className="cursor-pointer">
                      <Icon name="location" size={16} />
                    </IconWrapper>
                    <div className="text-xs font-normal text-neutral-900">
                      {profileCoverData?.workLocation}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <EditProfileModal
            data={profileCoverData}
            showModal={showModal}
            setShowModal={setShowModal}
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
        <input
          id="file-input"
          type="file"
          ref={userProfileImageRef}
          className="hidden"
          accept="image/*"
          multiple={false}
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile({
                ...file,
                profileImage: Array.prototype.slice.call(e.target.files)[0],
              });
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
          onChange={(e) => {
            if (e.target.files?.length) {
              setFile({
                ...file,
                coverImage: Array.prototype.slice.call(e.target.files)[0],
              });
            }
          }}
        />
      </Card>
    </>
  );
};

export default ProfileCoverSection;
