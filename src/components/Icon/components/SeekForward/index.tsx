import React from 'react';
import useHover from 'hooks/useHover';
import { default as SeekForwardFilled } from './SeekForwardFilled';
import { default as SeekForwardOutline } from './SeekForwardOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const SeekForwardIcon: React.FC<IconProps> = ({
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
        <SeekForwardFilled {...props} />
      ) : (
        <SeekForwardOutline {...props} />
      )}
    </div>
  );
};

export default SeekForwardIcon;
