import clsx from 'clsx';
import Avatar from 'components/Avatar';
import React from 'react';

export type AvatarListProps = {
  users: any;
  displayCount?: number;
  size?: number;
  className?: string;
  onClick?: () => null;
};

interface IUser {
  id: string;
  name: string;
  image: string;
}

const AvatarList: React.FC<AvatarListProps> = ({
  users,
  displayCount = 3,
  className = '',
  size = 48,
  onClick = () => {},
}) => {
  const styles = clsx({ 'flex -space-x-4': true }, { [className]: true });
  return (
    <div className="flex -space-x-4">
      {users.map((user: IUser) => {
        return (
          <Avatar
            size={size}
            key={`${user.name}${user.image}`}
            name={user?.name}
            image={user?.image}
            active={false}
          />
        );
      })}
      <Avatar
        size={size}
        name={`+${users.length - displayCount}`}
        onClick={onClick}
        active={false}
      />
    </div>
  );
};

export default AvatarList;
