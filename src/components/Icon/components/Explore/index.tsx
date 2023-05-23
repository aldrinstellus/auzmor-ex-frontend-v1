import React from 'react';
import useHover from 'hooks/useHover';
import { default as ExploreFilled } from './ExploreFilled';
import { default as ExploreOutline } from './ExploreOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ExploreIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <ExploreFilled {...props} />
      ) : (
        <ExploreOutline {...props} />
      )}
    </div>
  );
};

export default ExploreIcon;
