import Card from 'components/Card';
import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MultipleMediaPostSkeleton: FC = (): ReactElement => {
  return (
    <Card>
      <div className="px-6">
        <div className="flex mt-7 gap-x-4">
          <Skeleton circle className="!h-8 !w-8" />
          <div className="flex-1 flex-col ">
            <Skeleton count={2} borderRadius={100} />
          </div>
        </div>
        <Skeleton className="mt-7" borderRadius={100} />
        <div className="mt-4">
          <Skeleton count={2} borderRadius={100} />
        </div>
        {/* Top row images */}
        <div className="flex mt-5 gap-x-4">
          <Skeleton
            containerClassName="flex-1"
            className="h-40"
            borderRadius={10}
          />
          <Skeleton
            containerClassName="flex-1"
            className="h-40"
            borderRadius={10}
          />
        </div>
        {/* Bottom row images */}
        <div className="flex mt-4 gap-x-4">
          <Skeleton
            containerClassName="flex-1"
            className="h-28"
            borderRadius={10}
          />
          <Skeleton
            containerClassName="flex-1"
            className="h-28"
            borderRadius={10}
          />
          <Skeleton
            containerClassName="flex-1"
            className="h-28"
            borderRadius={10}
          />
        </div>
        <Skeleton className="mt-4 mb-8" borderRadius={100} />
      </div>
    </Card>
  );
};

export default MultipleMediaPostSkeleton;
