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
  hoveredStroke?: string;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  onClick = null,
  className = '',
  hover = false,
  fill = 'none',
  stroke,
  strokeWidth,
  disabled = false,
  dataTestId,
  isActive,
  hoveredStroke,
}) => {
  const Component = iconMap[name] || null;
  if (!Component) {
    return null;
  }

  const strokeClass = `text-[${stroke}]`;
  const hoveredStrokeClass = `hover:text-[${hoveredStroke}] group-hover:text-[${hoveredStroke}]`;
  const isActiveClass = `text-primary-500 cursor-pointer`;
  const isActiveHoveredStrokeClass = `text-[${hoveredStroke}]`;
  const disabledClass = `text-neutral-200 cursor-not-allowed pointer-events-none`;

  const styles = clsx({
    'text-neutral-500 hover:text-primary-500 group-hover:text-primary-500 hover:cursor-pointer':
      !disabled,
    'cursor-pointer': !!onClick && !disabled,
    [strokeClass]: stroke && !disabled,
    [hoveredStrokeClass]: hoveredStroke && !disabled,
    [isActiveClass]: (isActive || hover) && !disabled,
    [isActiveHoveredStrokeClass]:
      (isActive || hover) && hoveredStroke && !disabled,
    [disabledClass]: disabled,
    [className]: true,
  });

  return (
    <Component
      name={name}
      height={size}
      width={size}
      className={styles}
      onClick={!disabled ? onClick : undefined}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      data-testid={dataTestId}
    />
  );
};

export default Icon;
