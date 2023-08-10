import clsx from 'clsx';
import React, { ReactElement, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';
import Icon from 'components/Icon';

export enum Variant {
  Text = 'TEXT',
  Password = 'PASSWORD',
}

export enum Size {
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
}

export type InputProps = {
  name: string;
  id?: string;
  variant?: Variant;
  size?: Size;
  rightIcon?: string;
  rightElement?: ReactElement;
  leftIcon?: string;
  defaultValue?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  inputClassName?: string;
  dataTestId?: string;
  errorDataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  onLeftIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onRightIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onEnter?: any;
  customLabelRightElement?: ReactElement;
  isClearable?: boolean;
};

const Input: React.FC<InputProps> = ({
  name,
  id,
  variant = Variant.Text,
  size = Size.Medium,
  rightIcon = null,
  leftIcon = null,
  rightElement,
  defaultValue = '',
  placeholder = '',
  loading = false,
  disabled = false,
  className = '',
  inputClassName = '',
  dataTestId = '',
  errorDataTestId = '',
  error,
  helpText,
  control,
  label,
  onLeftIconClick,
  onRightIconClick,
  onEnter,
  customLabelRightElement,
  isClearable = false,
}) => {
  const { field } = useController({
    name,
    control,
  });

  const inputStyles = useMemo(
    () =>
      clsx(
        {
          'focus:border-primary-500 focus:ring-primary-500': !error,
        },
        {
          'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500':
            error,
        },
        {
          'pl-5': !leftIcon,
        },
        {
          'pl-11': leftIcon,
        },
        {
          'pr-5': !rightIcon,
        },
        {
          'pr-11': rightIcon,
        },
        {
          'py-2': size === Size.Small,
        },
        {
          'py-2.5': size === Size.Medium,
        },
        {
          'py-3': size === Size.Large,
        },
        {
          'bg-neutral-100': disabled,
        },
        {
          'w-full rounded-19xl border border-neutral-200 focus:outline-none':
            true,
        },
      ),
    [error, size],
  );

  const labelStyle = useMemo(
    () =>
      clsx(
        {
          '!text-red-500': !!error,
        },
        {
          'text-sm text-neutral-900 font-bold truncate': true,
        },
      ),
    [error],
  );

  const helpTextStyles = useMemo(
    () =>
      clsx(
        {
          'text-red-500': error,
        },
        { 'text-neutral-500': helpText },
      ),
    [error, helpText],
  );

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        <div className={labelStyle}>{label}</div>
        {customLabelRightElement}
      </div>
      <label
        className={`flex justify-between flex-1 relative items-center my-1 w-full`}
        htmlFor={id}
      >
        <div className="flex relative items-center w-full">
          {leftIcon && (
            <div className="absolute ml-5" onClick={onLeftIconClick}>
              <Icon disabled name={leftIcon} size={16} />
            </div>
          )}
          <input
            id={id}
            name={field.name}
            type={variant?.toLowerCase()}
            className={`${inputStyles} ${inputClassName}`}
            disabled={loading || disabled}
            placeholder={placeholder}
            data-testid={dataTestId}
            defaultValue={defaultValue}
            value={field.value}
            ref={field.ref}
            onChange={field.onChange}
            onKeyDown={onEnter}
            onBlur={field.onBlur}
          />
          {isClearable && !!field.value && (
            <div className="absolute right-2">
              <Icon
                name="close"
                size={16}
                className="p-2 rounded-7xl bg-white"
                onClick={() => field.onChange('')}
              />
            </div>
          )}
        </div>
        {rightIcon && (
          <div className="absolute right-5" onClick={onRightIconClick}>
            <Icon name={rightIcon} size={16} />
          </div>
        )}
        {rightElement && (
          <div
            className={`absolute right-0 border border-solid border-neutral-200 rounded-19xl bg-blue-50 py-3 px-5 ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500'
                : ''
            }`}
          >
            {rightElement}
          </div>
        )}
      </label>
      <div
        className={`absolute -bottom-4 text-xs truncate leading-tight ${helpTextStyles}`}
        data-testid={errorDataTestId}
      >
        {error || helpText || ' '}
      </div>
    </div>
  );
};

export default Input;
