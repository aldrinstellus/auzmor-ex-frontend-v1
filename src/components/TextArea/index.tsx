import React, { ReactElement } from 'react';
import { Control, Controller, useController } from 'react-hook-form';
import clsx from 'clsx';

export type TextAreaProps = {
  defaultValue: string;
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

  return (
    <>
      <textarea
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
    </>
  );
};

export default TextArea;
