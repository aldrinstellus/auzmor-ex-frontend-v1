import React, { MouseEventHandler, ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';

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
  ExtraSmall = 'EXTRA_SMALL',
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
  rightIconSize?: number;
  leftIcon?: any; // should accept the react element
  rightIcon?: any; // should accept the string and react element
  className?: string;
  iconColor?: string;
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
  iconColor,
  leftIconSize,
  rightIconSize,
  leftIconClassName,
  rightIconClassName,
  onClick = () => {},
  labelClassName = '',
  dataTestId = '',
  active = false,
}: ButtonProps) => {
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
          'py-1.5 px-3 text-xs': size === Size.ExtraSmall,
        },
        {
          'font-manrope font-bold transition-colors ease-out duration-default group':
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
      data-testid={dataTestId}
    >
      <div>
        {leftIcon && (
          <Icon
            name={leftIcon}
            color={iconColor}
            className={leftIconClassName}
            disabled={disabled || loading}
            size={leftIconSize || (size === Size.Small ? 16 : 24)}
            isActive={active}
          />
        )}
      </div>
      <div className={labelClassName}>{label}</div>
      <div>
        {rightIcon && (
          <Icon
            name={rightIcon}
            color={iconColor}
            className={rightIconClassName}
            disabled={disabled || loading}
            size={rightIconSize || (size === Size.Small ? 16 : 24)}
            isActive={active}
          />
        )}
      </div>
      {loading && <Spinner />}
    </button>
  );
};

export default Button;
