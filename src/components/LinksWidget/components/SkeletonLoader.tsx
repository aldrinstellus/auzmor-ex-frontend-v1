import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader: FC = (): ReactElement => {
  return (
    <div className="px-4 w-60">
      <div className="flex gap-x-4">
        <Skeleton containerClassName="flex-1" circle className="h-8 !w-8" />
        <div className="flex-1 !min-w-full">
          <Skeleton count={2} borderRadius={100} className="!w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
