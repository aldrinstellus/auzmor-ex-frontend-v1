import Card from 'components/Card';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export interface ITeamsSkeletonProps {}

const TeamsSkeleton: React.FC<ITeamsSkeletonProps> = () => {
  return (
    <Card className="w-[189.5px] border-solid border border-neutral-200 flex flex-col">
      <Skeleton
        containerClassName="flex-1"
        className="absolute top-0 left-0 px-2 py-1 !w-32 !rounded-tl-9xl !rounded-br-9xl bg-red-200"
      />
      <div className="p-6 flex flex-col items-center">
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex">
            <Skeleton
              circle
              className="!h-20 !w-20 "
              containerClassName="flex-1"
            />
            <Skeleton
              circle
              className="!h-20 !w-20 -ml-8"
              containerClassName="flex-1"
            />
            <Skeleton
              circle
              className="!h-20 !w-20 -ml-8"
              containerClassName="flex-1"
            />
          </div>
          <Skeleton
            className="!w-20"
            containerClassName="flex-1"
            borderRadius={100}
          />
        </div>
        <div className="flex flex-col items-center">
          <Skeleton
            className="!w-20 "
            containerClassName="flex-1"
            borderRadius={100}
          />
          <Skeleton
            className="!w-24"
            containerClassName="flex-1"
            borderRadius={100}
          />
        </div>
      </div>
    </Card>
  );
};

export default TeamsSkeleton;
