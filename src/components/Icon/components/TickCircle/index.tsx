import React from 'react';
import useHover from 'hooks/useHover';
import { default as TickCircleFilled } from './TickCircleFilled';
import { default as TickCircleOutline } from './TickCircleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const TickCircleIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <TickCircleFilled {...props} />
      ) : (
        <TickCircleOutline {...props} />
      )}
    </div>
  );
};

export default TickCircleIcon;
