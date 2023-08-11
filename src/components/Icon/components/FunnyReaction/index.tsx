import React from 'react';
import { default as Funny } from './Funny';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const FunnyReaction: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <Funny {...props} />
    </div>
  );
};

export default FunnyReaction;
