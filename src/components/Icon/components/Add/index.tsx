import React from 'react';
import useHover from 'hooks/useHover';
import { default as AddFilled } from './AddFilled';
import { default as AddOutline } from './AddOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Add: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <AddFilled {...props} />
      ) : (
        <AddOutline {...props} />
      )}
    </div>
  );
};

export default Add;
