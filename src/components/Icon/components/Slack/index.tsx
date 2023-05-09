import React from 'react';
import useHover from 'hooks/useHover';
import { default as SlackFilled } from './SlackFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const SlackIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <SlackFilled {...props} />
    </div>
  );
};

export default SlackIcon;
