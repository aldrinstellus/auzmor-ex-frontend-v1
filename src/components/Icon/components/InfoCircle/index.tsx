import React from 'react';
import InfoCircleOutline from './InfoCircleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const InfoCircleIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <InfoCircleOutline {...props} />
    </div>
  );
};

export default InfoCircleIcon;
