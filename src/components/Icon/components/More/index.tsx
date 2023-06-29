import React from 'react';
import useHover from 'hooks/useHover';
import { default as MoreFilled } from './MoreFilled';
import { default as MoreOutline } from './MoreOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const MoreIcon: React.FC<IconProps> = ({
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
        <MoreFilled {...props} />
      ) : (
        <MoreOutline {...props} />
      )}
    </div>
  );
};

export default MoreIcon;
