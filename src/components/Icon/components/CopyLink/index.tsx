import React from 'react';
import useHover from 'hooks/useHover';
import { default as CopyLinkFilled } from './CopyLinkFilled';
import { default as CopyLinkOutline } from './CopyLinkOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const CopyLinkIcon: React.FC<IconProps> = ({
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
        <CopyLinkFilled {...props} />
      ) : (
        <CopyLinkOutline {...props} />
      )}
    </div>
  );
};

export default CopyLinkIcon;
