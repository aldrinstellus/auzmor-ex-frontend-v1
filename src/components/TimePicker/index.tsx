import clsx from 'clsx';
import Icon from 'components/Icon';
import isDate from 'lodash/isDate';
import { FC, MouseEvent, ReactElement, useMemo, useState } from 'react';
import {
  Control,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetValue,
  useController,
} from 'react-hook-form';
import { padZero } from 'utils/misc';
import { TIME_PATTERN } from 'utils/time';

export enum Variant {
  Text = 'TEXT',
  Password = 'PASSWORD',
}

export enum Size {
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
}

interface TimePickerProps {
  name: string;
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
  getValues: UseFormGetValues<any>;
  minTime: 'now' | Date;
  dateFieldName: string | Date;
  id?: string;
  variant?: Variant;
  size?: Size;
  rightIcon?: string | null;
  rightElement?: ReactElement;
  leftIcon?: string | null;
  defaultValue?: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  dataTestId?: string;
  errorDataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  onLeftIconClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onRightIconClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onEnter?: any;
  customLabelRightElement?: ReactElement;
  isClearable?: boolean;
}

const TimePicker: FC<TimePickerProps> = ({
  name,
  id,
  setValue,
  setError,
  clearErrors,
  getValues,
  minTime,
  dateFieldName,
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

  const [showDropdown, setShowDropdown] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  const getOptions = () => {
    const hours =
      new Date().getHours() + (new Date().getMinutes() >= 30 ? 1 : 0.5);
    const options = [];
    for (let i = hours; i < 24; i += 0.5) {
      options.push(
        `${
          i > 12 ? padZero(Math.floor(i) - 12, 2) : padZero(Math.floor(i), 2)
        }:${i % 1 === 0 ? '00' : '30'} ${i >= 12 ? 'pm' : 'am'}`,
      );
    }
    return options;
  };

  const validateTime = (time: string) => {
    if (!TIME_PATTERN.test(time)) {
      setError(field.name, { message: 'Invalid time. [HH:MM am/pm]' });
      return;
    }
    let hours = parseInt(time.split(' ')[0].split(':')[0]);
    const min = parseInt(time.split(' ')[0].split(':')[1]);
    if (time.indexOf('pm') > -1) {
      hours += 12;
    }
    const inputTime = isDate(dateFieldName)
      ? dateFieldName.setHours(hours, min, 0, 0)
      : new Date(getValues(dateFieldName)).setHours(hours, min, 0, 0);
    let now = new Date().getTime();
    if (minTime !== 'now') {
      now = minTime.getTime();
    }
    if (now > inputTime) {
      setError(field.name, {
        message: 'Invalid time. Time should be greater than now.',
      });
      return;
    }
    clearErrors(field.name);
  };

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
              <Icon name={leftIcon} size={16} />
            </div>
          )}
          <input
            id={id}
            name={field.name}
            type={variant?.toLowerCase()}
            className={inputStyles}
            disabled={loading || disabled}
            placeholder={placeholder}
            data-testid={dataTestId}
            defaultValue={defaultValue}
            value={field.value}
            ref={field.ref}
            onChange={(e) => {
              field.onChange(e);
              validateTime(e.target.value);
            }}
            onKeyDown={onEnter}
            onFocus={() => setOptions(getOptions())}
            onBlur={() => {
              field.onBlur();
              setTimeout(() => setShowDropdown(false), 200);
            }}
            onClick={() => setShowDropdown(true)}
            maxLength={8}
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
        {showDropdown && (
          <div
            className={`w-full flex flex-col absolute shadow bg-white top-14 rounded-xl border border-[#e5e7eb] transition-all ease-in-out duration-300 max-h-64 overflow-y-scroll`}
          >
            {options.map((option: string, index: number) => (
              <div
                key={index}
                className="px-6 py-2 hover:bg-primary-50 cursor-pointer"
                onClick={() => {
                  setValue(field.name, option);
                  setTimeout(() => {
                    setShowDropdown(false);
                  });
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
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

export default TimePicker;
