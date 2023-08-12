import React from 'react';
import { default as SortByDescOutline } from './SortByDescOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const SortByDesc: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SortByDescOutline {...props} />
    </div>
  );
};

export default SortByDesc;
