import React from 'react';
import { default as SortByAcsOutline } from './SortByAcsOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const SortByAcs: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SortByAcsOutline {...props} />
    </div>
  );
};

export default SortByAcs;
