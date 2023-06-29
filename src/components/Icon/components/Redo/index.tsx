import React from 'react';
import useHover from 'hooks/useHover';
import { default as RedoOutline } from './RedoOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Redo: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <RedoOutline {...props} />
    </div>
  );
};

export default Redo;
