import React from 'react';
import useHover from 'hooks/useHover';
import { default as CopyFilled } from './CopyFilled';
import { default as CopyOutline } from './CopyOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CopyIcon: React.FC<IconProps> = ({
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
        <CopyFilled {...props} />
      ) : (
        <CopyOutline {...props} />
      )}
    </div>
  );
};

export default CopyIcon;
