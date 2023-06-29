import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const PersonalDetails: React.FC = (): ReactElement => {
  return (
    <Card className="mb-8">
      <div className="p-6">
        <Skeleton borderRadius={100} className="!w-24" />
      </div>
      <Divider />
      <div className="p-6 space-y-6">
        <div>
          <Skeleton borderRadius={100} />
        </div>
        <div>
          <Skeleton borderRadius={100} />
        </div>
        <div>
          <Skeleton borderRadius={100} className="!w-24" />
          <Skeleton borderRadius={100} />
        </div>
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

export default PersonalDetails;
