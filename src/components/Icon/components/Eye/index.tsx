import React from 'react';
import useHover from 'hooks/useHover';
import { default as EyeFilled } from './EyeFilled';
import { default as EyeOutline } from './EyeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const EyeIcon: React.FC<IconProps> = ({
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
        <EyeFilled {...props} />
      ) : (
        <EyeOutline {...props} />
      )}
    </div>
  );
};

export default EyeIcon;
