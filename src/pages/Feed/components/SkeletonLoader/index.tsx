import React, { ReactElement } from 'react';
import AnnouncementSkeleton from './AnnouncementSkeleton';
import MultipleMediaPostSkeleton from './MultipleMediaPostSkeleton';
import SingleMediaPostSkeleton from './SingleMediaPostSkeleton';

const SkeletonLoader: React.FC = (): ReactElement => {
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <AnnouncementSkeleton />
      <MultipleMediaPostSkeleton />
      <SingleMediaPostSkeleton />
    </div>
  );
};

export default SkeletonLoader;
