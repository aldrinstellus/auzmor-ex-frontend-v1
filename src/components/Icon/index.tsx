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
  disabled?: boolean;
  dataTestId?: string;
  isActive?: boolean;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  onClick = null,
  className = '',
  hover = false,
  fill,
  stroke,
  strokeWidth,
  disabled = false,
  dataTestId,
  isActive,
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
      hover={!disabled && hover}
      onClick={onClick}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      disabled={disabled}
      data-testid={dataTestId}
      isActive={isActive}
    />
  );
};

export default Icon;
