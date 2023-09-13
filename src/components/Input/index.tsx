import clsx from 'clsx';
import React, { ReactElement, useMemo, useRef } from 'react';
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
  fieldIcon?: React.ReactNode;
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
  labelClassName?: string;
  dataTestId?: string;
  errorDataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  onLeftIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onRightIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onEnter?: any;
  customLabelRightElement?: ReactElement;
  isClearable?: boolean;
  required?: boolean;
  showCounter?: boolean;
  maxLength?: number;
};

const Input: React.FC<InputProps> = ({
  name,
  id,
  variant = Variant.Text,
  size = Size.Medium,
  rightIcon = null,
  leftIcon = null,
  fieldIcon = null,
  rightElement,
  defaultValue = '',
  placeholder = '',
  loading = false,
  disabled = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
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
  showCounter,
  maxLength,
  required = false,
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
          'bg-neutral-100 text-neutral-400': disabled,
        },
        {
          'w-full h-[44px] rounded-19xl border border-neutral-200 focus:outline-none':
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
          'text-sm text-neutral-900 font-bold': true,
        },
        {
          [labelClassName]: true,
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

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        <div className={labelStyle}>
          {label}
          <span className="text-red-500">{required && '*'}</span>
        </div>
        {showCounter && (
          <div className="text-sm text-neutral-500">
            {inputRef?.current?.value.length || defaultValue.length || 0}/
            {maxLength}
          </div>
        )}
        {customLabelRightElement && customLabelRightElement}
      </div>
      <label
        className={`flex justify-between flex-1 relative items-center my-1 w-full`}
        htmlFor={id}
      >
        <div className="flex relative items-center w-full">
          {leftIcon && (
            <div className="absolute ml-5" onClick={onLeftIconClick}>
              <Icon
                disabled
                name={leftIcon}
                size={16}
                className="text-neutral-500"
              />
            </div>
          )}
          {fieldIcon}
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
            ref={inputRef}
            maxLength={maxLength}
            onChange={field.onChange}
            onKeyDown={onEnter}
            onBlur={field.onBlur}
          />
          {isClearable && !!field.value && (
            <div className="absolute right-2 p-2">
              <Icon
                name="close"
                size={16}
                className="rounded-7xl bg-white"
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
