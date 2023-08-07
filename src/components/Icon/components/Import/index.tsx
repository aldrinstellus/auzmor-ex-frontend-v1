import React from 'react';
import useHover from 'hooks/useHover';
import { default as ImportFilled } from './ImportFilled';
import { default as ImportOutline } from './ImportOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const ImportIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  disabled,
  isActive,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className}>
      {!disabled && (hover || isActive) ? (
        <ImportFilled {...props} />
      ) : (
        <ImportOutline {...props} />
      )}
    </div>
  );
};

export default ImportIcon;
