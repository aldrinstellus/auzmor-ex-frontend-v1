import React from 'react';
import useHover from 'hooks/useHover';
import { default as UserRemoveOutline } from './UserRemoveOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const UserRemove: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <UserRemoveOutline {...props} />
    </div>
  );
};

export default UserRemove;
