import React from 'react';
import { IAvatarUser } from '..';
import Avatar from 'components/Avatar';
import { getFullName, getProfileImage } from 'utils/misc';

interface IProfileCardProps {
  user: IAvatarUser;
}

const ProfileCard: React.FC<IProfileCardProps> = ({ user }) => {
  return (
    <div className="flex gap-4">
      <Avatar
        name={getFullName(user)}
        image={getProfileImage(user)}
        size={80}
      />
      <div className="flex flex-col gap-2">
        <p className="font-bold">{getFullName(user)}</p>
        {user.designation && <p className="text-sm">{user.designation}</p>}
        {user.workLocation && <p className="text-sm">{user.workLocation}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;
