import React from 'react';
import { default as FocusFilled } from './FocusFilled';
import { default as FocusOutline } from './FocusOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const FocusIcon: React.FC<IconProps> = ({
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
        <FocusFilled {...props} />
      ) : (
        <FocusOutline {...props} />
      )}
    </div>
  );
};

export default FocusIcon;
