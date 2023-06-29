import React from 'react';
import useHover from 'hooks/useHover';
import { default as DraftFilled } from './DraftFilled';
import { default as DraftOutline } from './DraftOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const DraftIcon: React.FC<IconProps> = ({
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
        <DraftFilled {...props} />
      ) : (
        <DraftOutline {...props} />
      )}
    </div>
  );
};

export default DraftIcon;
