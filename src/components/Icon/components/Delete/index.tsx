import React from 'react';
import useHover from 'hooks/useHover';
import { default as DeleteFilled } from './DeleteFilled';
import { default as DeleteOutline } from './DeleteOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const DeleteIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <DeleteFilled {...props} />
      ) : (
        <DeleteOutline {...props} />
      )}
    </div>
  );
};

export default DeleteIcon;
