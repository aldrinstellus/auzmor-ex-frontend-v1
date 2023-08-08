import React from 'react';
import { default as Celebration } from './Celebration';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CelebrateReaction: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <Celebration {...props} />
    </div>
  );
};

export default CelebrateReaction;
