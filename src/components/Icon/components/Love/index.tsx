import React from 'react';
import useHover from 'hooks/useHover';
import { default as LoveFilled } from './LoveFilled';
import { default as LoveOutline } from './LoveOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Love: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <LoveFilled {...props} />
      ) : (
        <LoveOutline {...props} />
      )}
    </div>
  );
};

export default Love;
