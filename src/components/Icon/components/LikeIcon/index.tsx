import React from 'react';
import useHover from 'hooks/useHover';
import { default as LikeIconFilled } from './LikeIconFilled';
import { default as LikeIconOutline } from './LikeIconOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const LikeIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <LikeIconFilled {...props} />
      ) : (
        <LikeIconOutline {...props} />
      )}
    </div>
  );
};

export default LikeIcon;
