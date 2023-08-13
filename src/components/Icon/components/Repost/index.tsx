import useHover from 'hooks/useHover';
import React from 'react';
import { default as RepostOutline } from './RepostOutline';
import { default as RepostFilled } from './RepostFilled';

type IRepostProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const Repost: React.FC<IRepostProps> = ({
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
        <RepostFilled {...props} />
      ) : (
        <RepostOutline {...props} />
      )}
    </div>
  );
};

export default Repost;
