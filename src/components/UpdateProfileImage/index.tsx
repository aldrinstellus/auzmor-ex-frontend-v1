import Avatar from 'components/Avatar';
import React, { ReactElement, useEffect, useState } from 'react';
import EditIcon from './components/EditIcon';
import useAuth from 'hooks/useAuth';
import { UploadStatus, useUpload } from 'queries/files';
import { EntityType } from 'queries/files';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import { IMedia } from 'contexts/CreatePostContext';

type UpdateProfileImageProps = {
  setLoading?: (loading: boolean) => void;
  setError?: (error: boolean) => void;
};

const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({
  setLoading,
  setError,
}): ReactElement => {
  const [profilePicture, setProfilePicture] = useState<File[]>();
  const { user, updateUser } = useAuth();
  const { uploadMedia, uploadStatus } = useUpload();

  const updateProfileImageMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-profile-image-mutation'],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: (response: any) => {
      console.log('API call success', response);
      updateUser({
        name: response?.result?.data?.fullName,
        id: response?.result?.data?.id,
        email: response?.result?.data?.primaryEmail,
        organization: {
          id: response?.result?.data?.org?.id,
          domain: response?.result?.data?.org?.domain,
        },
        profileImage: response?.result?.data?.profileImage?.originalUrl,
      });
    },
  });

  const { isLoading, isError } = updateProfileImageMutation;

  useEffect(() => {
    if (setError) {
      setError(isError || uploadStatus === UploadStatus.Error);
    }

    if (setLoading) {
      setLoading(isLoading || uploadStatus === UploadStatus.Uploading);
    }
  }, [uploadStatus, isError, isLoading]);

  let files: IMedia[] = [];

  const uploadAndSetProfilePicture = async () => {
    if (profilePicture) {
      files = await uploadMedia(profilePicture, EntityType.UserProfileImage);
      console.log({ files });
      updateProfileImageMutation.mutate({
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
      size={200}
      indicatorIcon={<EditIcon setProfilePicture={setProfilePicture} />}
      name={user?.name}
      image={user?.profileImage}
      bgColor="#DBEAFE"
      loading={isLoading || uploadStatus === UploadStatus.Uploading}
    />
  );
};

export default UpdateProfileImage;
