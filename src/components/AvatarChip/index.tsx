import React from 'react';
import Avatar from 'components/Avatar';
import { getFullName, getProfileImage } from 'utils/misc';
import useAuth from 'hooks/useAuth';
import { Link } from 'react-router-dom';
import Tooltip, { Variant } from 'components/Tooltip';
import ProfileCard from './components/ProfileCard';

export interface IAvatarUser {
  fullName: string;
  profileImage: object;
  status: string;
  workLocation?: Record<string, string>;
  designation?: string;
  userId: string;
  email?: string;
}

interface IAvatarChipProps {
  user: IAvatarUser;
  className?: string;
  size?: number;
  dataTestId?: string;
}

const AvatarChip: React.FC<IAvatarChipProps> = ({
  className,
  user,
  size = 16,
  dataTestId,
}) => {
  const { user: currentUser } = useAuth();

  return (
    <Tooltip
      tooltipContent={<ProfileCard user={user} />}
      variant={Variant.Light}
      className="shadow-md top !rounded-[12px] !p-4"
    >
      <Link
        to={
          user.userId && user.userId !== currentUser?.id
            ? '/users/' + user.userId
            : '/profile'
        }
      >
        <div
          className={`flex items-center w-fit gap-1 rounded-[24px] border-1 border-neutral-200 bg-neutral-100
      px-3 py-2 text-primary-500 font-medium text-sm hover:border-primary-500 transition cursor-pointer ${className} hover:shadow-lg`}
          data-testid={`${dataTestId}${getFullName(user) || user.email}`}
        >
          <Avatar
            name={getFullName(user) || user.email}
            image={getProfileImage(user)}
            size={size}
          />
          <span>{getFullName(user) || user.email}</span>
        </div>
      </Link>
    </Tooltip>
  );
};

export default AvatarChip;
