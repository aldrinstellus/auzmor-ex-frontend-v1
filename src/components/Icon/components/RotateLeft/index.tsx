import React from 'react';
import useHover from 'hooks/useHover';
import { default as RotateLeftOutline } from './RotateLeftOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const RotateLeft: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <RotateLeftOutline {...props} />
    </div>
  );
};

export default RotateLeft;
