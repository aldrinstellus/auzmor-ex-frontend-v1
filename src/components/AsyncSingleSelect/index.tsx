import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import {
  MenuPlacement,
  components,
  IndicatorSeparatorProps,
} from 'react-select';
import { twConfig } from 'utils/misc';
import './index.css';

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
  height?: string;
  options: any;
  menuPlacement: MenuPlacement;
  isLoading?: boolean;
  loadOptions: (inputValue: string) => Promise<any>;
  noOptionsMessage?: () => any;
  isClearable?: boolean;
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
      height = '44px',
      options,
      defaultValue,
      menuPlacement = 'bottom',
      isLoading = false,
      loadOptions,
      noOptionsMessage = () => 'No options',
      isClearable = false,
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
    };

    const uniqueClassName = 'select_' + Math.random().toFixed(5).slice(2);
    const menuListRef = useRef<HTMLDivElement>(null);

    const getHeightOfMenu = () => {
      if (menuListRef.current)
        return getComputedStyle(menuListRef.current).height;
    };

    const animationStyles = (open: boolean) => ({
      menu: (provided: any) => ({
        ...provided,
        height: open ? getHeightOfMenu() : '0px',
        opacity: open ? 1 : 0,
        transition: 'all 300ms ease-in-out',
        overflow: 'hidden',
        borderRadius: '12px',
      }),
    });

    const [open, setOpen] = useState<boolean>(false);

    return (
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
          {/* remove top margin provide it to parent div if required */}
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={() => (
              <AsyncSelect
                isDisabled={disabled}
                placeholder={placeholder}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  ...selectStyle,
                  ...animationStyles(open),
                }}
                menuIsOpen
                options={options}
                loadOptions={loadOptions}
                defaultValue={defaultValue}
                menuPlacement={menuPlacement ? menuPlacement : undefined}
                menuPortalTarget={document.body}
                menuPosition="absolute"
                noOptionsMessage={noOptionsMessage}
                isClearable={isClearable}
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
                      className={`${uniqueClassName} divide-y divide-neutral-200 !py-0`}
                      innerRef={menuListRef}
                    ></components.MenuList>
                  ),
                  IndicatorSeparator: ({
                    innerProps,
                  }: IndicatorSeparatorProps<any, true>) => {
                    return <span style={{ display: 'none' }} {...innerProps} />;
                  },
                }}
                {...field}
                onBlur={() => setOpen(false)}
                openMenuOnClick
                ref={ref}
                cacheOptions
                defaultOptions
                isLoading={isLoading}
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

AsyncSingleSelect.displayName = 'AsyncSingleSelect';

export default AsyncSingleSelect;
