import React from 'react';
import useHover from 'hooks/useHover';
import { default as FilterFilled } from './FilterFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const FilterIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <FilterFilled {...props} />
    </div>
  );
};

export default FilterIcon;
