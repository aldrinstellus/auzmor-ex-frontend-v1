import React from 'react';
import useHover from 'hooks/useHover';
import { default as DropdownArrowFilled } from './DropdownArrowFilled';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const DropdownArrowIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <DropdownArrowFilled {...props} />
    </div>
  );
};

export default DropdownArrowIcon;
