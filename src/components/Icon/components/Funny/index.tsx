import React from 'react';
import useHover from 'hooks/useHover';
import { default as FunnyFilled } from './FunnyFilled';
import { default as FunnyOutline } from './FunnyOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Funny: React.FC<IconProps> = ({
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
        <FunnyFilled {...props} />
      ) : (
        <FunnyOutline {...props} />
      )}
    </div>
  );
};

export default Funny;
