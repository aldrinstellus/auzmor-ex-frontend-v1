import React from 'react';
import useHover from 'hooks/useHover';
import { default as HomeFilled } from './HomeFilled';
import { default as HomeOutline } from './HomeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const HomeIcon: React.FC<IconProps> = ({
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
        <HomeFilled {...props} />
      ) : (
        <HomeOutline {...props} />
      )}
    </div>
  );
};

export default HomeIcon;
