import React from 'react';
import { default as GearOutline } from './GearOutline';
import { default as GearFilled } from './GearFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
};

const Gear: React.FC<IconProps> = ({
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
        <GearFilled {...props} />
      ) : (
        <GearOutline {...props} />
      )}
    </div>
  );
};

export default Gear;
