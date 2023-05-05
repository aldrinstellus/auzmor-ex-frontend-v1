import React from 'react';
import CrossCircleOutline from './CrossCircleOutline';
import CrossCircleFilled from './CrossCircleFilled';
import useHover from 'hooks/useHover';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const CrossCircle: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <CrossCircleFilled {...props} />
      ) : (
        <CrossCircleOutline {...props} />
      )}
    </div>
  );
};

export default CrossCircle;
