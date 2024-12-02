import { FC, MouseEventHandler, ReactNode } from 'react';
import clsx from 'clsx';

export type CardProps = {
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
  shadowOnHover?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Card: FC<CardProps> = ({
  children,
  className = '',
  dataTestId = '',
  shadowOnHover = false,
  onClick = () => {},
}) => {
  const cardStyle = clsx(
    'bg-white shadow rounded-9xl',
    className,
    shadowOnHover && 'hover:shadow-xl transition-all duration-300 ease-in-out',
  );

  return (
    <div className={cardStyle} data-testid={dataTestId} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
