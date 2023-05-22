import clsx from 'clsx';
import React from 'react';
import { iconMap } from './iconMap/index';

export type IconProps = {
  name: string;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  onClick?: (...param: any) => void | null;
  className?: string;
  hover?: boolean;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  onClick = null,
  className = '',
  hover = true,
  fill,
  stroke,
  strokeWidth,
}) => {
  const Component = iconMap[name] || null;
  if (!Component) {
    return null;
  }

  const styles = clsx({ 'cursor-pointer': !!onClick, [className]: true });

  return (
    <Component
      name={name}
      size={size}
      className={styles}
      hover={hover}
      onClick={onClick}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

export default Icon;
