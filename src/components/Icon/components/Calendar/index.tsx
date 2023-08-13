import React from 'react';
import useHover from 'hooks/useHover';
import { default as CalendarFilled } from './CalendarFilled';
import { default as CalendarOutline } from './CalendarOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Calendar: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <CalendarFilled {...props} />
      ) : (
        <CalendarOutline {...props} />
      )}
    </div>
  );
};

export default Calendar;
