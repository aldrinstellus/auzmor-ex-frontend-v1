import clsx from 'clsx';
import Popover from 'components/Popover';
import { FC, ReactElement, useMemo, useRef, useState } from 'react';
import {
  Control,
  FieldValues,
  UseFormSetValue,
  useController,
} from 'react-hook-form';
import { HEX_REGEX } from 'utils/constants';
import { isDark } from 'utils/misc';

export enum Variant {
  Text = 'TEXT',
  Password = 'PASSWORD',
}

export enum Size {
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
}

export type ColorPickerProps = {
  name: string;
  id?: string;
  variant?: Variant;
  size?: Size;
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
  onEnter?: any;
  customLabelRightElement?: ReactElement;
  maxLength?: number;
  required?: boolean;
  colorPalette?: string[];
  setValue: UseFormSetValue<FieldValues>;
};

const ColorPicker: FC<ColorPickerProps> = ({
  name,
  id,
  variant = Variant.Text,
  size = Size.Medium,
  defaultValue = '#ffffff',
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
  onEnter,
  customLabelRightElement,
  maxLength = 7,
  required = false,
  colorPalette = [
    '#10B981',
    '#9061F9',
    '#FACA15',
    '#E74694',
    '#3F83F8',
    '#737373',
    '#F97316',
  ],
  setValue,
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
          'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500 placeholder-red-500 bg-red-50':
            error,
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
          'w-full rounded-19xl border border-neutral-200 focus:outline-none pl-5':
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

  const isValidHex = (hex: string) => {
    return !!hex && HEX_REGEX.test(hex.toLocaleUpperCase());
  };

  const [lastValidHex, setLastValidHex] = useState(
    isValidHex(field?.value) ? field.value : defaultValue,
  );

  return (
    <div className={`relative ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <div className={labelStyle}>
            {label}
            <span className="text-red-500">{required && '*'}</span>
          </div>
          {customLabelRightElement && customLabelRightElement}
        </div>
      )}
      <label
        className={`flex justify-between flex-1 relative items-center my-1 w-full`}
        htmlFor={id}
      >
        <div className="flex relative items-center w-full">
          <input
            id={id}
            name={field.name}
            type={variant?.toLowerCase()}
            className={`${inputStyles} ${inputClassName}`}
            disabled={loading || disabled}
            placeholder={placeholder}
            data-testid={`${dataTestId}-color-input`}
            defaultValue={defaultValue}
            value={field.value}
            ref={inputRef}
            maxLength={maxLength}
            onChange={(e) => {
              field.onChange(e);
              if (isValidHex(e.target.value)) {
                setLastValidHex(e.target.value);
              }
            }}
            onKeyDown={onEnter}
            onBlur={() => {
              field.onBlur();
              setValue(name, lastValidHex);
            }}
          />
          <Popover
            triggerNode={
              <div
                className="w-4 h-4 rounded-full absolute top-1 right-5 border border-neutral-200"
                style={{ backgroundColor: field.value || defaultValue }}
                data-testid={`${dataTestId}-color-palette`}
              ></div>
            }
            triggerNodeClassName="w-full"
            className="px-4 py-3 rounded-9xl shadow-xl w-[232px] bottom-arrow -right-[87px] bottom-[calc(100%+28px)] mt-[20px]"
            contentRenderer={(close) => {
              return (
                <div className="flex flex-col gap-2">
                  <div
                    className="w-[200px] h-[140px] flex justify-center items-center border rounded-7xl border-neutral-200"
                    style={{ backgroundColor: field.value || defaultValue }}
                  >
                    <p
                      className={`text-2xl font-semibold text-neutral-900 ${
                        isDark(field.value || defaultValue)
                          ? 'text-white'
                          : 'text-neutral-900'
                      }`}
                    >
                      {field.value || defaultValue}
                    </p>
                  </div>
                  <div className="grid grid-cols-5 justify-items-center content-center gap-2">
                    {colorPalette.map((color: string) => (
                      <div
                        className="w-8 h-8 rounded-xl cursor-pointer"
                        style={{ backgroundColor: color }}
                        key={color}
                        onClick={() => {
                          setValue(name, color);
                          setLastValidHex(color);
                          field.onChange(color);
                          close();
                        }}
                        data-testid="palette-select-color"
                      ></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="colorpicker-hex-input"
                      className="flex font-bold text-sm"
                    >
                      <span className="">Title</span>
                    </label>
                    <input
                      className="border border-neutral-200 rounded-7xl px-3 py-2 w-[156px] focus:outline-none"
                      id="colorpicker-hex-input"
                      onFocus={(e) => e.stopPropagation()}
                      maxLength={maxLength}
                      value={field.value}
                      defaultValue={defaultValue}
                      onChange={(e) => {
                        field.onChange(e);
                        if (isValidHex(e.target.value)) {
                          setLastValidHex(e.target.value);
                        }
                      }}
                      onBlur={() => {
                        setValue(name, lastValidHex);
                        field.onBlur();
                      }}
                      data-testid={`${dataTestId}-color-input-popup`}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
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

export default ColorPicker;
