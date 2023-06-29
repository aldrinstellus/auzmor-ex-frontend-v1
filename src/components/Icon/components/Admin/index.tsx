import React from 'react';
import useHover from 'hooks/useHover';
import { default as AdminFilled } from './AdminFilled';
import { default as AdminOutline } from './AdminOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const AdminIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  isActive,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      {!disabled && (hover || isActive) ? (
        <AdminFilled {...props} />
      ) : (
        <AdminOutline {...props} />
      )}
    </div>
  );
};

export default AdminIcon;
