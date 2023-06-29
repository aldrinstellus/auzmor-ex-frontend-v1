import Divider, { Variant } from 'components/Divider';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ReactionSkeleton: React.FC = (): ReactElement => {
  return (
    <div>
      {[...Array(4)].map((value, index) => (
        <div className="flex gap-x-2 items-start py-5" key={index}>
          <Skeleton circle className="!h-8 !w-8" />
          <div className="flex-1 flex-col">
            <Skeleton className="!w-56 h-3" count={2} borderRadius={100} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReactionSkeleton;
