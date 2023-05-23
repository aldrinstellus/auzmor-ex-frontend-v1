import React from 'react';
import useHover from 'hooks/useHover';
import { default as CarouselLeftFilled } from './CarouselLeftFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CarouselLeftIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <CarouselLeftFilled {...props} />
    </div>
  );
};

export default CarouselLeftIcon;
