import React from 'react';
import useHover from 'hooks/useHover';
import { default as MinusIcon } from './MinusIcon';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Minus: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <MinusIcon {...props} />
    </div>
  );
};

export default Minus;
