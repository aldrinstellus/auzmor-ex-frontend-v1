import React from 'react';
import useHover from 'hooks/useHover';
import { default as NotificationFilled } from './NotificationFilled';
import { default as NotificationOutline } from './NotificationOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const NotificationIcon: React.FC<IconProps> = ({
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
        <NotificationFilled {...props} />
      ) : (
        <NotificationOutline {...props} />
      )}
    </div>
  );
};

export default NotificationIcon;
