import Card from 'components/Card';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

export interface IAppCardSkeletonProps {}

const AppCardSkeleton: FC<IAppCardSkeletonProps> = () => {
  return (
    <Card className="min-w-[234px] max-w-[234px] min-h-[148px] max-h-[148px] border-1 flex flex-col">
      <div className="p-4 flex flex-col">
        <Skeleton className="!h-6 !w-6" />
        <div className="mt-0.5 flex">
          <Skeleton
            containerClassName="flex-1"
            borderRadius={100}
            className="!h-3"
          />
        </div>
        <div className="mt-2 flex">
          <Skeleton
            containerClassName="flex-1"
            borderRadius={100}
            className="!h-3"
          />
        </div>
        <div className="mt-0.5 flex">
          <Skeleton
            containerClassName="flex-1"
            borderRadius={100}
            className="!h-3"
          />
        </div>
      </div>
    </Card>
  );
};

export default AppCardSkeleton;
