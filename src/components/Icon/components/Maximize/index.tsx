import React from 'react';
import useHover from 'hooks/useHover';
import { default as MaximizeFilled } from './MaximizeFilled';
import { default as MaximizeOutline } from './MaximizeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const MaximizeIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <MaximizeFilled {...props} />
      ) : (
        <MaximizeOutline {...props} />
      )}
    </div>
  );
};

export default MaximizeIcon;
