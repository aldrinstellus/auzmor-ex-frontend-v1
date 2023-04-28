import React from 'react';
import useHover from 'hooks/useHover';
import { default as FeedFilled } from './FeedFilled';
import { default as FeedOutline } from './FeedOutline';

type IconProps = {
  size?: number;
  fill?: string;
};

const FeedIcon: React.FC<IconProps> = (props) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div {...eventHandlers}>
      {isHovered ? <FeedFilled {...props} /> : <FeedOutline {...props} />}
    </div>
  );
};

export default FeedIcon;
