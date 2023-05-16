import React from 'react';
import useHover from 'hooks/useHover';
import { default as LinkOutline } from './LinkOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Link: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <LinkOutline {...props} />
    </div>
  );
};

export default Link;
