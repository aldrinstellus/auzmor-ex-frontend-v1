import React from 'react';
import useHover from 'hooks/useHover';
import { default as CloseFilled } from './CloseFilled';
import { default as CloseOutline } from './CloseOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  dataTestId?: string;
  onClick?: () => void;
};

const CloseIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  dataTestId,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div
      onClick={onClick}
      className={className}
      {...eventHandlers}
      data-testid={dataTestId}
    >
      {!disabled && (hover || isHovered) ? (
        <CloseFilled {...props} />
      ) : (
        <CloseOutline {...props} />
      )}
    </div>
  );
};

export default CloseIcon;
