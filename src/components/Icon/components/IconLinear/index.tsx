import React from 'react';
import useHover from 'hooks/useHover';
import { default as IconLinearFilled } from './IconLinearFilled';
import { default as IconLinearOutline } from './IconLinearOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const IconLinear: React.FC<IconProps> = ({
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
        <IconLinearFilled {...props} />
      ) : (
        <IconLinearOutline {...props} />
      )}
    </div>
  );
};

export default IconLinear;
