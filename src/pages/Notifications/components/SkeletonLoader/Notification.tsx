import React, { ReactElement } from 'react';
import Card from 'components/Card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Divider from 'components/Divider';

const Notification: React.FC = (): ReactElement => {
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
            <div className="py-4 px-4">
              <Skeleton count={2} borderRadius={100} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Notification;
