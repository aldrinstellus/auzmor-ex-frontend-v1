import useHover from 'hooks/useHover';
import React from 'react';
import SvgBookmarkOutline from './BookmarkOutline';

type IBookmarkProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Bookmark: React.FC<IBookmarkProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SvgBookmarkOutline {...props} />
    </div>
  );
};

export default Bookmark;
