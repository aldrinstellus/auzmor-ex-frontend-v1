import clsx from 'clsx';
import Avatar from 'components/Avatar';
import React from 'react';

export type AvatarListProps = {
  users: any;
  moreCount?: number;
  size?: number;
  className?: string;
  onClick?: () => null;
  dataTestId?: string;
};

interface IUser {
  id: string;
  name: string;
  image: string;
}

const AvatarList: React.FC<AvatarListProps> = ({
  users,
  moreCount = 0,
  className = '',
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
              image={user?.image}
              active={false}
            />
          );
        })
        .slice(0, 2)}
      {users.length > 2 && (
        <Avatar
          size={size}
          name={`+${moreCount - 2}`}
          onClick={onClick}
          active={false}
        />
      )}
    </div>
  );
};

export default AvatarList;
