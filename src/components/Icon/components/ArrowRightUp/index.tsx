import React from 'react';
import useHover from 'hooks/useHover';
import { default as ArrowRightUpFilled } from './ArrowRightUpFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ArrowRightUp: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <ArrowRightUpFilled {...props} />
    </div>
  );
};

export default ArrowRightUp;
