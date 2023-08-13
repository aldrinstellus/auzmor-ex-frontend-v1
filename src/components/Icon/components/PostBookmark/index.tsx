import React from 'react';
import useHover from 'hooks/useHover';
import { default as PostBookmarkFilled } from './PostBookmarkFilled';
import { default as PostBookmarkOutline } from './PostBookmarkOutline';

type IconProps = {
  size?: number;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
};

const PostBookmarkIcon: React.FC<IconProps> = ({
  onClick,
  className = '',
  isActive,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      {isActive ? (
        <PostBookmarkFilled {...props} />
      ) : (
        <PostBookmarkOutline {...props} />
      )}
    </div>
  );
};

export default PostBookmarkIcon;
