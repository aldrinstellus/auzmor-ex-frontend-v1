import React from 'react';
import useHover from 'hooks/useHover';
import { default as UserManagementOutline } from './UserManagementOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const UserManagement: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <UserManagementOutline {...props} />
    </div>
  );
};

export default UserManagement;
