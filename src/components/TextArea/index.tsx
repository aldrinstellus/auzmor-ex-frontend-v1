import React, { useMemo, useRef } from 'react';
import { Control, useController } from 'react-hook-form';
import clsx from 'clsx';

export type TextAreaProps = {
  defaultValue: string;
  label?: string;
  disabled?: boolean;
  error?: string;
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
};

const TextArea: React.FC<TextAreaProps> = ({
  defaultValue = '',
  label = '',
  disabled = false,
  error,
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
}) => {
  const { field } = useController({
    name,
    control,
  });

  const textAreaStyle = clsx(
    {
      'bg-red-400 text-sm font-medium text-neutral-900 bg-white border border-solid rounded-9xl px-5 py-3':
        true,
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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center justify-between">
        <div className={labelStyle}>{label}</div>
        {showCounter && (
          <div className="flex w-full justify-end text-sm text-neutral-500">
            {textAreaRef.current?.value.length || defaultValue.length || 0}/
            {maxLength}
          </div>
        )}
      </div>
      <textarea
        ref={textAreaRef}
        name={field.name}
        onChange={field.onChange}
        onBlur={field.onBlur}
        cols={cols}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={textAreaStyle}
        data-testid={dataTestId}
      >
        {defaultValue}
      </textarea>
    </div>
  );
};

export default TextArea;
