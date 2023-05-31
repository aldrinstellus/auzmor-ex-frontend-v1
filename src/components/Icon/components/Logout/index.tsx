import React from 'react';
import useHover from 'hooks/useHover';
import { default as LogoutFilled } from './LogoutFilled';
import { default as LogoutOutline } from './LogoutOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const LogoutIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <LogoutFilled {...props} />
      ) : (
        <LogoutOutline {...props} />
      )}
    </div>
  );
};

export default LogoutIcon;
