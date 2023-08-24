import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Button from 'components/Button';
import UpdateProfileImage from 'components/UpdateProfileImage';
import Banner, { Variant } from 'components/Banner';
import Avatar from 'components/Avatar';
import EditIcon from 'components/Icon/components/Edit';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';

type EditProfileScreenProps = {
  next: () => void;
  setDisableClose: (disableClose: boolean) => void;
  dataTestId?: string;
  profilePictureRef?: React.RefObject<HTMLInputElement> | null;
  error?: boolean;
  loading?: boolean;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  next,
  setDisableClose,
  dataTestId,
  profilePictureRef,
  error = false,
  loading = false,
}): ReactElement => {
  const { user } = useAuth();

  useEffect(() => setDisableClose(loading), [loading]);

  return (
    <>
      <div className="flex flex-col min-h-full justify-between min-w-full">
        <div className="flex items-center flex-col justify-between gap-y-6 mt-6">
          <div className="text-2xl font-bold text-neutral-900">
            {user?.name}
          </div>
          <Avatar
            size={144}
            indicatorIcon={
              <Icon
                name="edit"
                size={20}
                className="absolute bg-primary-500 border-1 border-white rounded-full p-2 cursor-pointer top-0 right-1"
                color="#ffffff"
                onClick={() => profilePictureRef?.current?.click()}
                dataTestId="edit-profilepic"
              />
            }
            name={user?.name}
            image={user?.profileImage}
            bgColor="#DBEAFE"
          />

          <div className="flex flex-col items-center mt-4 gap-y-6">
            <div className="flex flex-col items-center gap-y-1">
              <p className="font-bold text-neutral-900 text-2xl">
                Set your profile photo
              </p>
              <p className="font-normal text-sm text-neutral-500">
                Click on the image above to upload your profile photo.
              </p>
            </div>
            <div className="bg-green-50 px-6 py-3 border rounded-md border-transparent">
              <p className="font-normal text-sm text-neutral-900 whitespace-nowrap">
                Adding a profile photo will make it easier for your colleagues
                to recognise you.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-0">
          <Banner
            variant={Variant.Error}
            title="Failed to upload media. Please try again!"
            className={`min-w-full ${
              error && !loading ? 'visible' : 'invisible'
            }`}
            dataTestId="error-set-profilepic"
          />
          <div className="bg-blue-50 rounded-b-9xl">
            <div className="p-3 flex items-center justify-between">
              <div
                className={`font-bold text-neutral-900 ${
                  loading ? 'cursor-not-allowed' : 'cursor-pointer'
                } `}
                onClick={loading ? undefined : next}
              >
                Skip this step
              </div>
              <Button
                className="font-bold"
                label="Next"
                disabled={loading}
                onClick={next}
                dataTestId={`${dataTestId}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileScreen;
