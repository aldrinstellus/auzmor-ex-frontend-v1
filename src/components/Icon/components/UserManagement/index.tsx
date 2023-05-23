import React from 'react';
import useHover from 'hooks/useHover';
import { default as UserManagementOutline } from './UserManagementOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const UserManagement: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
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
