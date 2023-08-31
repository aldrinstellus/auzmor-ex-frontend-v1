import React, { ReactNode, useMemo, useState } from 'react';
import { Control, Controller, useController } from 'react-hook-form';
import clsx from 'clsx';
import { Select } from 'antd';
import { isFiltersEmpty, twConfig } from 'utils/misc';
import { useDebounce } from 'hooks/useDebounce';
import Icon from 'components/Icon';
import './index.css';
import { SelectCommonPlacement } from 'antd/es/_util/motion';

const { Option } = Select;

type ApiCallFunction = (queryParams: any) => any;

const AddOption = (props: { value?: string }) => (
  <div className="flex items-center justify-start">
    <Icon name="add" size={16} color="text-neutral-900" />
    <span className="ml-[10px] mr-[6px]">Add</span>
    <span className="text-blue-500 line-clamp-1">{`'${
      props.value || ''
    }'`}</span>
  </div>
);

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
  noOptionsMessage?: ReactNode | string;
}

const CreatableSearch = React.forwardRef(
  (
    {
      name,
      className = '',
      disabled = false,
      dataTestId = '',
      error,
      control,
      label = '',
      required = false,
      placeholder = '',
      defaultValue,
      menuPlacement = 'bottomLeft',
      fetchQuery,
      queryParams,
      getFormattedData,
      disableCreate,
      noOptionsMessage = 'No options',
    }: ICreatableSearch,
    ref?: any,
  ) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue || '', 500);
    const { data } = fetchQuery(
      isFiltersEmpty({
        q: debouncedSearchValue.toLowerCase().trim(),
        limit: 3,
        ...queryParams,
      }),
    );

    const transformedOptions = getFormattedData(data);

    const { field } = useController({
      name,
      control,
    });

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

    const isOptionContains = (searchValue: string) =>
      (transformedOptions || []).find((option) => searchValue === option.label);

    const addOptionObject =
      !disableCreate && searchValue && !isOptionContains(searchValue)
        ? {
            label: searchValue,
            value: searchValue,
            isNew: true,
          }
        : null;
    const options = addOptionObject
      ? [...(transformedOptions || []), addOptionObject]
      : transformedOptions;

    return (
      <div
        className={clsx(
          { [`relative ${className}`]: true },
          { 'cursor-not-allowed': disabled },
        )}
      >
        <div className={labelStyle}>
          {label} <span className="text-red-500">{required && '*'}</span>
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
            render={() => (
              <Select
                open={open}
                showSearch
                disabled={disabled}
                placeholder={placeholder}
                defaultValue={defaultValue}
                placement={menuPlacement ? menuPlacement : undefined}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                searchValue={searchValue}
                onSearch={setSearchValue}
                filterOption={false}
                notFoundContent={
                  disableCreate || !searchValue ? noOptionsMessage : null
                }
                {...field}
                ref={ref}
                onBlur={() => setOpen(false)}
                optionLabelProp="label"
                onChange={(_, option) => {
                  field.onChange(option);
                }}
                className="creatable-search"
              >
                {(options || []).map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  >
                    {option.isNew ? (
                      <div className="flex items-center justify-start">
                        <Icon name="add" size={16} color="text-neutral-900" />
                        <span className="ml-[10px] mr-[6px]">Add</span>
                        <span className="text-blue-500 line-clamp-1">
                          {`'${option.label}'`}
                        </span>
                      </div>
                    ) : (
                      option.label
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
    );
  },
);

CreatableSearch.displayName = 'CreatableSearch';

export default CreatableSearch;
