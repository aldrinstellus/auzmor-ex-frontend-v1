import React, { MouseEventHandler, ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';
import useHover from 'hooks/useHover';

export enum Variant {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Tertiary = 'TERTIARY',
  Danger = 'DANGER',
}

export enum Size {
  Large = 'LARGE',
  Medium = 'MEDIUM',
  Small = 'SMALL',
}

export enum Type {
  Button = 'BUTTON',
  Reset = 'RESET',
  Submit = 'SUBMIT',
}

export type ButtonProps = {
  label: string | ReactElement;
  variant?: Variant;
  size?: Size;
  type?: Type;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<Element>;
  leftIconSize?: number;
  leftIcon?: any; // should accept the react element
  rightIcon?: any; // should accept the string and react element
  className?: string;
  iconFill?: string;
  iconStroke?: string;
  leftIconClassName?: string;
  rightIconClassName?: string;
  labelClassName?: string;
  dataTestId?: string;
  active?: boolean;
};

const Button = ({
  variant = Variant.Primary,
  size = Size.Medium,
  type = Type.Button,
  disabled = false,
  loading = false,
  label = 'Click Me!',
  leftIcon = '',
  rightIcon = '',
  className = '',
  iconFill,
  iconStroke,
  leftIconSize,
  leftIconClassName,
  rightIconClassName,
  onClick = () => {},
  labelClassName = '',
  dataTestId = '',
  active = false,
}: ButtonProps) => {
  const [hovered, hoverEvents] = useHover();

  const styles = useMemo(
    () =>
      clsx(
        {
          'flex justify-center items-center bg-primary-500 text-white rounded-16xl hover:bg-primary-600 active:bg-primary-700 disabled:text-neutral-400 disabled:border-none disabled:bg-neutral-200':
            variant === Variant.Primary,
        },
        {
          'flex justify-center items-center text-neutral-900 bg-white border-solid border border-neutral-200 rounded-16xl hover:text-primary-600 active:text-primary-700 disabled:text-neutral-400 disabled:border-none disabled:bg-neutral-200':
            variant === Variant.Secondary,
        },
        {
          'flex justify-center items-center text-neutral-900 bg-white rounded-16xl hover:text-primary-600 active:text-primary-700 disabled:text-neutral-400':
            variant === Variant.Tertiary,
        },
        {
          'flex justify-center items-center bg-red-500 text-white rounded-16xl hover:bg-red-600 active:bg-red-700 disabled:text-neutral-400 disabled:border-none disabled:bg-neutral-200':
            variant === Variant.Danger,
        },
        {
          'py-2 px-4 text-sm': size === Size.Small,
        },
        {
          'py-2 px-4 text-base': size === Size.Medium,
        },
        {
          'py-2.5 px-6 text-base': size === Size.Large,
        },
        {
          'font-manrope font-bold transition-colors ease-out duration-default':
            true,
        },
        {
          '!text-primary-500 !bg-primary-50 !border-primary-600': active,
        },
        {
          [className]: true,
        },
      ),
    [variant, size, className, active],
  );

  return (
    <button
      type={type.toLowerCase() as any}
      className={styles}
      disabled={disabled || loading}
      onClick={onClick}
      data-testId={dataTestId}
      {...hoverEvents}
    >
      <div>
        {leftIcon && (
          <Icon
            name={leftIcon}
            fill={iconFill}
            stroke={iconStroke}
            className={leftIconClassName}
            size={leftIconSize || (size === Size.Small ? 16 : 24)}
            hover={hovered}
          />
        )}
      </div>
      <div className={labelClassName}>{label}</div>
      <div>
        {rightIcon && (
          <Icon
            name={rightIcon}
            fill={iconFill}
            stroke={iconStroke}
            className={rightIconClassName}
            size={size === Size.Small ? 16 : 24}
          />
        )}
      </div>
      {loading && <Spinner />}
    </button>
  );
};

export default Button;
