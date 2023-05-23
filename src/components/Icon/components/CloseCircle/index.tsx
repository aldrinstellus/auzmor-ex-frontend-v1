import React from 'react';
import useHover from 'hooks/useHover';
import { default as CloseCircleFilled } from './CloseCircleFilled';
import { default as CloseCircleOutline } from './CloseCircleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CloseCircleIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      <CloseCircleOutline {...props} />
    </div>
  );
};

export default CloseCircleIcon;
