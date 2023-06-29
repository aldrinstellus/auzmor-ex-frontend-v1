import React from 'react';
import useHover from 'hooks/useHover';
import { default as BlueLikeFilled } from './BlueLikeFilled';
import { default as BlueLikeOutline } from './BlueLikeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const BlueLike: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <BlueLikeFilled {...props} />
      ) : (
        <BlueLikeOutline {...props} />
      )}
    </div>
  );
};

export default BlueLike;
