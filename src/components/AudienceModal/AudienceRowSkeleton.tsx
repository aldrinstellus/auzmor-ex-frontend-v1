import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AudienceRowSkeleton: FC = (): ReactElement => {
  return (
    <div className="flex gap-x-2 items-start py-5 w-full px-2">
      <Skeleton circle className="!h-8 !w-8" />
      <div className="flex-1 flex-col">
        <Skeleton className="!w-full h-3" count={2} borderRadius={100} />
      </div>
    </div>
  );
};

export default AudienceRowSkeleton;
