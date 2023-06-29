import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import Icon from 'components/Icon';
import React, { ReactElement } from 'react';

type LoadMoreProps = {
  onClick: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<any, unknown>>;
  label: string;
  dataTestId?: string;
};

const LoadMore: React.FC<LoadMoreProps> = ({
  onClick,
  label,
  dataTestId,
}): ReactElement => {
  return (
    <div
      className="flex items-center justify-between py-4 cursor-pointer"
      onClick={() => onClick()}
      data-testid={dataTestId}
    >
      <p className="text-neutral-500 font-bold text-sm">{label}</p>
      <Icon name="arrowDown" />
    </div>
  );
};

export default LoadMore;
