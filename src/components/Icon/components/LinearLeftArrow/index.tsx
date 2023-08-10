import React from 'react';
import useHover from 'hooks/useHover';
import { default as LinearLeftArrowFilled } from './LinearLeftArrowFilled';
import { default as LinearLeftArrowOutline } from './LinearLeftArrowOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const LinearLeftArrow: React.FC<IconProps> = ({
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
        <LinearLeftArrowFilled {...props} />
      ) : (
        <LinearLeftArrowOutline {...props} />
      )}
    </div>
  );
};

export default LinearLeftArrow;
