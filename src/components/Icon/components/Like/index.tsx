import React from 'react';
import useHover from 'hooks/useHover';
import { default as LikeFilled } from './LikeFilled';
import { default as LikeOutline } from './LikeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Like: React.FC<IconProps> = ({
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
        <LikeFilled {...props} />
      ) : (
        <LikeOutline {...props} />
      )}
    </div>
  );
};

export default Like;
