import Card from 'components/Card';
import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SSOSkeletonCard: FC = (): ReactElement => {
  return (
    <Card className="w-96 h-60">
      <div className="p-6">
        <div className="flex gap-x-4 justify-between">
          <Skeleton
            containerClassName="flex-1"
            className="h-6"
            borderRadius={100}
          />
          <Skeleton className="h-6 !w-16" borderRadius={100} />
        </div>
        <div className="mt-5">
          <Skeleton count={3} borderRadius={100} />
        </div>
        <Skeleton className="mt-8 !w-24 h-10" borderRadius={100} />
      </div>
    </Card>
  );
};

export default SSOSkeletonCard;
