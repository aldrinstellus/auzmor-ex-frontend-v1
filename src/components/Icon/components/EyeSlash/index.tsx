import React from 'react';
import useHover from 'hooks/useHover';
import { default as EyeSlashFilled } from './EyeSlashFilled';
import { default as EyeSlashOutline } from './EyeSlashOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const EyeSlashIcon: React.FC<IconProps> = ({
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
        <EyeSlashFilled {...props} />
      ) : (
        <EyeSlashOutline {...props} />
      )}
    </div>
  );
};

export default EyeSlashIcon;
