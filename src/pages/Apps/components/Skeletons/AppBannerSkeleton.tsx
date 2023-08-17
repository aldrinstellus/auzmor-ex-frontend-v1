import React from 'react';
import Skeleton from 'react-loading-skeleton';

export interface IAppBannerSkeletonProps {}

const AppBannerSkeleton: React.FC<IAppBannerSkeletonProps> = () => {
  return (
    <div className="w-full py-6">
      <Skeleton
        containerClassName="flex-1"
        borderRadius={12}
        className="!h-[160px]"
      />
    </div>
  );
};

export default AppBannerSkeleton;
