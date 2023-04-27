import React from 'react';
import useHover from 'hooks/useHover';
import { default as ClockFilled } from './ClockFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ClockIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <ClockFilled {...props} />
    </div>
  );
};

export default ClockIcon;
