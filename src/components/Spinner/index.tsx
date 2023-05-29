import clsx from 'clsx';
import React from 'react';

type SpinnerProps = {
  color?: string;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  color = '#fff',
  className = '',
}) => {
  const styles = clsx(
    { 'h-5 w-5 border-4': className === '' },
    { [className]: true },
  );
  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${styles}`}
      style={{ color }}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default Spinner;
