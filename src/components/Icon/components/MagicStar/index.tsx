import React from 'react';
import useHover from 'hooks/useHover';
import { default as MagicStartFilled } from './MagicStarFilled';
import { default as MagicStartOutline } from './MagicStarOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const MagicStarIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <MagicStartFilled {...props} />
      ) : (
        <MagicStartOutline {...props} />
      )}
    </div>
  );
};

export default MagicStarIcon;
