import useHover from 'hooks/useHover';
import React from 'react';
import SvgCopyOutline from './CopyOutline';

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
  return (
    <div onClick={onClick} className={className}>
      <SvgCopyOutline {...props} />
    </div>
  );
};

export default Bookmark;
