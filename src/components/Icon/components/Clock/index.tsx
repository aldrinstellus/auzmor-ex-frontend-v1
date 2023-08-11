import React from 'react';
import { default as ClockFilled } from './ClockFilled';
import { default as ClockOutline } from './ClockOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const ClockIcon: React.FC<IconProps> = ({
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
        <ClockFilled {...props} />
      ) : (
        <ClockOutline {...props} />
      )}
    </div>
  );
};

export default ClockIcon;
