import React from 'react';
import useHover from 'hooks/useHover';
import { default as ChartFilled } from './ChartFilled';
import { default as ChartOutline } from './ChartOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ChartIcon: React.FC<IconProps> = ({
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
        <ChartFilled {...props} />
      ) : (
        <ChartOutline {...props} />
      )}
    </div>
  );
};

export default ChartIcon;
