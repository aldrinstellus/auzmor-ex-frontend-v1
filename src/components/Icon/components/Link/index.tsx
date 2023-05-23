import React from 'react';
import useHover from 'hooks/useHover';
import { default as LinkOutline } from './LinkOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Link: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
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
