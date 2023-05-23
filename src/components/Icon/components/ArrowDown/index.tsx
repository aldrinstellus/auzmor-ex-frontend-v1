import React from 'react';
import useHover from 'hooks/useHover';
import { default as ArrowDownOutline } from './ArrowDownOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ArrowDown: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
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
