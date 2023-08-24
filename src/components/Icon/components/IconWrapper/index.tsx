import clsx from 'clsx';
import React, { ReactNode, useMemo } from 'react';

export enum Type {
  Square = 'SQUARE',
  Circle = 'CIRCLE',
}

export interface IIconWrapperProps {
  children: ReactNode;
  type?: string;
  className?: string;
  dataTestId?: string;
}

const IconWrapper: React.FC<IIconWrapperProps> = ({
  type = Type.Square,
  className = '',
  children,
  dataTestId,
}) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'flex justify-center items-center bg-neutral-50 border-1 border-neutral-200 p-[3px] rounded-2xl':
            true,
        },
        {
          [className]: true,
        },
      ),
    [type, className],
  );

  return (
    <div className={styles} data-testid={dataTestId}>
      {children}
    </div>
  );
};

export default IconWrapper;
