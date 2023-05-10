import Avatar from 'components/Avatar';
import React, { ReactElement, useEffect, useState } from 'react';
import EditIcon from './components/EditIcon';
import useAuth from 'hooks/useAuth';
import { UploadStatus, useUpload } from 'queries/files';
import { EntityType } from 'queries/files';

type UpdateProfileImageProps = {
  updateProfileImageMutation: any;
  isLoading?: boolean;
  isError?: boolean;
  uploadMedia: any;
  uploadStatus: UploadStatus;
};

const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({
  updateProfileImageMutation,
  isLoading,
  isError,
  uploadMedia,
  uploadStatus,
}): ReactElement => {
  const [profilePicture, setProfilePicture] = useState<File[]>();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    console.log({ uploadStatus });
  }, [uploadStatus]);

  let files: any[] = [];

  const uploadAndSetProfilePicture = async () => {
    if (profilePicture) {
      files = await uploadMedia(profilePicture, EntityType.UserProfileImage);
      console.log({ files });
      updateProfileImageMutation.mutate({
        id: user?.id || '',
        profileImage: {
          fileId: files[0].id,
          originalUrl: files[0].originalUrl,
        },
      });
    }
  };

  useEffect(() => {
    uploadAndSetProfilePicture();
  }, [profilePicture]);

  return (
    <Avatar
      size={144}
      indicatorIcon={<EditIcon setProfilePicture={setProfilePicture} />}
      name={user?.name}
      image={user?.profileImage || ''}
      bgColor="#DBEAFE"
    />
  );
};

export default UpdateProfileImage;
