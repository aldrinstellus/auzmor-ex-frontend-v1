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
  isActive?: boolean;
};

const ExportIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  isActive,
  ...props
}) => {
  return (
    <div onClick={onClick} className={className}>
      {!disabled && (hover || isActive) ? (
        <ExportFilled {...props} />
      ) : (
        <ExportOutline {...props} />
      )}
    </div>
  );
};

export default ExportIcon;
