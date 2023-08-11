import React from 'react';
import { default as ExpandFilled } from './ExpandFilled';
import { default as ExpandOutline } from './ExpandOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const ExpandIcon: React.FC<IconProps> = ({
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
        <ExpandFilled {...props} />
      ) : (
        <ExpandOutline {...props} />
      )}
    </div>
  );
};

export default ExpandIcon;
