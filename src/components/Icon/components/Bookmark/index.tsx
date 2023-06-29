import useHover from 'hooks/useHover';
import React from 'react';
import { default as BookmarkOutline } from './BookmarkOutline';
import { default as BookmarkFilled } from './BookmarkFilled';

type IBookmarkProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Bookmark: React.FC<IBookmarkProps> = ({
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
        <BookmarkFilled {...props} />
      ) : (
        <BookmarkOutline {...props} />
      )}
    </div>
  );
};

export default Bookmark;
