import React from 'react';
import useHover from 'hooks/useHover';
import { default as FilterLinearFilled } from './FilterLinearFilled';
import { default as FilterLinearOutline } from './FilterLinearOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const FilterLinear: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <FilterLinearOutline {...props} />
    </div>
  );
};

export default FilterLinear;
