import React from 'react';
import { default as NoteFavouriteFilled } from './NoteFavouriteFilled';
import { default as NoteFavouriteOutline } from './NoteFavouriteOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  hoveredStroke?: string;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const NoteFavouriteIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  isActive,
  hoveredStroke,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      {!disabled && (hover || isActive) ? (
        <NoteFavouriteFilled {...props} />
      ) : (
        <NoteFavouriteOutline {...props} />
      )}
    </div>
  );
};

export default NoteFavouriteIcon;
