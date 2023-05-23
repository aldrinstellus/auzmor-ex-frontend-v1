import React from 'react';
import useHover from 'hooks/useHover';
import { default as SvgArrowUpOutline } from './ArrowUpOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ArrowUp: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <SvgArrowUpOutline {...props} />
    </div>
  );
};

export default ArrowUp;
