import { FC, useMemo } from 'react';
import { IGetUser } from 'queries/users';
import Avatar from 'components/Avatar';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';
import { clsx } from 'clsx';

interface IUserRowProps {
  user: IGetUser;
  className?: string;
  dataTestId?: string;
  onClick?: (user: IGetUser) => void;
}

const UserRow: FC<IUserRowProps> = ({
  user,
  className = '',
  dataTestId = '',
  onClick = () => {},
}) => {
  const styles = useMemo(
    () =>
      clsx({
        'flex justify-between py-5 border-b-1 border-neutral-100 cursor-pointer px-6 hover:bg-primary-50':
          true,
        [className]: true,
      }),
    [],
  );
  return (
    <div
      className={styles}
      onClick={() => onClick(user)}
      key={`user-row-${user.id}`}
      data-testid={dataTestId}
    >
      <div className="flex w-1/2 items-center">
        <div className="mr-4">
          <Avatar
            size={32}
            image={getProfileImage(user)}
            name={getFullName(user)}
            bgColor={getAvatarColor(user)}
          />
        </div>
        <div className="flex flex-col truncate w-full">
          <div className="text-neutral-900 font-bold text-sm truncate">
            {getFullName(user) || 'Field not specified'}
          </div>
          <div className="text-neutral-500 text-xs truncate">
            {user.workEmail || 'Field not specified'}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2">
        <div className="flex flex-row w-full justify-end">
          <div className={`text-neutral-500 text-xs truncate mr-6`}>
            {user.designation?.name || 'Field not specified'}
          </div>
          <div className={`mr-6 flex items-center`}>
            <div className="w-1 h-1 bg-neutral-500 rounded-full"></div>
          </div>
          <div className={`text-neutral-500 text-xs truncate`}>
            {user?.workLocation?.name || 'Field not specified'}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default UserRow;
