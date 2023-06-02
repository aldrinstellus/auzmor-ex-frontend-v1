import Icon from 'components/Icon';
import React, { ReactElement } from 'react';

type CircularBorder = {
  name: string;
  className?: string;
  size?: number;
};

const CircularBorder: React.FC<CircularBorder> = ({
  name,
  className,
  size,
}): ReactElement => {
  return (
    <div className="border border-gray-300 rounded-full">
      <Icon className={className} name={name} size={size} />
    </div>
  );
};

export default CircularBorder;
