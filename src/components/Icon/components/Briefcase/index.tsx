import useHover from 'hooks/useHover';
import React from 'react';
import SvgBriefcaseOutline from './BriefcaseFilled';

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
      <SvgBriefcaseOutline {...props} />
    </div>
  );
};

export default Bookmark;
