import React, { MouseEventHandler, ReactElement, useMemo } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { PRIMARY_COLOR } from 'utils/constants';

export enum Variant {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
  Tertiary = 'TERTIARY',
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
  leftIcon?: any; // should accept the react element
  rightIcon?: any; // should accept the string and react element
  className?: string;
  iconFill?: string;
  iconStroke?: string;
  leftIconClassName?: string;
  rightIconClassName?: string;
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
  leftIconClassName,
  rightIconClassName,
  onClick = () => {},
}: ButtonProps) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'items-center bg-primary-500 text-white rounded-16xl hover:bg-primary-600 active:bg-primary-700 disabled:text-neutral-400 disabled:border-none disabled:bg-neutral-200':
            variant === Variant.Primary,
        },
        {
          'items-center text-neutral-900 bg-white border-solid border border-neutral-200 rounded-16xl hover:text-primary-600 active:text-primary-700 disabled:text-neutral-400 disabled:border-none disabled:bg-neutral-200':
            variant === Variant.Secondary,
        },
        {
          'items-center text-neutral-900 bg-white rounded-16xl hover:text-primary-600 active:text-primary-700 disabled:text-neutral-400':
            variant === Variant.Tertiary,
        },
        {
          'py-1 px-4 text-sm': size === Size.Small,
        },
        {
          'py-2 px-4 text-base': size === Size.Medium,
        },
        {
          'py-2.5 px-6 text-base': size === Size.Large,
        },
        {
          'font-manrope font-bold': true,
        },
        {
          [className]: true,
        },
      ),
    [variant, size, className],
  );

  return (
    <button
      type={type.toLowerCase() as any}
      className={styles}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <div>
        {leftIcon && (
          <Icon
            name={leftIcon}
            fill={iconFill}
            stroke={iconStroke}
            className={leftIconClassName}
            size={size === Size.Small ? 16 : 24}
          />
        )}
      </div>
      <div>{label}</div>
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
      {loading && <Spinner className="ml-2" color={PRIMARY_COLOR} />}
    </button>
  );
};

export default Button;
