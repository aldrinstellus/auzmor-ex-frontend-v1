import React, { MouseEventHandler, useMemo } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';

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
  label: string;
  variant?: Variant;
  size?: Size;
  type?: Type;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<Element>;
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
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
      {leftIcon && <Icon name={leftIcon} />}
      {label}
      {rightIcon && <Icon name={rightIcon} />}
    </button>
  );
};

export default Button;
