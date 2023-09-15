import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import { Select, ConfigProvider } from 'antd';
import './index.css';

import { SelectCommonPlacement } from 'antd/es/_util/motion';
import Icon from 'components/Icon';

const { Option } = Select;
interface IOptions {
  value: string;
  label: string;
  disabled: boolean;
  dataTestId?: string;
}

export interface ISingleSelectProps {
  name: string;
  defaultValue?: any;
  disabled?: boolean;
  error?: string;
  className?: string;
  selectClassName?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  placeholder?: string;
  height?: number;
  fontSize?: number;
  options: IOptions[];
  menuPlacement: SelectCommonPlacement;
  getPopupContainer?: any;
  noOptionsMessage?: string;
  suffixIcon?: React.ReactNode | null;
  clearIcon?: React.ReactNode | null;
  isClearable?: boolean;
}

const SingleSelect = React.forwardRef(
  (
    {
      name,
      className = '',
      selectClassName = '',
      disabled = false,
      dataTestId = '',
      error,
      control,
      label = '',
      placeholder = '',
      options,
      defaultValue,
      height = 44,
      fontSize = 14,
      menuPlacement = 'bottomLeft',
      getPopupContainer = null,
      noOptionsMessage = 'No options',
      suffixIcon = null,
      clearIcon = null,
      isClearable = false,
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

    const noContentFound = () => (
      <div className="px-6 py-2 text-neutral-500 text-center">
        {noOptionsMessage}
      </div>
    );

    const [open, setOpen] = useState<boolean>(false);

    return (
      <ConfigProvider
        theme={{
          token: {
            controlHeight: height,
            fontSize: fontSize,
            fontFamily: 'Manrope',
          },
        }}
      >
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
                  defaultValue={defaultValue}
                  placement={menuPlacement ? menuPlacement : undefined}
                  popupMatchSelectWidth={false}
                  getPopupContainer={(triggerNode) => {
                    if (getPopupContainer) {
                      return getPopupContainer;
                    }
                    return triggerNode.parentElement;
                  }}
                  {...field}
                  notFoundContent={noContentFound()}
                  onBlur={() => setOpen(false)}
                  onChange={(_, option) => {
                    field.onChange(option);
                  }}
                  onSearch={() => setOpen(true)}
                  className={`single-select ${selectClassName}`}
                  suffixIcon={suffixIcon || <Icon name="arrowDown" size={18} />}
                  clearIcon={clearIcon}
                  ref={ref}
                  allowClear={isClearable}
                >
                  {(options || []).map((option) => (
                    <Option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    >
                      <div data-testid={option.dataTestId}>{option.label}</div>
                    </Option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div
            className={`absolute -bottom-4 text-xs truncate leading-tight ${helpTextStyles}`}
          >
            {error || ' '}
          </div>
        </div>
      </ConfigProvider>
    );
  },
);

SingleSelect.displayName = 'SingleSelect';

export default SingleSelect;
