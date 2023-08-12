import React from 'react';
import SvgPromoteUserOutline from './PromoteUserOutline';
import useHover from 'hooks/useHover';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const PromoteUserIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled = true,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SvgPromoteUserOutline {...props} />
    </div>
  );
};

export default PromoteUserIcon;
