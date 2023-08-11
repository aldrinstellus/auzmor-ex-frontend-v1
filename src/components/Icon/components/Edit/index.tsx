import React from 'react';
import { default as EditFilled } from './EditFilled';
import { default as EditOutline } from './EditOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
};

const EditIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  isActive,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      {!disabled && (hover || isActive) ? (
        <EditFilled {...props} />
      ) : (
        <EditOutline {...props} />
      )}
    </div>
  );
};

export default EditIcon;
