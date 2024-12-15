import Avatar from 'components/Avatar';
import { FC, ReactElement, useEffect, useState } from 'react';
import EditIcon from './components/EditIcon';
import useAuth from 'hooks/useAuth';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { EntityType, IMedia } from 'interfaces';
import { useMutation } from '@tanstack/react-query';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

type UpdateProfileImageProps = {
  setLoading?: (loading: boolean) => void;
  setError?: (error: boolean) => void;
  dataTestId?: string;
};

const UpdateProfileImage: FC<UpdateProfileImageProps> = ({
  setLoading,
  setError,
  dataTestId,
}): ReactElement => {
  const { getApi } = usePermissions();
  const [profilePicture, setProfilePicture] = useState<File[]>();
  const { user, updateUser } = useAuth();
  const { uploadMedia, uploadStatus } = useUpload();

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateProfileImageMutation = useMutation({
    mutationFn: (data: Record<string, any>) => updateCurrentUser(data),
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
        role: response?.result?.data?.role,
        organization: {
          id: response?.result?.data?.org?.id,
          domain: response?.result?.data?.org?.domain,
          name: response?.result?.data?.org?.name,
        },
        profileImage: response?.result?.data?.profileImage?.original,
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
          original: files[0].original,
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
      indicatorIcon={
        <EditIcon
          setProfilePicture={setProfilePicture}
          dataTestId={dataTestId}
        />
      }
      name={user?.name}
      image={user?.profileImage}
      bgColor="#DBEAFE"
      loading={isLoading || uploadStatus === UploadStatus.Uploading}
    />
  );
};

export default UpdateProfileImage;
