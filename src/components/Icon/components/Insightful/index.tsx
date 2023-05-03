import React from 'react';
import useHover from 'hooks/useHover';
import { default as InsightfulFilled } from './InsightfulFilled';
import { default as InsightfulOutline } from './InsightfulOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const Insightful: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <InsightfulFilled {...props} />
      ) : (
        <InsightfulOutline {...props} />
      )}
    </div>
  );
};

export default Insightful;
