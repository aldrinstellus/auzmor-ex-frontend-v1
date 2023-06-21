import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const PersonalDetails: React.FC = (): ReactElement => {
  return (
    <Card className="mb-8">
      <div className="p-6">
        <Skeleton count={1} borderRadius={100} style={{ width: 100 }} />
      </div>
      <Divider />
      <div className="p-6 space-y-6">
        <div>
          <Skeleton count={1} borderRadius={100} />
        </div>
        <div>
          <Skeleton count={1} borderRadius={100} />
        </div>
        <div>
          <Skeleton count={1} borderRadius={100} style={{ width: 100 }} />
          <Skeleton count={1} borderRadius={100} />
        </div>
        <div>
          <Skeleton count={1} borderRadius={100} style={{ width: 100 }} />
          <Skeleton count={1} borderRadius={100} />
        </div>
        <div>
          <Skeleton count={1} borderRadius={100} style={{ width: 100 }} />
          <Skeleton count={1} borderRadius={100} />
        </div>
      </div>
    </Card>
  );
};

export default PersonalDetails;
