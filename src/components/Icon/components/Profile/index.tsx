import React from 'react';
import { default as ProfileFilled } from './ProfileFilled';
import { default as ProfileOutline } from './ProfileOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const ProfileIcon: React.FC<IconProps> = ({
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
        <ProfileFilled {...props} />
      ) : (
        <ProfileOutline {...props} />
      )}
    </div>
  );
};

export default ProfileIcon;
