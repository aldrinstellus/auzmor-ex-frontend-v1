import { clsx } from 'clsx';
import { FC, ReactNode, useMemo } from 'react';

type AppProps = {
  total?: number;
  completed?: number;
  suffix?: string;
  customLabel?: ReactNode;
  className?: string;
  barClassName?: string;
  barFilledClassName?: string;
};

const ProgressBar: FC<AppProps> = ({
  suffix = '',
  total = 0,
  completed = 0,
  customLabel,
  className = '',
  barClassName = '',
  barFilledClassName = '',
}) => {
  const ratio = completed / (total || 1);

  const style = useMemo(
    () => clsx({ 'flex items-center space-x-2': true, [className]: true }),
    [className],
  );

  const barStyle = useMemo(
    () =>
      clsx({
        'relative h-[3px] w-[80px] rounded-full bg-neutral-400': true,
        [barClassName]: true,
      }),
    [barClassName],
  );

  const barFilledStyle = useMemo(
    () =>
      clsx({
        'absolute left-0 top-0 bottom-0 h-[3px] bg-white rounded-full': true,
        [barFilledClassName]: true,
      }),
    [barFilledClassName],
  );

  return (
    <div className={style}>
      <div className={barStyle}>
        <div className={barFilledStyle} style={{ width: `${ratio * 100}%` }} />
      </div>
      {customLabel || (
        <div className="text-xxs text-white">
          {completed} of {total} {suffix}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
