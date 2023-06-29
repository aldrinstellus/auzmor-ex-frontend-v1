import React from 'react';
import useHover from 'hooks/useHover';
import { default as ArrowSwapFilled } from './ArrowSwapFilled';
import { default as ArrowSwapOutline } from './ArrowSwapOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ArrowSwap: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <ArrowSwapOutline {...props} />
    </div>
  );
};

export default ArrowSwap;
