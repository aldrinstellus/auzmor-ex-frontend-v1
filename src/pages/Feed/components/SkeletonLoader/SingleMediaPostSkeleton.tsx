import Card from 'components/Card';
import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SingleMediaPostSkeleton: FC = (): ReactElement => {
  return (
    <Card>
      <div className="mt-7 px-6">
        <div className="flex gap-x-4">
          <Skeleton circle className="!h-8 !w-8" />
          <div className="flex-1 flex-col">
            <Skeleton count={2} borderRadius={100} />
          </div>
        </div>
        <Skeleton className="mt-7" borderRadius={100} />
        <div className="mt-4">
          <Skeleton count={2} borderRadius={100} />
        </div>
        <Skeleton className="mt-7 h-72" borderRadius={10} />
        <Skeleton className="mt-4 mb-8" borderRadius={100} />
      </div>
    </Card>
  );
};

export default SingleMediaPostSkeleton;
