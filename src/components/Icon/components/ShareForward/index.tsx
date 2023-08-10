import React from 'react';
import useHover from 'hooks/useHover';
import { default as ShareForwardFilled } from './ShareForwardFilled';
import { default as ShareForwardOutline } from './ShareForwardOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ShareForward: React.FC<IconProps> = ({
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
        <ShareForwardFilled {...props} />
      ) : (
        <ShareForwardOutline {...props} />
      )}
    </div>
  );
};

export default ShareForward;
