import { FC } from 'react';

type AppProps = {
  total?: number;
  completed?: number;
  suffix?: string;
};

const ProgressBar: FC<AppProps> = ({
  suffix = '',
  total = 0,
  completed = 0,
}) => {
  const ratio = completed / (total || 1);

  return (
    <div className="flex items-center space-x-2">
      <div className="relative h-[3px] w-[80px] rounded-full bg-neutral-400">
        <div
          className="absolute left-0 top-0 bottom-0 h-[3px] bg-white rounded-full"
          style={{ width: `${ratio * 80}px` }}
        />
      </div>
      <div className="text-xxs text-white">
        {completed} of {total} {suffix}
      </div>
    </div>
  );
};

export default ProgressBar;
