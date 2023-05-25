import React from 'react';
import useHover from 'hooks/useHover';
import { default as CallOutline } from './CallOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Call: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <CallOutline {...props} />
    </div>
  );
};

export default Call;
