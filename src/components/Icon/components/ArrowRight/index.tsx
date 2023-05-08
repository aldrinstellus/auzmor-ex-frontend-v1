import React from 'react';
import useHover from 'hooks/useHover';
import { default as ArrowRightFilled } from './ArrowRightFilled';
import { default as ArrowRightOutline } from './ArrowRightOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ArrowRightIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <ArrowRightFilled {...props} />
      ) : (
        <ArrowRightOutline {...props} />
      )}
    </div>
  );
};

export default ArrowRightIcon;
