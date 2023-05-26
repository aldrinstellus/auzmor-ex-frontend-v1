import React from 'react';
import useHover from 'hooks/useHover';
import { default as ReorderOutline } from './ReorderOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Reorder: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <ReorderOutline {...props} />
    </div>
  );
};

export default Reorder;
