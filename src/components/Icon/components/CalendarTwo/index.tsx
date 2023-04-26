import React from 'react';
import useHover from 'hooks/useHover';
import { default as CalendarFilled } from './CalendarFilledTwo';
import { default as CalendarOutline } from './CalendarOutlineTwo';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const CalendarIconTwo: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <CalendarFilled {...props} />
      ) : (
        <CalendarOutline {...props} />
      )}
    </div>
  );
};

export default CalendarIconTwo;
