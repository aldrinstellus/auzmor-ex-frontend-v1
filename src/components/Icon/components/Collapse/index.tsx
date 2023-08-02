import React from 'react';
import { default as CollapseFilled } from './CollapseFilled';
import { default as CollapseOutline } from './CollapseOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const CollapseIcon: React.FC<IconProps> = ({
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
        <CollapseFilled {...props} />
      ) : (
        <CollapseOutline {...props} />
      )}
    </div>
  );
};

export default CollapseIcon;
