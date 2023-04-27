import React, { MouseEventHandler, useMemo } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';

export enum Variant {
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY',
}

export enum Size {
  Large = 'LARGE',
  Medium = 'MEDIUM',
  Small = 'SMALL',
}

export type IconButtonProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  icon: string;
  onClick?: MouseEventHandler<Element>;
  className?: string;
};

const IconButton = ({
  variant = Variant.Primary,
  size = Size.Medium,
  disabled = false,
  icon = '',
  className = '',
  onClick = () => {},
}: IconButtonProps) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'bg-primary-500 text-white rounded-17xl hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-200':
            variant === Variant.Primary,
        },
        {
          'rounded-17xl disabled:bg-neutral-200': variant === Variant.Secondary,
        },
        {
          'p-2.5': size === Size.Small || size === Size.Medium,
        },
        {
          'p-3': size === Size.Large,
        },
        {
          [className]: true,
        },
      ),
    [],
  );

  const getSize = () => {
    switch (size) {
      case Size.Large:
        return 24;
      case Size.Medium:
        return 16;
      case Size.Small:
        return 12;
    }
  };

  return (
    <button
      type="button"
      className={styles}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} size={getSize()} />
    </button>
  );
};

export default IconButton;
