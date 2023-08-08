import React from 'react';
import useHover from 'hooks/useHover';
import { default as GlobalFilled } from './GlobalFilled';
import { default as GlobalOutline } from './GlobalOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Global: React.FC<IconProps> = ({
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
        <GlobalFilled {...props} />
      ) : (
        <GlobalOutline {...props} />
      )}
    </div>
  );
};

export default Global;
