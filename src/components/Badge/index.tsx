import clsx from 'clsx';
import Truncate from 'components/Truncate';
import { FC, useMemo } from 'react';

type BadgeProps = {
  text: string;
  bgClassName?: string;
  textClassName?: string;
  dataTestId?: string;
};

const Badge: FC<BadgeProps> = ({
  text,
  bgClassName = '',
  textClassName = '',
  dataTestId,
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
      <Truncate
        text={text || ' '}
        className={textStyles}
        dataTestId={dataTestId}
      />
    </div>
  );
};

export default Badge;
