import React, { ReactNode } from 'react';

export type CardProps = {
  children?: ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  return <div className={`rounded-9xl shadow ${className}`}>{children}</div>;
};

export default Card;
