import React from 'react';
import useHover from 'hooks/useHover';
import { default as BlueLikeFilled } from './BlueLikeFilled';
import { default as BlueLikeOutline } from './BlueLikeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const BlueLike: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <BlueLikeFilled {...props} />
      ) : (
        <BlueLikeOutline {...props} />
      )}
    </div>
  );
};

export default BlueLike;
