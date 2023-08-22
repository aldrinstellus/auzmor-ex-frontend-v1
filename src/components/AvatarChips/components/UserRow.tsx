import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import { IAvatarUser } from 'components/AvatarChip';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import { getFullName, getProfileImage, twConfig } from 'utils/misc';

interface IUserRowProps {
  user: IAvatarUser;
}

const UserRow: React.FC<IUserRowProps> = ({ user }) => {
  const { user: currentUser } = useAuth();
  return (
    <div className="flex items-center justify-between w-full group hover:bg-primary-50 transition py-1">
      <div className="flex items-center gap-4 flex-1">
        <Avatar
          name={getFullName(user)}
          image={getProfileImage(user)}
          size={32}
        />
        <div>
          <p className="font-bold text-sm line-clamp-1">{getFullName(user)}</p>
          <p className="text-xs text-neutral-500 line-clamp-1">{user.email}</p>
        </div>
      </div>
      {user.designation && (
        <>
          <div className="bg-neutral-500 rounded-full w-1 h-1 mx-4" />
          <div className="text-neutral-500 text-xs flex-1 line-clamp-1">
            {user.designation}
          </div>
        </>
      )}
      {user.workLocation && (
        <>
          <div className="bg-neutral-500 rounded-full mx-4 w-1 h-1" />
          <div className="text-neutral-500 text-xs flex-1 line-clamp-1">
            {user.workLocation}
          </div>
        </>
      )}
      <Link
        to={
          user.userId && user.userId !== currentUser?.id
            ? '/users/' + user.userId
            : '/profile'
        }
      >
        <div className="text-primary-600 text-sm font-bold cursor-pointer invisible group-hover:visible flex items-center gap-1">
          <span>Go to profile</span>
          <Icon
            name="arrowRightOutline"
            size={16}
            stroke={twConfig.theme.colors.primary[600]}
          />
        </div>
      </Link>
    </div>
  );
};

export default UserRow;
