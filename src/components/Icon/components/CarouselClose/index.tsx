import React from 'react';
import useHover from 'hooks/useHover';
import { default as CarouselCloseFilled } from './CarouselCloseFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CarouselCloseIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <CarouselCloseFilled {...props} />
    </div>
  );
};

export default CarouselCloseIcon;
