import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import { Select } from 'antd';
import './index.css';
import { SelectCommonPlacement } from 'antd/es/_util/motion';

interface IOptions {
  value: string;
  label: string;
  disabled: boolean;
}
export interface IAsyncSingleSelectProps {
  name: string;
  defaultValue?: any;
  disabled?: boolean;
  error?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  placeholder?: string;
  options: IOptions[];
  menuPlacement: SelectCommonPlacement;
  isLoading?: boolean;
  loadOptions: (
    inputValue: string,
    callBack: (options: IOptions[]) => void,
  ) => Promise<any>;
  noOptionsMessage?: string;
  isClearable?: boolean;
}

const AsyncSingleSelect = React.forwardRef(
  (
    {
      name,
      className = '',
      disabled = false,
      dataTestId = '',
      error,
      control,
      label = '',
      placeholder = '',
      options,
      defaultValue,
      menuPlacement = 'bottomLeft',
      isLoading = false,
      loadOptions,
      noOptionsMessage = 'No options',
      isClearable = false,
    }: IAsyncSingleSelectProps,
    ref?: any,
  ) => {
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

    const [open, setOpen] = useState<boolean>(false);
    const [asyncOptions, setAsyncOptions] = useState<IOptions[]>(options);

    useEffect(() => {
      if (defaultValue.label) {
        loadOptions(defaultValue.label, setAsyncOptions);
      }
    }, []);

    const noContentFound = () => (
      <div className="px-6 py-2 text-neutral-500 text-center">
        {isLoading ? 'Loading...' : noOptionsMessage}
      </div>
    );

    return (
      <div
        className={clsx(
          { [`relative ${className}`]: true },
          { 'pointer-events-none': disabled },
        )}
      >
        <div className={labelStyle}>{label}</div>
        <div
          data-testid={dataTestId}
          onClick={() => {
            if (!disabled) {
              setOpen(!open);
            }
          }}
        >
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={() => (
              <Select
                open={open}
                showSearch
                disabled={disabled}
                placeholder={placeholder}
                options={asyncOptions}
                defaultValue={defaultValue}
                placement={menuPlacement ? menuPlacement : undefined}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .concat(' ')
                    .concat(option?.value ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onSearch={(q) => loadOptions(q, setAsyncOptions)}
                notFoundContent={noContentFound()}
                allowClear={isClearable}
                loading={isLoading}
                {...field}
                onBlur={() => setOpen(false)}
                ref={ref}
                onChange={(_, option) => {
                  field.onChange(option);
                }}
                className="async-single-select"
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
  },
);

AsyncSingleSelect.displayName = 'AsyncSingleSelect';

export default AsyncSingleSelect;
