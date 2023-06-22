import Card from 'components/Card';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const UsersSkeleton: React.FC = (): ReactElement => {
  return (
    <Card className="w-[234px] border-solid border border-neutral-200 flex flex-col">
      <Skeleton
        containerClassName="flex-1"
        className="absolute top-0 left-0 px-2 py-1 !w-32 !rounded-tl-9xl !rounded-br-9xl"
      />
      <div className="p-6 mb-6 flex flex-col items-center">
        <Skeleton circle className="!h-20 !w-20" containerClassName="flex-1" />
        <Skeleton
          className="mt-1 !w-36"
          containerClassName="flex-1"
          borderRadius={100}
        />
        <Skeleton
          className="mt-1 !w-24"
          containerClassName="flex-1"
          borderRadius={100}
        />
        <Skeleton />
      </div>
    </Card>
  );
};

export default UsersSkeleton;
