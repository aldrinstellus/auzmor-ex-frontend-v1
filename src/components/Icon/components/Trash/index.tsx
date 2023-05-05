import React from 'react';
import useHover from 'hooks/useHover';
import { default as TrashFilled } from './TrashFilled';
import { default as TrashOutline } from './TrashOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Trash: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <TrashFilled {...props} />
      ) : (
        <TrashOutline {...props} />
      )}
    </div>
  );
};

export default Trash;
