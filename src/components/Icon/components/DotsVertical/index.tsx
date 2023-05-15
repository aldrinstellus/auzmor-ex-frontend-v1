import React from 'react';
import useHover from 'hooks/useHover';
import { default as DotVerticalOutline } from './DotsVerticalOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const dotsVerticalIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();
  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <DotVerticalOutline {...props} />
    </div>
  );
};

export default dotsVerticalIcon;
