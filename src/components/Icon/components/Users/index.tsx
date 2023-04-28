import React from 'react';
import useHover from 'hooks/useHover';
import { default as UsersFilled } from './UsersFilled';
import { default as UsersOutline } from './UsersOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const UsersIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <UsersFilled {...props} />
      ) : (
        <UsersOutline {...props} />
      )}
    </div>
  );
};

export default UsersIcon;
