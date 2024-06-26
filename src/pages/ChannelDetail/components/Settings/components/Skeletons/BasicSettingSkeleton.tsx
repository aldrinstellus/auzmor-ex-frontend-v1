import { FC, ReactElement } from 'react';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Skeleton from 'react-loading-skeleton';

const BasicSettingSkeleton: FC = (): ReactElement => {
  return (
    <Card>
      <div className="p-6">
        <Skeleton borderRadius={100} className="!w-24" />
      </div>
      <Divider />
      <div className="p-6 space-y-6">
        <div>
          <Skeleton borderRadius={100} className="!w-24" />
          <Skeleton borderRadius={100} />
        </div>
        <div>
          <Skeleton borderRadius={100} className="!w-24" />
          <Skeleton borderRadius={100} />
        </div>
      </div>
    </Card>
  );
};

export default BasicSettingSkeleton;
