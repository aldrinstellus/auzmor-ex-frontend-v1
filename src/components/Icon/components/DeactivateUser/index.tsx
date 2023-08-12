import React from 'react';
import SvgDeactivatedUserOutline from './DeactivateUserOutline';
import useHover from 'hooks/useHover';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const DeactivateUser: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled = true,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SvgDeactivatedUserOutline {...props} />
    </div>
  );
};

export default DeactivateUser;
