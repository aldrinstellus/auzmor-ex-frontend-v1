import React from 'react';
import CyclicArrowOutline from './CyclicArrowOutline';
import CyclicArrowFilled from './CyclicArrowFilled';
import useHover from 'hooks/useHover';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CyclicArrow: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled = true,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <CyclicArrowFilled {...props} />
      ) : (
        <CyclicArrowOutline {...props} />
      )}
    </div>
  );
};

export default CyclicArrow;
