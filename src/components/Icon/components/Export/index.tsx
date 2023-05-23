import React from 'react';
import useHover from 'hooks/useHover';
import { default as ExportFilled } from './ExportFilled';
import { default as ExportOutline } from './ExportOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const ExportIcon: React.FC<IconProps> = ({
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
        <ExportFilled {...props} />
      ) : (
        <ExportOutline {...props} />
      )}
    </div>
  );
};

export default ExportIcon;
