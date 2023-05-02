import React from 'react';
import useHover from 'hooks/useHover';
import { default as ConvertShapeFilled } from './ConvertShapeFilled';
import { default as ConvertShapeOutline } from './ConvertShapeOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const ConvertShape: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <ConvertShapeFilled {...props} />
      ) : (
        <ConvertShapeOutline {...props} />
      )}
    </div>
  );
};

export default ConvertShape;
