import React, { useMemo, useRef, useState } from 'react';

import CreatableSelect from 'react-select/creatable';

import { Control, Controller, useController } from 'react-hook-form';
import { MenuPlacement, components } from 'react-select';
import clsx from 'clsx';
import { isFiltersEmpty, twConfig } from 'utils/misc';
import { CategoryType, useInfiniteCategories } from 'queries/apps';
import { useDebounce } from 'hooks/useDebounce';

export interface ICreatableSearch {
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
  menuPlacement: MenuPlacement;
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
      placeholder = '',
      height = '44px',
      defaultValue,
      menuPlacement = 'bottom',
    }: ICreatableSearch,
    ref?: any,
  ) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue || '', 500);

    const { data } = useInfiniteCategories(
      isFiltersEmpty({
        q: debouncedSearchValue.toLowerCase().trim(),
        type: CategoryType.APP,
        limit: 10,
      }),
    );

    const categoriesData = data?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((category: any) => {
        try {
          return category;
        } catch (e) {
          console.log('Error', { category });
        }
      });
    });

    const { field } = useController({
      name,
      control,
    });

    const [open, setOpen] = useState<boolean>(false);
    const uniqueClassName =
      'select_' + Math.random().toFixed(5).slice(2) + ' !max-h-44';
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

    const selectStyle = {
      control: (styles: any) => {
        return {
          ...styles,
          backgroundColor: '#fff',
          border: '1px solid #E5E5E5',
          borderRadius: '32px',
          height,
          padding: '0px 6px', // change style here because it breaking 2px
          '&:hover': { borderColor: twConfig.theme.colors.primary['600'] },
          borderColor: twConfig.theme.colors.primary['500'],
          boxShadow: styles.boxShadow
            ? `0 0 0 1px ${twConfig.theme.colors.primary['500']}`
            : undefined,
        };
      },
    };
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
              <CreatableSelect
                isDisabled={disabled}
                placeholder={placeholder}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  ...selectStyle,
                }}
                onInputChange={(value) => setSearchValue(value)}
                options={categoriesData}
                menuPlacement={menuPlacement ? menuPlacement : 'top'}
                menuPortalTarget={document.body}
                components={{
                  Option: ({ innerProps, data, isDisabled, isSelected }) => {
                    return (
                      <div
                        {...innerProps}
                        className={`px-6 py-3 hover:bg-primary-50 font-medium text-sm ${
                          isDisabled ? 'cursor-default' : 'cursor-pointer'
                        } ${isSelected && 'bg-primary-50'}`}
                        data-testid={data.dataTestId}
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
