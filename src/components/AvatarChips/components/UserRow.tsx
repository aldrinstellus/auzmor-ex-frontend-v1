import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import { IAvatarUser } from 'components/AvatarChip';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import { getFullName, getProfileImage } from 'utils/misc';
import { FC } from 'react';
import useProduct from 'hooks/useProduct';

interface IUserRowProps {
  user: IAvatarUser;
  dataTestId?: string;
}

const UserRow: FC<IUserRowProps> = ({ user, dataTestId }) => {
  const { user: currentUser } = useAuth();
  const { isLxp } = useProduct();

  return (
    <div className="flex items-center justify-between w-full group hover:bg-primary-50 transition py-1">
      <div className="flex items-center gap-4 flex-1">
        <Avatar
          name={getFullName(user) || user.email}
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
      {user.workLocation?.name && (
        <>
          <div className="bg-neutral-500 rounded-full mx-4 w-1 h-1" />
          <div className="text-neutral-500 text-xs flex-1 line-clamp-1">
            {user.workLocation?.name}
          </div>
        </>
      )}
      {!isLxp && (
        <Link
          to={
            user.userId && user.userId !== currentUser?.id
              ? '/users/' + user.userId
              : '/profile'
          }
        >
          <div
            className="text-primary-600 text-sm font-bold cursor-pointer invisible group-hover:visible flex items-center gap-1"
            data-testid={`${dataTestId}${
              getFullName(user) || user.email
            }-gotoprofile`}
          >
            <span>Go to profile</span>
            <Icon name="arrowRightOutline" size={16} color="text-primary-600" />
          </div>
        </Link>
      )}
    </div>
  );
};

export default UserRow;
