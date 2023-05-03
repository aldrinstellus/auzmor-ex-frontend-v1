import useHover from 'hooks/useHover';
import React from 'react';
import SvgDeleteIconOutline from './DeleteIcon';

type IAnalyticsIconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Bookmark: React.FC<IAnalyticsIconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SvgDeleteIconOutline {...props} />
    </div>
  );
};

export default Bookmark;
