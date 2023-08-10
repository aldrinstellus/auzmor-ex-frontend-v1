import React from 'react';
import useHover from 'hooks/useHover';
import { default as ProfileUserFilled } from './ProfileUserFilled';
import { default as ProfileUserOutline } from './ProfileUserOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ProfileUser: React.FC<IconProps> = ({
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
        <ProfileUserFilled {...props} />
      ) : (
        <ProfileUserOutline {...props} />
      )}
    </div>
  );
};

export default ProfileUser;
