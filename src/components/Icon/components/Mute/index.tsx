import React from 'react';
import useHover from 'hooks/useHover';
import { default as MuteFilled } from './MuteFilled';
import { default as MuteOutline } from './MuteOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const MuteIcon: React.FC<IconProps> = ({
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
        <MuteFilled {...props} />
      ) : (
        <MuteOutline {...props} />
      )}
    </div>
  );
};

export default MuteIcon;
