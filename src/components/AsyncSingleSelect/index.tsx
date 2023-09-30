import { ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import { Select, ConfigProvider } from 'antd';
import './index.css';
import { SelectCommonPlacement } from 'antd/es/_util/motion';
import Icon from 'components/Icon';
import { useInView } from 'react-intersection-observer';
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';

const { Option } = Select;
export interface IOption {
  value: string;
  label: string;
  disabled: boolean;
  dataTestId?: string;
  rowData?: any;
}
export interface IAsyncSingleSelectProps {
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
  options: IOption[];
  menuPlacement: SelectCommonPlacement;
  isLoading?: boolean;
  onSearch?: (inputValue: string) => void;
  noOptionsMessage?: string;
  isClearable?: boolean;
  height?: number;
  fontSize?: number;
  getPopupContainer?: any;
  clearIcon?: ReactNode | null;
  showSearch?: boolean;
  suffixIcon?: ReactNode | null;
  optionRenderer?: null | ((option: IOption) => ReactNode);
  isFetchingNextPage?: boolean;
  fetchNextPage?:
    | ((
        options?: FetchNextPageOptions | undefined,
      ) => Promise<InfiniteQueryObserverResult<any, unknown>>)
    | null;
  hasNextPage?: boolean;
  onClear?: () => void;
}

const AsyncSingleSelect = forwardRef(
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
      defaultValue = [],
      menuPlacement = 'bottomLeft',
      isLoading = false,
      onSearch,
      noOptionsMessage = 'No options',
      isClearable = false,
      height = 44,
      fontSize = 14,
      getPopupContainer = null,
      clearIcon = null,
      showSearch = true,
      suffixIcon = null,
      optionRenderer = null,
      isFetchingNextPage = false,
      fetchNextPage = null,
      hasNextPage = false,
      onClear = () => {},
    }: IAsyncSingleSelectProps,
    ref?: any,
  ) => {
    const { ref: loadMoreRef, inView } = useInView();
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

    const noContentFound = () => (
      <div className="px-6 py-2 text-neutral-500 text-center">
        {isLoading ? 'Loading...' : noOptionsMessage}
      </div>
    );

    useEffect(() => {
      if (inView && fetchNextPage) {
        fetchNextPage();
      }
    }, [inView]);

    console.log('___>>>', fetchNextPage && hasNextPage && !isFetchingNextPage);
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
              name={field.name}
              control={control}
              defaultValue={defaultValue}
              render={() => (
                <Select
                  open={open}
                  showSearch={showSearch}
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
                  onSearch={onSearch ? (q) => onSearch(q) : undefined}
                  notFoundContent={noContentFound()}
                  onInputKeyDown={() => setOpen(true)}
                  allowClear={isClearable}
                  loading={isLoading}
                  {...field}
                  ref={ref}
                  onBlur={() => setOpen(false)}
                  onChange={(_, option) => {
                    field.onChange(option);
                  }}
                  optionLabelProp="label"
                  className={`async-single-select ${selectClassName}`}
                  clearIcon={clearIcon}
                  suffixIcon={suffixIcon || <Icon name="arrowDown" size={18} />}
                  onClear={onClear}
                >
                  {(options || []).map((option) => {
                    return (
                      <Option
                        key={`async-${Math.random().toString(16).slice(2)}`}
                        value={option.value}
                        label={option.label}
                      >
                        {optionRenderer ? (
                          optionRenderer(option)
                        ) : (
                          <div data-testid={option.dataTestId}>
                            {option.label}
                          </div>
                        )}
                      </Option>
                    );
                  })}
                  {fetchNextPage && hasNextPage && !isFetchingNextPage && (
                    <div ref={loadMoreRef} />
                  )}
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
