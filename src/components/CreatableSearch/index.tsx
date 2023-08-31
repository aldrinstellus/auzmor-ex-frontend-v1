import React, { useEffect, useMemo, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Control, Controller, useController } from 'react-hook-form';
import { MenuPlacement, components } from 'react-select';
import clsx from 'clsx';
import { isFiltersEmpty, twConfig } from 'utils/misc';
import { useDebounce } from 'hooks/useDebounce';
import Icon from 'components/Icon';

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
  height?: string;
  menuPlacement: MenuPlacement;
  addItemDataTestId?: string;
  fetchQuery: ApiCallFunction;
  queryParams?: Record<string, any>;
  getFormattedData: (param: any) => any[];
  disableCreate?: boolean;
  noOptionsMessage?: () => any;
}

const CreatableSearch = React.forwardRef(
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
      height = '44px',
      defaultValue,
      menuPlacement = 'bottom',
      fetchQuery,
      queryParams,
      getFormattedData,
      disableCreate,
      noOptionsMessage = () => 'No options',
    }: ICreatableSearch,
    ref?: any,
  ) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue || '', 500);
    const { data } = fetchQuery(
      isFiltersEmpty({
        q: debouncedSearchValue.toLowerCase().trim(),
        limit: 10,
        ...queryParams,
      }),
    );

    const transformedOption = getFormattedData(data);

    const { field } = useController({
      name,
      control,
    });

    const [open, setOpen] = useState<boolean>(false);
    const uniqueClassName =
      'select_' +
      Math.random().toFixed(5).slice(2) +
      ' !max-h-44 divide-y divide-neutral-200 !py-0';
    const menuListRef = useRef<HTMLDivElement>(null);

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
          backgroundColor: disabled
            ? twConfig.theme.colors.neutral[100]
            : '#fff',
          border: '1px solid #E5E5E5',
          borderRadius: '32px',
          height: `${height} !important`,
          padding: '0px 6px', // change style here because it breaking 2px
          '&:hover': { borderColor: twConfig.theme.colors.primary['600'] },
          borderColor: twConfig.theme.colors.primary['500'],
          boxShadow: styles.boxShadow
            ? `0 0 0 1px ${twConfig.theme.colors.primary['500']}`
            : undefined,
        };
      },
      singleValue: (styles: any) => {
        return {
          ...styles,
          color: disabled
            ? twConfig.theme.colors.neutral[400]
            : twConfig.theme.colors.neutral[900],
        };
      },
      menu: (styles: any) => {
        return {
          ...styles,
          borderRadius: '12px',
          overflow: 'hidden',
        };
      },
    };
    return (
      <div
        className={clsx(
          { [`relative ${className}`]: true },
          { 'pointer-events-none': disabled },
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
              <CreatableSelect
                isDisabled={disabled}
                placeholder={placeholder}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  ...selectStyle,
                }}
                defaultValue={defaultValue}
                defaultInputValue={defaultValue?.label}
                onInputChange={(value) => setSearchValue(value)}
                options={transformedOption}
                menuPlacement={menuPlacement ? menuPlacement : 'top'}
                menuPortalTarget={document.body}
                noOptionsMessage={noOptionsMessage}
                {...(disableCreate && {
                  isValidNewOption: () => false,
                })}
                components={{
                  Option: ({ innerProps, data, isDisabled, isSelected }) => {
                    return (
                      <div
                        {...innerProps}
                        className={`px-6 py-3 hover:bg-primary-50 hover:text-primary-500 font-medium text-sm flex items-center ${
                          isDisabled ? 'cursor-default' : 'cursor-pointer'
                        } ${isSelected && 'bg-primary-50'}`}
                        data-testid={
                          data.__isNew__ ? addItemDataTestId : data.dataTestId
                        }
                      >
                        {data.label}
                      </div>
                    );
                  },
                  MenuList: (props) => (
                    <components.MenuList
                      {...props}
                      className={uniqueClassName}
                      innerRef={menuListRef}
                    ></components.MenuList>
                  ),
                }}
                formatCreateLabel={(inputValue) => (
                  <>
                    <Icon name="add" size={16} color="text-neutral-900" />
                    <span className="ml-[10px] mr-[6px]">Add</span>
                    <span className="text-blue-500 line-clamp-1">{`'${inputValue}'`}</span>
                  </>
                )}
                {...field}
                ref={ref}
                onBlur={() => setOpen(false)}
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

CreatableSearch.displayName = 'CreatableSearch';

export default CreatableSearch;
