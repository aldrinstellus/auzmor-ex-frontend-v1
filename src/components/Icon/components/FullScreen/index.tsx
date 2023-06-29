import React from 'react';
import useHover from 'hooks/useHover';
import { default as FullScreenFilled } from './FullScreenFilled';
import { default as FullScreenOutline } from './FullScreenOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const FullScreenIcon: React.FC<IconProps> = ({
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
        <FullScreenFilled {...props} />
      ) : (
        <FullScreenOutline {...props} />
      )}
    </div>
  );
};

export default FullScreenIcon;
