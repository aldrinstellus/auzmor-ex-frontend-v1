import React, { MouseEventHandler, useMemo } from 'react';
import clsx from 'clsx';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import { ReactNode } from 'react';

export enum Variant {
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Info = 'INFO',
  Error = 'ERROR',
}

export type BannerProps = {
  title: string;
  variant?: Variant;
  icon?: string;
  action?: ReactNode | null;
  onClose?: MouseEventHandler<Element> | null;
  className?: string;
};

const Banner: React.FC<BannerProps> = ({
  title,
  variant = Variant.Success,
  icon = '',
  action = null,
  onClose = null,
  className = '',
}) => {
  const containerStyles = useMemo(
    () =>
      clsx(
        {
          'bg-green-100 rounded-none': variant === Variant.Success,
        },
        {
          'border-2 bg-red-100 border-red-300 rounded-md':
            variant === Variant.Error,
        },
        {
          'border-2 bg-blue-100 border-blue-300 rounded-md':
            variant === Variant.Info,
        },
        {
          'border-2 bg-orange-100 border-orange-300 rounded-md':
            variant === Variant.Warning,
        },
        {
          'flex items-center font-manrope text-sm shadow-sm': true,
        },
        {
          [className]: true,
        },
      ),
    [variant, className],
  );
  const iconStyles = useMemo(
    () =>
      clsx(
        {
          '!bg-inherit !rounded !text-[#292D32]': variant === Variant.Success,
        },
        {
          '!bg-red-200 !rounded-lg !text-red-500': variant === Variant.Error,
        },
        {
          '!bg-blue-200 !rounded-lg !text-blue-500': variant === Variant.Info,
        },
        {
          '!bg-orange-200 !rounded-lg !text-orange-500':
            variant === Variant.Warning,
        },
        {
          '!flex-none !mx-2 !py-1': true,
        },
      ),
    [variant],
  );

  const titleStyles = useMemo(
    () =>
      clsx(
        {
          'text-[#333333]': variant === Variant.Success,
        },
        {
          'text-red-500': variant === Variant.Error,
        },
        {
          'text-blue-500': variant === Variant.Info,
        },
        {
          'text-orange-500': variant === Variant.Warning,
        },
        {
          '!flex-auto !font-normal py-2.5': true,
        },
      ),
    [variant],
  );

  const iconButtonStyles = useMemo(
    () =>
      clsx(
        {
          '!text-neutral-900': variant === Variant.Success,
        },
        {
          '!text-red-500': variant === Variant.Error,
        },
        {
          '!text-blue-500': variant === Variant.Info,
        },
        {
          '!text-orange-500': variant === Variant.Warning,
        },
        {
          '!bg-inherit !font-normal !px-2': true,
        },
      ),
    [variant],
  );

  return (
    <div className={containerStyles}>
      <IconButton
        icon={icon}
        className={iconStyles}
        variant={IconVariant.Primary}
      />

      <div className={titleStyles}>{title}</div>

      <div className="flex items-center">
        <div className="pl-2">{action}</div>
        {onClose && (
          <IconButton
            icon={'X'}
            className={iconButtonStyles}
            onClick={onClose}
            variant={IconVariant.Primary}
          />
        )}
      </div>
    </div>
  );
};

export default Banner;
