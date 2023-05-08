import React from 'react';
import useHover from 'hooks/useHover';
import { default as PlayFilled } from './PlayFilled';
import { default as PlayOutline } from './PlayOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const PlayIcon: React.FC<IconProps> = ({
  hover = true,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <PlayFilled {...props} />
      ) : (
        <PlayOutline {...props} />
      )}
    </div>
  );
};

export default PlayIcon;
