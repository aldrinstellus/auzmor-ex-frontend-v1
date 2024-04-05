import { IAvatarUser } from '..';
import Avatar from 'components/Avatar';
import { getFullName, getProfileImage } from 'utils/misc';
import Icon from 'components/Icon';
import { FC } from 'react';
import useProduct from 'hooks/useProduct';

interface IProfileCardProps {
  user: IAvatarUser;
}

const ProfileCard: FC<IProfileCardProps> = ({ user }) => {
  const { isLxp } = useProduct();
  return (
    <div className="flex gap-4 min-w-[200px]">
      <Avatar
        name={getFullName(user) || user.email}
        image={getProfileImage(user, 'medium')}
        size={80}
      />
      <div className="flex flex-col gap-2 justify-center">
        <p className="font-bold">{getFullName(user) || user.email}</p>
        {!isLxp && user.designation && (
          <p className="text-sm">{user.designation}</p>
        )}
        {isLxp && user.designation && (
          <div className="flex items-center gap-2">
            <Icon
              name="briefcase"
              color="text-neutral-900"
              size={16}
              hover={false}
            />
            <p className="text-sm">{user.designation}</p>
          </div>
        )}
        {user.workLocation?.name && (
          <div className="flex items-center gap-2">
            <Icon
              name="location"
              color="text-neutral-900"
              size={16}
              hover={false}
            />
            <p className="text-sm">{user.workLocation.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
