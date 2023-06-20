import Card from 'components/Card';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AnnouncementSkeleton: React.FC = (): ReactElement => {
  return (
    <Card>
      <div className="leading-none">
        <Skeleton className="h-11" />
      </div>
      <div className="mt-3 px-6">
        <div>
          <Skeleton className="h-3" borderRadius={100} />
        </div>
        <div className="flex mt-12 gap-x-4">
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

export default AnnouncementSkeleton;
