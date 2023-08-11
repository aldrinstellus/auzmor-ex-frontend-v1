import React from 'react';
import useHover from 'hooks/useHover';
import { default as Like } from './Like';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const LikeReaction: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <Like {...props} />
    </div>
  );
};

export default LikeReaction;
