import React, { useMemo, useRef, useState } from 'react';
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
  options: IOptions[];
  menuPlacement: SelectCommonPlacement;
}

const SingleSelect = React.forwardRef(
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
    }: ISingleSelectProps,
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
          {
            '!text-gray-400': disabled,
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

    return (
      <div
        className={clsx(
          { [`relative ${className}`]: true },
          { 'cursor-not-allowed': disabled },
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
                options={options}
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
                {...field}
                onBlur={() => setOpen(false)}
                onChange={(_, option) => {
                  field.onChange(option);
                }}
                className="single-select"
                ref={ref}
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

SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
