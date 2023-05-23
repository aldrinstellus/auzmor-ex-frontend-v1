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
};

const AdminIcon: React.FC<IconProps> = ({
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
        <AdminFilled {...props} />
      ) : (
        <AdminOutline {...props} />
      )}
    </div>
  );
};

export default AdminIcon;
