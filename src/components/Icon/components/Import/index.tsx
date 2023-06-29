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
};

const ImportIcon: React.FC<IconProps> = ({
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
        <ImportFilled {...props} />
      ) : (
        <ImportOutline {...props} />
      )}
    </div>
  );
};

export default ImportIcon;
