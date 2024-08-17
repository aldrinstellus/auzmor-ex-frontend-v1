import clsx from 'clsx';
import { iconMap } from './iconMap/index';
import { FC } from 'react';

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
  tabIndex?: number;
  ariaLabel?: string;
  title?: string;
};

const Icon: FC<IconProps> = ({
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
  tabIndex,
  ariaLabel = 'icon',
  title = '',
}) => {
  const Component = iconMap[name] || null;
  if (!Component) {
    return null;
  }

  const colorClass = `${color}`;
  const hoverColorClass = `hover:${hoverColor} group-hover:${hoverColor} focus:${hoverColor} group-focus:${hoverColor}`;
  const isActiveClass = `text-primary-500 cursor-pointer`;
  const isActiveHoverColorClass = `${hoverColor}`;
  const disabledClass = `text-neutral-200 cursor-not-allowed pointer-events-none`;

  const styles = clsx({
    'outline-none': true,
    [className]: true,
    'text-neutral-500 hover:text-primary-500 group-hover:text-primary-500 focus:text-primary-500 group-focus:text-primary-500 cursor-pointer transition-colors ease-out duration-default':
      !disabled,
    'cursor-pointer': !!onClick && !disabled,
    [colorClass]: color && !disabled,
    [hoverColorClass]: hoverColor && !disabled,
    [isActiveClass]: (isActive || hover) && !disabled,
    [isActiveHoverColorClass]: (isActive || hover) && hoverColor && !disabled,
    [disabledClass]: disabled,
    'pointer-events-none !hover:text-white group-!hover:text-white':
      hover === false,
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
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      title={title}
    />
  );
};

export default Icon;
