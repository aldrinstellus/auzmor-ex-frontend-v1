import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Control, Controller, useController } from 'react-hook-form';
import clsx from 'clsx';
import { Select, ConfigProvider } from 'antd';
import { isFiltersEmpty } from 'utils/misc';
import { useDebounce } from 'hooks/useDebounce';
import Icon from 'components/Icon';
import './index.css';
import { SelectCommonPlacement } from 'antd/es/_util/motion';

const { Option } = Select;

type ApiCallFunction = (queryParams: any) => any;

export interface ICreatableSearch {
  name: string;
  defaultValue?: any;
  disabled?: boolean;
  error?: string;
  className?: string;
  dataTestId?: string;
  control?: Control<Record<string, any>>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  menuPlacement: SelectCommonPlacement;
  addItemDataTestId?: string;
  fetchQuery: ApiCallFunction;
  queryParams?: Record<string, any>;
  getFormattedData: (param: any) => any[];
  disableCreate?: boolean;
  noOptionsMessage?: string;
  height?: number;
  fontSize?: number;
  getPopupContainer?: any;
  multi?: boolean;
  maxLength?: number;
}

const CreatableSearch = forwardRef(
  (
    {
      name,
      className = '',
      disabled = false,
      dataTestId = '',
      addItemDataTestId = '',
      error,
      control,
      label = '',
      required = false,
      placeholder = '',
      menuPlacement = 'bottomLeft',
      fetchQuery,
      queryParams,
      getFormattedData,
      disableCreate,
      noOptionsMessage = 'No options',
      height = 44,
      fontSize = 14,
      getPopupContainer = null,
      multi = false,
      maxLength = 250, // default
    }: ICreatableSearch,
    ref?: any,
  ) => {
    const { field } = useController({
      name,
      control,
    });

    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue || '', 500);
    const { data, isLoading } = fetchQuery(
      isFiltersEmpty({
        q: debouncedSearchValue?.toLowerCase().trim(),
        limit: 10,
        ...queryParams,
      }),
    );

    const transformedOptions = getFormattedData(data);

    const [open, setOpen] = useState<boolean>(false);

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

    const isOptionContains = (searchValue: string) =>
      (transformedOptions || []).find(
        (option) => searchValue?.toLowerCase() === option.label?.toLowerCase(),
      );

    const addOptionObject =
      !disableCreate &&
      searchValue &&
      searchValue.length <= maxLength &&
      !isOptionContains(searchValue) &&
      !isLoading
        ? {
            label: searchValue,
            value: searchValue,
            isNew: true,
          }
        : null;
    const options = addOptionObject
      ? [...(transformedOptions || []), addOptionObject]
      : transformedOptions;

    const noContentFound = () => (
      <div className="px-6 py-2 text-neutral-500 text-center">
        {isLoading ? 'Loading...' : noOptionsMessage}
      </div>
    );

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
        <label
          className={clsx(
            { [`relative ${className}`]: true },
            { 'pointer-events-none': disabled },
          )}
          htmlFor={id}
        >
          <div className={labelStyle}>
            {label} <span className="text-red-500">{required && '*'}</span>
          </div>
          <div
            data-testid={dataTestId}
            onClick={() => {
              if (!disabled && !open) {
                setOpen(!open);
              }
            }}
          >
            <Controller
              name={name}
              control={control}
              render={() => (
                <Select
                  id={id}
                  open={open}
                  showSearch
                  mode={multi ? 'multiple' : undefined}
                  disabled={disabled}
                  placeholder={placeholder}
                  placement={menuPlacement ? menuPlacement : undefined}
                  getPopupContainer={(triggerNode) => {
                    if (getPopupContainer) {
                      return getPopupContainer;
                    }
                    return triggerNode.parentElement;
                  }}
                  searchValue={searchValue}
                  onSearch={setSearchValue}
                  filterOption={false}
                  notFoundContent={noContentFound()}
                  onInputKeyDown={() => setOpen(true)}
                  value={field.value}
                  defaultActiveFirstOption={false}
                  ref={ref}
                  onBlur={() => {
                    setOpen(false);
                    setSearchValue('');
                  }}
                  optionLabelProp="label"
                  onChange={(values, option: any) => {
                    if (multi) {
                      field.onChange(
                        values?.map((v: string) => ({
                          value: v,
                          label: v,
                          isNew: option?.value == option?.label,
                        })),
                      );
                      setSearchValue('');
                    } else {
                      field.onChange({
                        ...option,
                        isNew: option?.value == option?.label,
                      });
                      setSearchValue('');
                      setOpen(false);
                    }
                  }}
                  suffixIcon={<Icon name="arrowDown" size={16} />}
                  className="creatable-search"
                >
                  {(options || []).map((option) => (
                    <Option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    >
                      {option.isNew ? (
                        <div
                          className="flex items-center justify-start"
                          data-testid={`${addItemDataTestId}-${option.label}`}
                        >
                          <Icon name="add" size={16} color="text-neutral-900" />
                          <span className="ml-[10px] mr-[6px]">Add</span>
                          <span className="text-blue-500 line-clamp-1">
                            {`'${option.label}'`}
                          </span>
                        </div>
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
        </label>
      </ConfigProvider>
    );
  },
);

CreatableSearch.displayName = 'CreatableSearch';

export default CreatableSearch;
