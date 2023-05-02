import React from 'react';
import useHover from 'hooks/useHover';
import { default as VideoFilled } from './VideoFilled';
import { default as VideoOutline } from './VideoOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const VideoIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <VideoFilled {...props} />
      ) : (
        <VideoOutline {...props} />
      )}
    </div>
  );
};

export default VideoIcon;
