import React from 'react';
import useHover from 'hooks/useHover';
import { default as LauncherFilled } from './LauncherFilled';
import { default as LauncherOutline } from './LauncherOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const LauncherIcon: React.FC<IconProps> = ({
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
        <LauncherFilled {...props} />
      ) : (
        <LauncherOutline {...props} />
      )}
    </div>
  );
};

export default LauncherIcon;
