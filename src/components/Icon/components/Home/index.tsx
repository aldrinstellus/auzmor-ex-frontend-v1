import React from 'react';
import { useHover } from '@auzmorui/component-library.hooks.use-hover';
import { default as HomeFilled } from './HomeFilled';
import { default as HomeOutline } from './HomeOutline';

type IconProps = {
  size?: number;
};

const HomeIcon: React.FC<IconProps> = (props) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div {...eventHandlers}>
      {isHovered ? <HomeFilled {...props} /> : <HomeOutline {...props} />}
    </div>
  );
};

export default HomeIcon;
