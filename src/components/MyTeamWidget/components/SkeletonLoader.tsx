import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader: React.FC = (): ReactElement => {
  return (
    <div className="w-full">
      <div className="flex gap-x-2">
        <Skeleton circle className="h-8 !w-8" />
        <div className="flex-1">
          <Skeleton count={2} borderRadius={100} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
