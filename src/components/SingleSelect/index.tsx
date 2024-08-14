import { ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';
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
  render?: () => ReactNode;
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
  suffixIcon?: ReactNode | null;
  clearIcon?: ReactNode | null;
  isClearable?: boolean;
  showSearch?: boolean;
  required?: boolean;
}

const SingleSelect = forwardRef(
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
      showSearch = true,
      required = false,
    }: ISingleSelectProps,
    ref?: any,
  ) => {
    const [open, setOpen] = useState<boolean>(false);
    const { field } = useController({
      name,
      control,
    });

    const id = `select-id-${Math.random().toString(16).slice(2)}`;

    useEffect(() => {
      setTimeout(() => {
        const nodes = document.querySelectorAll('[aria-activedescendant]');
        if (nodes.length) {
          for (const each of nodes) {
            each.removeAttribute('aria-activedescendant');
          }
        }
      }, 0);
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

    useEffect(() => {
      const elem = document.querySelectorAll(`div[name="${name}"]`);
      if (elem) {
        for (const each of elem) {
          each.removeAttribute('aria-label');
        }
      }
    }, []);

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
          <div className={labelStyle}>
            {label}
            <span className="text-red-500">{required && '*'}</span>
          </div>
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
                  id={id}
                  open={open}
                  showSearch={showSearch}
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
                  onKeyUp={(e) =>
                    e.code === 'Enter' && !disabled ? setOpen(!open) : ''
                  }
                  onChange={(_, option) => {
                    field.onChange(option);
                  }}
                  onSearch={showSearch ? () => setOpen(true) : undefined}
                  className={`single-select ${selectClassName}`}
                  suffixIcon={suffixIcon || <Icon name="arrowDown" size={18} />}
                  clearIcon={clearIcon}
                  ref={ref}
                  allowClear={isClearable}
                  aria-label="select"
                >
                  {(options || []).map((option, i) => (
                    <Option
                      key={`${option.value}-single-select-option-${i}`}
                      value={option.value}
                      label={option.label}
                    >
                      {option?.render ? (
                        option.render()
                      ) : (
                        <div data-testid={option.dataTestId}>
                          {option.label}
                        </div>
                      )}
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
