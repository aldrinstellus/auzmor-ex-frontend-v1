import React from 'react';
import useHover from 'hooks/useHover';
import { default as CommentFilled } from './CommentFilled';
import { default as CommentOutline } from './CommentOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CommentIcon: React.FC<IconProps> = ({
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
        <CommentFilled {...props} />
      ) : (
        <CommentOutline {...props} />
      )}
    </div>
  );
};

export default CommentIcon;
