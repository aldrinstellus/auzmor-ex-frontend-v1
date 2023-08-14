import clsx from 'clsx';
import React, { useMemo } from 'react';

type BadgeProps = {
  text: string;
  bgClassName?: string;
  textClassName?: string;
};

const Badge: React.FC<BadgeProps> = ({
  text,
  bgClassName = '',
  textClassName = '',
}) => {
  const bgStyles = useMemo(
    () =>
      clsx(
        {
          'rounded-xl': true,
        },
        {
          [bgClassName]: true,
        },
      ),
    [],
  );

  const textStyles = useMemo(
    () =>
      clsx(
        {
          'px-2 py-0.5 font-semibold text-[10px] leading-3': true,
        },
        {
          [textClassName]: true,
        },
      ),
    [],
  );

  return (
    <div className={bgStyles}>
      <p className={textStyles}>{text}</p>
    </div>
  );
};

export default Badge;
