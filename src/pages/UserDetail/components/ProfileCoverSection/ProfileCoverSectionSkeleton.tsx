import Card from 'components/Card';
import Divider, { Variant as DividerVariant } from 'components/Divider';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const ProfileCoverSectionSkeleton: React.FC = (): ReactElement => {
  return (
    <Card className="pb-1 h-80 leading-none">
      <Skeleton
        className="h-[180px] rounded-9xl leading-none"
        borderRadius={10}
      />
      <div className="flex">
        <div className="-mt-[20px] ml-8">
          <Skeleton circle className="!h-20 !w-20" />
        </div>

        <div className="ml-4 mb-6 mt-6 flex flex-col space-y-12 w-full">
          <div className="flex items-center">
            <div className="mr-6 mt-2 flex justify-between w-full">
              <Skeleton className="!w-36" borderRadius={100} />
              <Skeleton className="!w-24" borderRadius={100} />
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <Skeleton className="!w-24" borderRadius={100} />
            <Divider variant={DividerVariant.Vertical} className="h-8" />
            <div className="flex space-x-3 items-center">
              <Skeleton className="!w-24" borderRadius={100} />
            </div>
            <Divider variant={DividerVariant.Vertical} className="h-8" />
            <div className="flex space-x-3 items-center">
              <Skeleton className="!w-24" borderRadius={100} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCoverSectionSkeleton;
