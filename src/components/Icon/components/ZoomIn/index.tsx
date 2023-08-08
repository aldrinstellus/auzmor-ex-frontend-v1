import React from 'react';
import { default as ZoomInFilled } from './ZoomInFilled';
import { default as ZoomInOutline } from './ZoomInOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const ZoomInIcon: React.FC<IconProps> = ({
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
        <ZoomInFilled {...props} />
      ) : (
        <ZoomInOutline {...props} />
      )}
    </div>
  );
};

export default ZoomInIcon;
