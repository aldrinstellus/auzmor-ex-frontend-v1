import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Control, useController, Controller } from 'react-hook-form';
import Select, { MenuPlacement, components } from 'react-select';
import { twConfig } from 'utils/misc';

export interface ISingleSelectProps {
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
}

const SingleSelect: React.FC<ISingleSelectProps> = ({
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
}) => {
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
    }),
  });

  const [open, setOpen] = useState<boolean>(false);

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
        {/* remove top margin provide it to parent div if required */}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={() => (
            <Select
              isDisabled={disabled}
              placeholder={placeholder}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                ...selectStyle,
                ...animationStyles(open),
              }}
              menuIsOpen
              options={options}
              defaultValue={defaultValue}
              menuPlacement={menuPlacement ? menuPlacement : undefined}
              menuPortalTarget={document.body}
              menuPosition="absolute"
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
};

export default SingleSelect;
