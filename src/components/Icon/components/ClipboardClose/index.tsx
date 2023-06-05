import React from 'react';
import useHover from 'hooks/useHover';
import { default as ClipboardCloseFilled } from './ClipboardCloseFilled';
import { default as ClipboardCloseOutline } from './ClipboardCloseOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ClipboardCloseIcon: React.FC<IconProps> = ({
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
        <ClipboardCloseFilled {...props} />
      ) : (
        <ClipboardCloseOutline {...props} />
      )}
    </div>
  );
};

export default ClipboardCloseIcon;
