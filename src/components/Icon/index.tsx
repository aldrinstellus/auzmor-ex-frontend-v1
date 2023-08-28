import clsx from 'clsx';
import React from 'react';
import { iconMap } from './iconMap/index';

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: string;
  onClick?: (...param: any) => void | null;
  className?: string;
  hover?: boolean | undefined;
  disabled?: boolean;
  dataTestId?: string;
  isActive?: boolean;
  hoverColor?: string;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  onClick = null,
  className = '',
  hover,
  disabled = false,
  strokeWidth,
  isActive,
  color,
  hoverColor,
  dataTestId,
}) => {
  const Component = iconMap[name] || null;
  if (!Component) {
    return null;
  }

  const colorClass = `${color}`;
  const hoverColorClass = `hover:${hoverColor} group-hover:${hoverColor}`;
  const isActiveClass = `text-primary-500 cursor-pointer`;
  const isActiveHoverColorClass = `${hoverColor}`;
  const disabledClass = `text-neutral-200 cursor-not-allowed pointer-events-none`;

  const styles = clsx({
    'text-neutral-500 hover:text-primary-500 group-hover:text-primary-500 hover:cursor-pointer':
      !disabled,
    'cursor-pointer': !!onClick && !disabled,
    [colorClass]: color && !disabled,
    [hoverColorClass]: hoverColor && !disabled,
    [isActiveClass]: (isActive || hover) && !disabled,
    [isActiveHoverColorClass]: (isActive || hover) && hoverColor && !disabled,
    [disabledClass]: disabled,
    [className]: true,
    'pointer-events-none': hover === false,
  });

  return (
    <Component
      name={name}
      height={size}
      width={size}
      className={styles}
      onClick={!disabled ? onClick : undefined}
      strokeWidth={strokeWidth}
      data-testid={dataTestId}
    />
  );
};

export default Icon;
