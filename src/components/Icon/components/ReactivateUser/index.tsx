import React from 'react';
import SvgReactivatedUserOutline from './ReactivateUserOutline';
import useHover from 'hooks/useHover';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ReactivateUser: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled = true,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SvgReactivatedUserOutline {...props} />
    </div>
  );
};

export default ReactivateUser;
