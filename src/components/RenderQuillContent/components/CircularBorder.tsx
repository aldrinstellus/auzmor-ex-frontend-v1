import Icon from 'components/Icon';
import { FC, ReactElement } from 'react';

type CircularBorder = {
  name: string;
  className?: string;
  size?: number;
};

const CircularBorder: FC<CircularBorder> = ({
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
