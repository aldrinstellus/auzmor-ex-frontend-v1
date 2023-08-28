import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

const AboutMe: React.FC = (): ReactElement => {
  return (
    <Card>
      <div className="p-6">
        <Skeleton borderRadius={100} className="!w-24" />
      </div>
      <Divider />
      <div className="p-6">
        <Skeleton borderRadius={100} />
      </div>
    </Card>
  );
};

export default AboutMe;
