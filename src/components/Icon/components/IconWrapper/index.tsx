import clsx from 'clsx';
import { FC, ReactNode, useMemo } from 'react';

export enum Type {
  Square = 'SQUARE',
  Circle = 'CIRCLE',
}

export interface IIconWrapperProps {
  children: ReactNode;
  type?: string;
  className?: string;
  dataTestId?: string;
  border?: boolean;
  onClick?: () => any;
}

const IconWrapper: FC<IIconWrapperProps> = ({
  type = Type.Square,
  className = '',
  children,
  dataTestId,
  border = true,
  onClick = () => null,
}) => {
  const styles = useMemo(
    () =>
      clsx(
        {
          'flex justify-center items-center bg-neutral-50 p-1 rounded-2xl group':
            true,
        },
        {
          'border-1  border-neutral-200': border,
        },
        { '!rounded-full': type === Type.Circle },
        { 'cursor-pointer': !!onClick },
        {
          [className]: true,
        },
      ),
    [type, className],
  );

  return (
    <div className={styles} data-testid={dataTestId} onClick={onClick}>
      {children}
    </div>
  );
};

export default IconWrapper;
