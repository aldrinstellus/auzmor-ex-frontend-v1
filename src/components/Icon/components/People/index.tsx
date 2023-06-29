import React from 'react';
import useHover from 'hooks/useHover';
import { default as PeopleFilled } from './PeopleFilled';
import { default as PeopleOutline } from './PeopleOutline';

type IconProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const PeopleIcon: React.FC<IconProps> = ({
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
        <PeopleFilled {...props} />
      ) : (
        <PeopleOutline {...props} />
      )}
    </div>
  );
};

export default PeopleIcon;
