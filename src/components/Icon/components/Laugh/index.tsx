import React from 'react';
import useHover from 'hooks/useHover';
import { default as LaughFilled } from './LaughFilled';
import { default as LaughOutline } from './LaughOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Laugh: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <LaughFilled {...props} />
      ) : (
        <LaughOutline {...props} />
      )}
    </div>
  );
};

export default Laugh;
