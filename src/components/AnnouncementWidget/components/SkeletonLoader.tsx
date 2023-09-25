import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader: FC = (): ReactElement => {
  return (
    <div className="px-6 pt-6 w-60">
      <div className="flex gap-x-4">
        <Skeleton containerClassName="flex-1" circle className="h-8 !w-8" />
        <div className="flex-1 !min-w-full">
          <Skeleton count={2} borderRadius={100} className="!w-3/4" />
        </div>
      </div>
      {/* Do we need the below? It makes the announcement card "jump" because of dimensions */}
      {/* <div className="!min-w-full mt-4">
        <Skeleton count={4} borderRadius={100} />
      </div>
      <div className="!min-w-full flex justify-center mt-4">
        <Skeleton className="h-10 !w-36" borderRadius={50} />
      </div> */}
    </div>
  );
};

export default SkeletonLoader;
