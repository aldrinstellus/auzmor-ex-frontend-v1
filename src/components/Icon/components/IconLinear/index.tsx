import React from 'react';
import useHover from 'hooks/useHover';
import { default as IconLinearFilled } from './IconLinearFilled';
import { default as IconLinearOutline } from './IconLinearOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const IconLinear: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <IconLinearFilled {...props} />
      ) : (
        <IconLinearOutline {...props} />
      )}
    </div>
  );
};

export default IconLinear;
