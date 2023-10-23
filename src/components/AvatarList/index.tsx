import clsx from 'clsx';
import Avatar from 'components/Avatar';
import { FC } from 'react';
import { getProfileImage } from 'utils/misc';

export type AvatarListProps = {
  users: any;
  moreCount?: number;
  size?: number;
  className?: string;
  avatarClassName?: string;
  onClick?: () => any;
  dataTestId?: string;
};

interface IUser {
  id: string;
  name: string;
  image: string;
}

const AvatarList: FC<AvatarListProps> = ({
  users,
  moreCount = 0,
  className = '',
  avatarClassName = '',
  size = 48,
  onClick = () => {},
  dataTestId = '',
}) => {
  const styles = clsx({ 'flex -space-x-8': true }, { [className]: true });
  return (
    <div className={styles} data-testid={dataTestId}>
      {users
        .map((user: IUser) => {
          return (
            <Avatar
              size={size}
              key={`${user.id}`}
              name={user?.name}
              image={user?.image || getProfileImage(user)}
              active={false}
              className={`border-[2px] border-white ${avatarClassName}`}
            />
          );
        })
        .slice(0, 2)}
      {moreCount > 2 && (
        <Avatar
          size={size}
          name={`+${moreCount - 2}`}
          onClick={onClick}
          active={false}
          className={`border-[2px] border-white ${avatarClassName}`}
          isCounter
        />
      )}
    </div>
  );
};

export default AvatarList;
