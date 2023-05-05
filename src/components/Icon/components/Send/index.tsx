import React from 'react';
import useHover from 'hooks/useHover';
import { default as SendFilled } from './SendFilled';
import { default as SendOutline } from './SendOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Send: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <SendFilled {...props} />
      ) : (
        <SendOutline {...props} />
      )}
    </div>
  );
};

export default Send;
