import React from 'react';
import useHover from 'hooks/useHover';
import { default as ArrowDownOutline } from './ArrowDownOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ArrowDown: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <ArrowDownOutline {...props} />
    </div>
  );
};

export default ArrowDown;
