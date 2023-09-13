import React, { useEffect, useMemo, useState } from 'react';
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
  height?: number;
  fontSize?: number;
  getPopupContainer?: any;
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
      height = 44,
      fontSize = 14,
      getPopupContainer = null,
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
      if (defaultValue?.label) {
        loadOptions(defaultValue.label, setAsyncOptions);
      }
    }, []);

    const noContentFound = () => (
      <div className="px-6 py-2 text-neutral-500 text-center">
        {isLoading ? 'Loading...' : noOptionsMessage}
      </div>
    );

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
                  defaultValue={defaultValue}
                  placement={menuPlacement ? menuPlacement : undefined}
                  getPopupContainer={(triggerNode) => {
                    if (getPopupContainer) {
                      return getPopupContainer;
                    }
                    return triggerNode.parentElement;
                  }}
                  onSearch={(q) => loadOptions(q, setAsyncOptions)}
                  notFoundContent={noContentFound()}
                  onInputKeyDown={() => setOpen(true)}
                  allowClear={isClearable}
                  loading={isLoading}
                  {...field}
                  onBlur={() => setOpen(false)}
                  ref={ref}
                  onChange={(_, option) => {
                    field.onChange(option);
                  }}
                  optionLabelProp="label"
                  suffixIcon={<Icon name="arrowDown" size={16} />}
                  className="async-single-select"
                >
                  {(asyncOptions || []).map((option) => (
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

AsyncSingleSelect.displayName = 'AsyncSingleSelect';

export default AsyncSingleSelect;
