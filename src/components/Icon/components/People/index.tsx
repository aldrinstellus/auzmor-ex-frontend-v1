import React from 'react';
import useHover from 'hooks/useHover';
import { default as PeopleFilled } from './PeopleFilled';
import { default as PeopleOutline } from './PeopleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
};

const PeopleIcon: React.FC<IconProps> = ({
  hover,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {hover && isHovered ? (
        <PeopleFilled {...props} />
      ) : (
        <PeopleOutline {...props} />
      )}
    </div>
  );
};

export default PeopleIcon;
