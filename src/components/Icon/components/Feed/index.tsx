import React from 'react';
import useHover from 'hooks/useHover';
import { default as FeedFilled } from './FeedFilled';
import { default as FeedOutline } from './FeedOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const FeedIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  isActive,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      {!disabled && (hover || isActive) ? (
        <FeedFilled {...props} />
      ) : (
        <FeedOutline {...props} />
      )}
    </div>
  );
};

export default FeedIcon;
