import useHover from 'hooks/useHover';
import React from 'react';
import SvgLocationOutline from './LocationFilled';

type ILocationProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Location: React.FC<ILocationProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      <SvgLocationOutline {...props} />
    </div>
  );
};

export default Location;
