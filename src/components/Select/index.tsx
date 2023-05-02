import clsx from 'clsx';
import React, { useMemo } from 'react';
import { Control, useController, Controller } from 'react-hook-form';
import Select from 'react-select';

export type SingleSelectProps = {
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  placeholder?: string;
  options: any[];
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  name,
  className = '',
  disabled = false,
  dataTestId = '',
  error,
  control,
  label = '',
  defaultValue = '',
  placeholder = '',
  options,
}) => {
  const { field } = useController({
    name,
    control,
  });

  const labelStyle = useMemo(
    () =>
      clsx(
        {
          '!text-red-500': !!error,
        },
        {
          'text-sm text-neutral-900 font-bold truncate pl-1': true,
        },
      ),
    [error],
  );

  const helpTextStyles = useMemo(
    () =>
      clsx({
        'text-red-500': error,
      }),
    [error],
  );

  const colourStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: '#fff',
      border: '1px solid #E5E5E5',
      borderRadius: '32px',
      padding: '2px 6px',
    }),
  };

  return (
    <div className={`relative ${className}`}>
      <div className={labelStyle}>{label}</div>

      <div className="mt-1">
        <Controller
          name={placeholder}
          control={control}
          rules={{
            required: true,
          }}
          render={() => (
            <Select
              placeholder={placeholder}
              styles={colourStyles}
              options={options}
              components={{
                IndicatorSeparator: () => null,
              }}
              {...field}
            />
          )}
        />
      </div>

      <div
        className={`absolute -bottom-4 text-xs truncate leading-tight ${helpTextStyles}`}
      >
        {error || ' '}
      </div>
    </div>
  );
};
export default SingleSelect;
