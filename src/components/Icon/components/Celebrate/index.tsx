import React from 'react';
import useHover from 'hooks/useHover';
import { default as CelebrateFilled } from './CelebrateFilled';
import { default as CelebrateOutline } from './CelebrateOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Celebrate: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <CelebrateFilled {...props} />
      ) : (
        <CelebrateOutline {...props} />
      )}
    </div>
  );
};

export default Celebrate;
