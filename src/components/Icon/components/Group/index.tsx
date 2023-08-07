import React from 'react';
import { default as GroupFilled } from './GroupFilled';
import { default as GroupOutline } from './GroupOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const GroupIcon: React.FC<IconProps> = ({
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
        <GroupFilled {...props} />
      ) : (
        <GroupOutline {...props} />
      )}
    </div>
  );
};

export default GroupIcon;
