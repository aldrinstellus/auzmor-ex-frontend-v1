import React from 'react';
import useHover from 'hooks/useHover';
import { default as GearOutline } from './GearOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Gear: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <GearOutline {...props} />
    </div>
  );
};

export default Gear;
