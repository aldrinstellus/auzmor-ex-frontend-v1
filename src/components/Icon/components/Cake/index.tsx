import useHover from 'hooks/useHover';
import React from 'react';
import SvgCakeOutline from './CakeOutline';

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
      <SvgCakeOutline {...props} />
    </div>
  );
};

export default Bookmark;
