import clsx from 'clsx';
import React, { useMemo } from 'react';

export enum Variant {
  Vertical = 'VERTICAL',
  Horizontal = 'HORIZONTAL',
}

export type DividerProps = {
  variant?: Variant;
  className?: string;
};

const Divider = ({
  variant = Variant.Horizontal,
  className = '',
}: DividerProps) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'w-full h-px': variant === Variant.Horizontal,
        },
        {
          'h-full w-px': variant === Variant.Vertical,
        },
        { 'bg-neutral-200': true },
        { [className]: true },
      ),
    [variant, className],
  );

  return <div className={styles} />;
};

export default Divider;
