import React, { ReactNode } from 'react';
import clsx from 'clsx';

export type CardProps = {
  children?: ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const cardStyle = clsx(
    { 'bg-white shadow rounded-9xl': true },
    { [className]: true },
  );
  return <div className={cardStyle}>{children}</div>;
};

export default Card;
