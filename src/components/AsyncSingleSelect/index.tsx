import { ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import { Select, ConfigProvider } from 'antd';
import './index.css';
import { SelectCommonPlacement } from 'antd/es/_util/motion';
import Icon from 'components/Icon';
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Spinner from 'components/Spinner';

const { Option } = Select;
export interface IOption {
  value: string;
  label: string | ReactNode;
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
  noOptionsMessage?: string | ReactNode;
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
  disableFilterOption?: boolean;
  onClear?: () => void;
  onEnter?: () => void;
  ariaLabel?: string;
  onSelect?: () => void;
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
      disableFilterOption = false,
      onEnter,
      ariaLabel = 'search',
      onSelect,
    }: IAsyncSingleSelectProps,
    ref?: any,
  ) => {
    const [search, setSearch] = useState('');
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
        {isLoading ? (
          <div className="flex justify-center items-center w-full p-12">
            <Spinner />
          </div>
        ) : (
          noOptionsMessage
        )}
      </div>
    );

    useEffect(() => {
      if (inView && fetchNextPage) {
        fetchNextPage();
      }
    }, [inView]);

    const onPopupScroll = (e: any) => {
      e.persist();
      const target = e.target;

      if (target.scrollTop + target.offsetHeight > target.scrollHeight - 1) {
        if (fetchNextPage && hasNextPage && !isFetchingNextPage) {
          // dynamic add options...
          fetchNextPage();
        }
      }
    };

    const handleSearch = (q: string) => {
      if (onSearch) {
        onSearch(q);
      }
      setSearch(q);
    };

    const filterOption = (input: any, option: any) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
                  placement={menuPlacement ? menuPlacement : undefined}
                  popupMatchSelectWidth={false}
                  onPopupScroll={onPopupScroll}
                  defaultActiveFirstOption={false}
                  getPopupContainer={(triggerNode) => {
                    if (getPopupContainer) {
                      return getPopupContainer;
                    }
                    return triggerNode.parentElement;
                  }}
                  onSearch={handleSearch}
                  filterOption={!disableFilterOption && filterOption}
                  notFoundContent={noContentFound()}
                  onInputKeyDown={(e) => {
                    if (onEnter && e.key === 'Enter') {
                      onEnter();
                      setOpen(false);
                    } else setOpen(true);
                  }}
                  allowClear={isClearable}
                  loading={isLoading}
                  value={field.value}
                  ref={ref}
                  onBlur={() => setOpen(false)}
                  onChange={(_, option) => {
                    field.onChange(option);
                  }}
                  onSelect={onSelect}
                  optionLabelProp="label"
                  className={`async-single-select ${selectClassName}`}
                  clearIcon={clearIcon}
                  suffixIcon={suffixIcon || <Icon name="arrowDown" size={18} />}
                  onClear={() => {
                    field.onChange(null);
                    if (onClear) {
                      onClear();
                    }
                  }}
                  searchValue={search}
                  aria-label={ariaLabel}
                >
                  {(options || []).map((option) => {
                    return (
                      <Option
                        key={`${option.value}-${Math.random()}`}
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
                  {isFetchingNextPage && (
                    <div className="text-xs font-bold text-neutral-500 text-center">
                      Loading...
                    </div>
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
