import React from 'react';
import useHover from 'hooks/useHover';
import { default as PauseFilled } from './PauseFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const PauseIcon: React.FC<IconProps> = ({
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
        <PauseFilled {...props} />
      ) : (
        <PauseFilled {...props} />
      )}
    </div>
  );
};

export default PauseIcon;
