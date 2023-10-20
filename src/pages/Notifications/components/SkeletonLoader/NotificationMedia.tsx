import { FC, ReactElement } from 'react';
import Card from 'components/Card';
import Skeleton from 'react-loading-skeleton';
import Divider from 'components/Divider';
import 'react-loading-skeleton/dist/skeleton.css';

const NotificationMedia: FC = (): ReactElement => {
  return (
    <div className="py-4 px-6">
      <div className="flex gap-x-4">
        <Skeleton circle className="!h-8 !w-8" />
        <div className="flex-1 flex-col">
          <Skeleton count={2} borderRadius={100} />
          <Card className="mt-4">
            <div className="py-4 px-4">
              <Skeleton count={2} borderRadius={100} />
            </div>
            <Divider />
            <div className="flex py-4 px-4 space-x-3">
              <Skeleton
                containerClassName="flex-1"
                className="h-20 w-20 leading-none"
                borderRadius={10}
              />
              <Skeleton
                count={2}
                containerClassName="flex-1"
                borderRadius={100}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationMedia;
