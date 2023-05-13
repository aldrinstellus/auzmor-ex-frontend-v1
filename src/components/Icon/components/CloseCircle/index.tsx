import React from 'react';
import useHover from 'hooks/useHover';
import { default as CloseCircleFilled } from './CloseCircleFilled';
import { default as CloseCircleOutline } from './CloseCircleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const CloseCircleIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <CloseCircleFilled {...props} />
      ) : (
        <CloseCircleOutline {...props} />
      )}
    </div>
  );
};

export default CloseCircleIcon;
