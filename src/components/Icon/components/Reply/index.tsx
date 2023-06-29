import React from 'react';
import useHover from 'hooks/useHover';
import { default as ReplyFilled } from './ReplyFilled';
import { default as ReplyOutline } from './ReplyOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Reply: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <ReplyFilled {...props} />
      ) : (
        <ReplyOutline {...props} />
      )}
    </div>
  );
};

export default Reply;
