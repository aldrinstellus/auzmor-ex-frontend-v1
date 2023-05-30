import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import Select, { MenuPlacement } from 'react-select';
import { twConfig } from 'utils/misc';

export interface ISingleSelectProps {
  name: string;
  defaultValue?: any;
  disabled?: boolean;
  error?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  placeholder?: string;
  height?: string;
  options: any;
  menuPlacement: MenuPlacement;
}

const SingleSelect: React.FC<ISingleSelectProps> = ({
  name,
  className = '',
  disabled = false,
  dataTestId = '',
  error,
  control,
  label = '',
  placeholder = '',
  height = '44px',
  options,
  defaultValue,
  menuPlacement = 'bottom',
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
          'text-sm text-neutral-900 font-bold truncate pl-1 mb-1': !!label,
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

  const selectStyle = {
    control: (styles: any) => {
      return {
        ...styles,
        backgroundColor: '#fff',
        border: '1px solid #E5E5E5',
        borderRadius: '32px',
        height,
        padding: '0px 6px', // change style here because it breaking 2px
        '&:hover': { borderColor: twConfig.theme.colors.primary['600'] },
        borderColor: twConfig.theme.colors.primary['500'],
        boxShadow: styles.boxShadow
          ? `0 0 0 1px ${twConfig.theme.colors.primary['500']}`
          : undefined,
      };
    },
  };

  return (
    <div className={`relative ${className}`}>
      <div className={labelStyle}>{label}</div>
      <div>
        {/* remove top margin provide it to parent div if required */}
        <Controller
          name={name}
          control={control}
          rules={{
            required: true,
          }}
          render={() => (
            <Select
              isDisabled={disabled}
              placeholder={placeholder}
              styles={selectStyle}
              options={options}
              {...field}
              defaultValue={defaultValue}
              menuPlacement={menuPlacement ? menuPlacement : undefined}
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
