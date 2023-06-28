import React from 'react';
import useHover from 'hooks/useHover';
import { default as DeleteCrossFilled } from './DeleteCrossFilled';
import { default as DeleteCrossOutline } from './DeleteCrossOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const DeleteCrossIcon: React.FC<IconProps> = ({
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
        <DeleteCrossFilled {...props} />
      ) : (
        <DeleteCrossOutline {...props} />
      )}
    </div>
  );
};

export default DeleteCrossIcon;
