import { FC, useMemo, useRef } from 'react';
import { Control, useController } from 'react-hook-form';
import clsx from 'clsx';

export type TextAreaProps = {
  defaultValue: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  errorDataTestId?: string;
  helpText?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  name?: string;
  placeholder?: string;
  rows?: number; // visible number of lines
  cols?: number; // visible width
  required?: boolean; // must be filled out
  maxLength?: number; // max character allowed
  readOnly?: boolean; // not edit access
  showCounter?: boolean; // show char counter
  counterPosition?: string;
  disableMaxLength?: boolean;
  autocomplete?: string;
};

const TextArea: FC<TextAreaProps> = ({
  defaultValue = '',
  label = '',
  disabled = false,
  error,
  errorDataTestId,
  helpText,
  className = '',
  dataTestId = '',
  control,
  name = '',
  placeholder = '',
  rows,
  cols,
  required,
  maxLength,
  readOnly,
  showCounter,
  counterPosition = 'bottom',
  disableMaxLength = false,
  autocomplete = 'off',
}) => {
  const { field } = useController({
    name,
    control,
  });

  const textAreaStyle = clsx(
    {
      'focus:border-primary-500 focus:ring-primary-500': !error,
    },
    {
      'bg-red-400 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 bg-white border border-solid px-5 !pt-2 pb-2 focus:outline-none !rounded-19xl':
        true,
    },
    {
      'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-500':
        error,
    },
    {
      [className]: true,
    },
  );

  const labelStyle = useMemo(
    () =>
      clsx(
        {
          '!text-red-500': !!error,
        },
        {
          'text-sm text-neutral-900 font-bold whitespace-nowrap': true,
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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const counterNode = (
    <div className="flex mt-1 w-full justify-end text-xs text-neutral-500">
      {textAreaRef.current?.value.length || defaultValue.length || 0}/
      {maxLength}
    </div>
  );

  return (
    <div className="relative flex flex-col gap-y-1">
      <div className="flex justify-between items-center">
        <div className={labelStyle}>{label}</div>
        {showCounter && counterPosition === 'top' && counterNode}
      </div>
      <textarea
        ref={textAreaRef}
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        cols={cols}
        rows={rows}
        placeholder={placeholder}
        maxLength={disableMaxLength ? undefined : maxLength}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={textAreaStyle}
        data-testid={dataTestId}
        defaultValue={defaultValue}
        autoComplete={autocomplete}
      />
      {showCounter && counterPosition === 'bottom' && counterNode}
      <div
        className={`absolute -bottom-4 text-xs truncate leading-tight ${helpTextStyles}`}
        data-testid={errorDataTestId}
      >
        {error || helpText || ''}
      </div>
    </div>
  );
};

export default TextArea;
