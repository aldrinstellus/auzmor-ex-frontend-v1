import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import EditIcon from './EditIcon';
import { EntityType, useUpload } from 'queries/files';
import Button from 'components/Button';
import useAuth from 'hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IUserOnboardUpdate,
  updateUserOnboard,
  useOnboardUser,
} from 'queries/users';

type EditProfileScreenProps = {
  fullName: string;
  next: any;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  fullName,
  next,
}): ReactElement => {
  const [disableEdit, setDisableEdit] = useState<boolean>(true);
  const nameRef = useRef<HTMLInputElement>(null);

  const [profilePicture, setProfilePicture] = useState<File[]>();
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<any>();
  const { uploadMedia, uploadStatus } = useUpload();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateProfile = async () => {
    let fileIds: any;

    if (profilePicture) {
      fileIds = await uploadMedia(profilePicture, EntityType.UserProfileImage);
    }

    const userId = user?.id ? user.id : '';

    const updateProfile = {
      preferredName: nameRef.current?.value,
      ...(fileIds && {
        profileImage: {
          fileId: fileIds[0].id,
          originalUrl: fileIds[0].url,
        },
      }),
    };

    // const data = await updateUserOnboard(userId, updateProfile);
  };

  useEffect(() => {
    if (disableEdit) nameRef?.current?.setAttribute('disabled', 'true');
    if (!disableEdit) {
      nameRef?.current?.removeAttribute('disabled');
      nameRef?.current?.focus();
    }
  }, [disableEdit]);

  return (
    <div className="flex flex-col min-h-full justify-between min-w-full">
      <div className="flex items-center flex-col justify-between gap-y-4 mt-6">
        <div className="flex items-center justify-center">
          <input
            className="outline-none bg-white text-neutral-900 font-bold text-2xl text-center w-min"
            defaultValue={fullName}
            ref={nameRef}
          ></input>

          <div
            className="border border-gray-300 rounded-xl cursor-pointer"
            onClick={() => setDisableEdit(!disableEdit)}
          >
            <Icon
              className="p-1"
              hover={false}
              stroke="#000000"
              name="edit"
              size={20}
            />
          </div>
        </div>
        <Avatar
          size={144}
          showEditIcon
          editIconComponent={<EditIcon setProfilePicture={setProfilePicture} />}
          name={fullName}
          bgColor="#DBEAFE"
        />
        <p className="font-bold text-neutral-900 text-2xl">
          Set your profile photo
        </p>
        <p className="font-normal text-sm text-neutral-500">
          Click on the image above to upload your profile photo.
        </p>
        <div className="bg-green-50 px-5 py-3 border rounded-md border-transparent">
          <p className="font-normal text-sm text-neutral-900 whitespace-nowrap">
            Adding a profile photo will make it easier for your colleagues to
            recognise you.
          </p>
        </div>
      </div>
      <div className="bg-blue-50 mt-10">
        <div className="p-4 flex items-center justify-between">
          <div
            className="font-bold text-neutral-900 cursor-pointer"
            onClick={next}
          >
            Skip this step
          </div>
          <Button
            className="font-bold"
            label="Next"
            // loading={nextButtonLoading}
            onClick={updateProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileScreen;
