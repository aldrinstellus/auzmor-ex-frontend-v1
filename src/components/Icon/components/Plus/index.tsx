import React from 'react';
import useHover from 'hooks/useHover';
import { default as PlusIcon } from './PlusIcon';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Plus: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <PlusIcon {...props} />
    </div>
  );
};

export default Plus;
