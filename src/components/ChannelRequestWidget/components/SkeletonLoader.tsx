import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader: FC = (): ReactElement => {
  return (
    <>
      {[...Array(6)].map((index) => (
        <div className="w-full py-2 flex items-center px-6" key={index}>
          <div className="flex gap-x-2 w-full items-center">
            <Skeleton circle className="h-8 !w-8" />
            <div className="flex-1">
              <Skeleton count={2} borderRadius={100} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
