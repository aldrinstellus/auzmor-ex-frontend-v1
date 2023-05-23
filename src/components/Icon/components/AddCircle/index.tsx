import React from 'react';
import useHover from 'hooks/useHover';
import { default as AddCircleFilled } from './AddCircleFilled';
import { default as AddCircleOutline } from './AddCircleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const AddCircle: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <AddCircleFilled {...props} />
      ) : (
        <AddCircleOutline {...props} />
      )}
    </div>
  );
};

export default AddCircle;
