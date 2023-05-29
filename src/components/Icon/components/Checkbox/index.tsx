import React from 'react';
import useHover from 'hooks/useHover';
import { default as CheckboxOutline } from './CheckboxOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Checkbox: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} {...eventHandlers}>
      <CheckboxOutline {...props} />
    </div>
  );
};

export default Checkbox;
