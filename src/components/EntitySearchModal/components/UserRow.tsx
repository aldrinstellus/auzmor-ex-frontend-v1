import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { IGetUser } from 'queries/users';
import { FC } from 'react';
import { getProfileImage } from 'utils/misc';

interface IUserRowProps {
  user: IGetUser;
  onClick?: () => void;
}

const UserRow: FC<IUserRowProps> = ({ user, onClick }) => {
  return (
    <div
      className="flex items-center justify-between w-full pr-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <Avatar
          name={user?.fullName || ''}
          size={32}
          image={getProfileImage(user)}
        />
        <div className="flex flex-col justify-between ml-4 truncate">
          <div>{user?.fullName || ''}</div>
          <div className="truncate text-neutral-500 text-xs">
            {user.workEmail || ''}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex">
          <Icon name="globalOutline" size={16} />
          <div className="text-neutral-500 text-xs ml-1">Everyone</div>
        </div>
        <div className="mx-6 w-1 h-1 bg-neutral-500 rounded-full" />
        <div className="flex">
          <Icon name="location" size={16} />
          <div className="text-neutral-500 text-xs ml-1">
            {user.workLocation?.name || 'NA'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRow;
