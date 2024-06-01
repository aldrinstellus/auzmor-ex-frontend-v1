import Card from 'components/Card';
import { FC, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const ChannelSkeleton: FC = (): ReactElement => {
  return (
    <div>
      <Card>
        <div className="p-6 w-40">
          <Skeleton borderRadius={100} containerClassName="flex-1" />
        </div>
        <div className="pt-2 px-6 pb-4 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-y-4">
              <Skeleton borderRadius={100} containerClassName="flex-1" />
              <Skeleton borderRadius={100} containerClassName="flex-1" />
            </div>
            <div className="flex justify-center items-center">
              <Skeleton
                borderRadius={100}
                containerClassName="flex-1"
                className="h-10"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChannelSkeleton;
