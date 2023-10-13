import { MouseEventHandler, useMemo } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';

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
  icon: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<Element>;
  className?: string;
  borderAround?: boolean;
  borderAroundClassName?: string;
  color?: string;
  dataTestId?: string;
};

const IconButton = ({
  variant = Variant.Primary,
  size = Size.Medium,
  disabled = false,
  loading = false,
  icon = '',
  className = '',
  borderAround = false,
  borderAroundClassName = '',
  onClick = () => {},
  color,
  dataTestId,
}: IconButtonProps) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'bg-primary-500 text-white rounded-full hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-200':
            variant === Variant.Primary,
        },
        {
          'rounded-full disabled:bg-neutral-200': variant === Variant.Secondary,
        },
        {
          'p-2': size === Size.Small || size === Size.Medium,
        },
        {
          'p-3': size === Size.Large,
        },
        {
          group: true,
        },
        {
          [className]: true,
        },
      ),
    [],
  );

  const borderStyle = useMemo(
    () =>
      clsx(
        {
          'border border-solid border-neutral-200 rounded-full hover:border-primary-500':
            borderAround,
        },
        { 'flex items-center': true },
        {
          [borderAroundClassName]: true,
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
    <div className={borderStyle}>
      <button
        type="button"
        className={styles}
        disabled={disabled || loading}
        onClick={onClick}
        data-testid={dataTestId}
      >
        <Icon
          name={icon}
          size={getSize()}
          color={color}
          disabled={disabled || loading}
        />
        {loading && <Spinner />}
      </button>
    </div>
  );
};

export default IconButton;
