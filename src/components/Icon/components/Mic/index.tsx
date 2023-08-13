import React from 'react';
import { default as MicFilled } from './MicFilled';
import { default as MicOutline } from './MicOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const MicIcon: React.FC<IconProps> = ({
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
        <MicFilled {...props} />
      ) : (
        <MicOutline {...props} />
      )}
    </div>
  );
};

export default MicIcon;
