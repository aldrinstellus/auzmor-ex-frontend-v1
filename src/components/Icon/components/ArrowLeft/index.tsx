import React from 'react';
import useHover from 'hooks/useHover';
import { default as ArrowLeftFilled } from './ArrowLeftFilled';
import { default as ArrowLeftOutline } from './ArrowLeftOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ArrowLeftIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <ArrowLeftFilled {...props} />
      ) : (
        <ArrowLeftOutline {...props} />
      )}
    </div>
  );
};

export default ArrowLeftIcon;
