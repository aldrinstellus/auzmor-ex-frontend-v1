import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommentSkeleton: FC = (): ReactElement => {
  return (
    <div>
      <div className="flex gap-x-2 items-center">
        <Skeleton circle className="!h-8 !w-8" />
        <div className="flex-1">
          <Skeleton className="!w-1/4" borderRadius={100} />
        </div>
      </div>
      <Skeleton className="mt-4 !w-11/12" count={2} />
      <div className="pb-4"></div>
    </div>
  );
};

export default CommentSkeleton;
