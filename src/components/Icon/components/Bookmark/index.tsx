import useHover from 'hooks/useHover';
import React from 'react';
import { default as BookmarkOutline } from './BookmarkOutline';

type IBookmarkProps = {
  size?: number;
  className?: string;
  isActive?: boolean;
};

const Bookmark: React.FC<IBookmarkProps> = ({
  className = '',
  isActive,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();
  return (
    <div className={className} {...eventHandlers}>
      <BookmarkOutline {...props} isActive={isActive || isHovered} />
    </div>
  );
};

export default Bookmark;
