import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const ChannelSkeleton: FC = (): ReactElement => {
  return (
    <div className="w-full">
      <Skeleton count={1} />
    </div>
  );
};

export default ChannelSkeleton;
