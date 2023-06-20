import React, { ReactElement } from 'react';
import SSOSkeletonCard from './SSOSkeletonCard';

const SkeletonLoader: React.FC = (): ReactElement => {
  return (
    <div className="flex gap-x-6 flex-wrap gap-y-6">
      <SSOSkeletonCard />
      <SSOSkeletonCard />
      <SSOSkeletonCard />
      <SSOSkeletonCard />
      <SSOSkeletonCard />
    </div>
  );
};

export default SkeletonLoader;
