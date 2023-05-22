import React from 'react';
import useHover from 'hooks/useHover';
import { default as ThreeDotsOutline } from './ThreeDotsOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ThreeDots: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <ThreeDotsOutline {...props} />
    </div>
  );
};

export default ThreeDots;
