import React from 'react';
import { default as ZoomOutFilled } from './ZoomOutFilled';
import { default as ZoomOutOutline } from './ZoomOutOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const ZoomOutIcon: React.FC<IconProps> = ({
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
        <ZoomOutFilled {...props} />
      ) : (
        <ZoomOutOutline {...props} />
      )}
    </div>
  );
};

export default ZoomOutIcon;
