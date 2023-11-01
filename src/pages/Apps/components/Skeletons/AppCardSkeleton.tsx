import Card from 'components/Card';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

export interface IAppCardSkeletonProps {}

const AppCardSkeleton: FC<IAppCardSkeletonProps> = () => {
  return (
    <Card className="relative border-1 p-3 flex gap-2" shadowOnHover>
      {/* App logo */}
      <Skeleton className="p-2 rounded-xl min-w-[60px] min-h-[60px]" />

      {/* App details */}
      <div className="flex flex-col gap-1 w-full">
        {/* App name */}
        <div className="overflow-hidden h-4 rounded">
          <Skeleton />
        </div>
        {/* App category */}
        <div className="overflow-hidden h-4 rounded">
          <Skeleton />
        </div>
        {/* App description */}
        <div className="overflow-hidden h-4 rounded">
          <Skeleton />
        </div>
      </div>
    </Card>
  );
};

export default AppCardSkeleton;
