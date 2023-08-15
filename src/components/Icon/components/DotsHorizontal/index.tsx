import React from 'react';
import useHover from 'hooks/useHover';
import SvgDotsHorizontalOutline from './DotsHorizontalOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const dotsHorizontalIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();
  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <SvgDotsHorizontalOutline {...props} />
    </div>
  );
};

export default dotsHorizontalIcon;
