import React, { ReactNode } from 'react';
import clsx from 'clsx';

export type CardProps = {
  children?: ReactNode;
  className?: string;
  dataTestId?: string;
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  dataTestId = '',
}) => {
  const cardStyle = clsx(
    { 'bg-white shadow rounded-9xl': true },
    { [className]: true },
  );
  return (
    <div className={cardStyle} data-testid={dataTestId}>
      {children}
    </div>
  );
};

export default Card;
