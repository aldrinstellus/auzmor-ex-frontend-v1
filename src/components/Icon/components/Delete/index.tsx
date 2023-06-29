import React from 'react';
import useHover from 'hooks/useHover';
import { default as DeleteFilled } from './DeleteFilled';
import { default as DeleteOutline } from './DeleteOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const DeleteIcon: React.FC<IconProps> = ({
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
        <DeleteFilled {...props} />
      ) : (
        <DeleteOutline {...props} />
      )}
    </div>
  );
};

export default DeleteIcon;
