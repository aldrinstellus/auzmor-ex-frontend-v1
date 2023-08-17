import React, { useEffect, useMemo, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Control, Controller, useController } from 'react-hook-form';
import { MenuPlacement, components } from 'react-select';
import clsx from 'clsx';
import { isFiltersEmpty, twConfig } from 'utils/misc';
import { useInfiniteCategories } from 'queries/apps';
import { useDebounce } from 'hooks/useDebounce';

export interface ICategoryDetail {
  name: string;
  type: string;
  id: string;
}

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
  categoryType: string;
  placeholder?: string;
  height?: string;
  menuPlacement: MenuPlacement;
  addItemDataTestId?: string;
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
      categoryType,
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
        type: categoryType,
        limit: 10,
      }),
    );

    const categoriesData = data?.pages.flatMap((page) => {
      return page?.data?.result?.data.map((category: any) => {
        try {
          return { ...category, label: category.name };
        } catch (e) {
          console.log('Error', { category });
        }
      });
    });

    const transformedOption = categoriesData?.map(
      (category: ICategoryDetail) => ({
        value: category?.name?.toUpperCase(),
        label: category?.name,
        type: category?.type,
        id: category?.id,
        dataTestId: `category-option-${category?.type?.toLowerCase()}-${
          category?.name
        }`,
      }),
    );

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
                defaultInputValue={defaultValue}
                onInputChange={(value) => setSearchValue(value)}
                options={transformedOption}
                menuPlacement={menuPlacement ? menuPlacement : 'top'}
                menuPortalTarget={document.body}
                components={{
                  Option: ({ innerProps, data, isDisabled }) => {
                    const isSelected = data?.id === field?.value?.id;
                    return (
                      <div
                        {...innerProps}
                        className={`px-6 py-3 hover:bg-primary-50 hover:text-primary-500 font-medium  text-sm ${
                          isDisabled ? 'cursor-default' : 'cursor-pointer'
                        } ${isSelected && 'bg-primary-50'}`}
                        data-testid={
                          data.__isNew__ ? addItemDataTestId : data.dataTestId
                        }
                      >
                        {data.__isNew__ ? (
                          <>
                            <span>+ Add</span>
                            <span className="text-blue-500">{` '${data.value}'`}</span>
                          </>
                        ) : (
                          data.label
                        )}
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
