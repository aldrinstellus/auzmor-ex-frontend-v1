import React from 'react';
import useHover from 'hooks/useHover';
import { default as UsersFilled } from './UsersFilled';
import { default as UsersOutline } from './UsersOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const UsersIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <UsersFilled {...props} />
      ) : (
        <UsersOutline {...props} />
      )}
    </div>
  );
};

export default UsersIcon;
