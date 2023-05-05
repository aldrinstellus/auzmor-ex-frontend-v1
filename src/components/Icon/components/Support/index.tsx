import React from 'react';
import useHover from 'hooks/useHover';
import { default as SupportFilled } from './SupportFilled';
import { default as SupportOutline } from './SupportOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Support: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <SupportFilled {...props} />
      ) : (
        <SupportOutline {...props} />
      )}
    </div>
  );
};

export default Support;
