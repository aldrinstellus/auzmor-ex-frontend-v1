import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { FC, ReactElement } from 'react';

type LoadMoreProps = {
  onClick: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<any, unknown>>;
  label: string;
  dataTestId?: string;
};

const LoadMore: FC<LoadMoreProps> = ({
  onClick,
  label,
  dataTestId,
}): ReactElement => {
  return (
    <div
      className="flex items-center justify-center pt-4 cursor-pointer"
      onClick={() => onClick()}
      data-testid={dataTestId}
    >
      <p className="text-neutral-500 font-bold text-sm">{label}</p>
    </div>
  );
};

export default LoadMore;
