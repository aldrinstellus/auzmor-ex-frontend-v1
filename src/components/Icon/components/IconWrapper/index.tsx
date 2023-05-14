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
  size?: number;
}

const IconWrapper: React.FC<IIconWrapperProps> = ({
  type = Type.Square,
  className = '',
  children,
  size = 24,
}) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'flex justify-center items-center bg-neutral-50 border-1 border-neutral-200 p-2 rounded-2xl':
            true,
        },
        // {
        //   'rounded-2xl': type === Type.Square,
        // },
        // {
        //   'rounded-full': type === Type.Circle,
        // },
        {
          [className]: true,
        },
      ),
    [type, className],
  );

  const divStyle = useMemo(
    () => ({
      height: `${size}px`,
      width: `${size}px`,
    }),
    [size],
  );

  return (
    <div className={styles} style={divStyle}>
      {children}
    </div>
  );
};

export default IconWrapper;
