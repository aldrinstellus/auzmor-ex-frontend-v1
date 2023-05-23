import React from 'react';
import useHover from 'hooks/useHover';
import { default as ThreeDotsOutline } from './ThreeDotsOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ThreeDots: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
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
