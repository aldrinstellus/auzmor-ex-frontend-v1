import { FC, MouseEventHandler, useMemo } from 'react';
import clsx from 'clsx';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import { ReactNode } from 'react';
import Icon from 'components/Icon';

export enum Variant {
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Info = 'INFO',
  Error = 'ERROR',
  Grey = 'GREY',
}

export type BannerProps = {
  title: string;
  variant?: Variant;
  icon?: string;
  action?: ReactNode | null;
  onClose?: MouseEventHandler<Element> | null;
  className?: string;
  dataTestId?: string;
};

const Banner: FC<BannerProps> = ({
  title,
  variant = Variant.Success,
  // icon = '',
  action = null,
  onClose = null,
  className = '',
  dataTestId = '',
}) => {
  const containerStyles = useMemo(
    () =>
      clsx(
        {
          'bg-green-100 rounded-none': variant === Variant.Success,
        },
        {
          'border-1 bg-[#FDF2F2] border-red-300 rounded-md':
            variant === Variant.Error,
        },
        {
          'border-1 bg-blue-100 border-blue-300 rounded-md':
            variant === Variant.Info,
        },
        {
          'border-1 bg-orange-100 border-orange-300 rounded-md':
            variant === Variant.Warning,
        },
        {
          'border-1 bg-neutral-100 border-neutral-300 rounded-md':
            variant === Variant.Grey,
        },
        {
          'flex items-center text-sm shadow-sm p-2 gap-x-3 justify-between':
            true,
        },
        {
          [className]: true,
        },
      ),
    [variant, className],
  );

  const titleStyles = useMemo(
    () =>
      clsx(
        {
          'text-green-500': variant === Variant.Success,
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
          'text-neutral-500': variant === Variant.Grey,
        },
        {
          'text-xs': true,
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

  const getIconColor = () => {
    switch (variant) {
      case Variant.Success:
        return 'text-neutral-900';
      case Variant.Error:
        return 'text-red-500';
      case Variant.Info:
        return 'text-blue-500';
      case Variant.Warning:
        return 'text-orange-500';
    }
  };

  const iconName = useMemo(() => {
    if (variant === Variant.Error) {
      return 'infoCircleOutline';
    }
    return 'infoCircleOutline';
  }, [variant]);

  // const getStroke = (variant: Variant): string => {
  //   switch (variant) {
  //     case Variant.Success:
  //       return '#171717';
  //     case Variant.Error:
  //       return '#ef4444';
  //     case Variant.Info:
  //       return '#3b82f6';
  //     case Variant.Warning:
  //       return '#f97316';
  //     case Variant.Grey:
  //       return '#f97316';
  //   }
  // };

  return (
    <div className={containerStyles} data-testid={dataTestId}>
      <div className="flex">
        <div className="mr-2">
          <Icon
            name={iconName}
            className="relative"
            size={16}
            color={getIconColor()}
          />
        </div>

        <div className={titleStyles} data-testid={dataTestId}>
          {title}
        </div>
      </div>

      {!!action && (
        <div className="flex items-center">
          <div className="pl-2">{action}</div>
          {onClose && (
            <IconButton
              icon={'closeCircle'}
              className={iconButtonStyles}
              onClick={onClose}
              variant={IconVariant.Primary}
              color="text-red-500"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Banner;
