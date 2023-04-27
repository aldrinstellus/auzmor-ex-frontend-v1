import React from 'react';
import useHover from 'hooks/useHover';
import { default as EditFilled } from './EditFilled';
import { default as EditOutline } from './EditOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const EditIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <EditFilled {...props} />
      ) : (
        <EditOutline {...props} />
      )}
    </div>
  );
};

export default EditIcon;
