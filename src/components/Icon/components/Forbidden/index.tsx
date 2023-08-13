import React from 'react';
import SvgForbidden from './Forbidden';

type IBookmarkProps = {
  size?: number;
  className?: string;
  stroke?: string;
};

const Forbidden: React.FC<IBookmarkProps> = ({ className = '', ...props }) => {
  return (
    <div className={className}>
      <SvgForbidden {...props} />
    </div>
  );
};

export default Forbidden;
