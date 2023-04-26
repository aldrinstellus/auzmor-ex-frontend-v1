import React from 'react';
import { Link as LinkTo } from 'react-router-dom';

export type LinkProps = {
  to?: string;
  label: string;
  fontClass?: string;
};

const Link: React.FC<LinkProps> = ({
  to,
  label,
  fontClass = 'text-medium',
}) => {
  const isAbsolute = (to: string) => {
    return to.indexOf('://') > 0 || to.indexOf('//') === 0;
  };

  return (
    <div
      className={`cursor-pointer ${fontClass} font-medium text-primary-600 hover:underline hover:text-primary-800`}
    >
      {isAbsolute(`${to}`) ? (
        <a href={to}>{label}</a>
      ) : (
        <LinkTo to={`${to}`}>{label}</LinkTo>
      )}
    </div>
  );
};

export default Link;
