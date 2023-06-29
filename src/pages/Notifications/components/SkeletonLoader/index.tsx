import React from 'react';
import Card from 'components/Card';
import Notification from './Notification';
import NotificationMedia from './NotificationMedia';

const SkeletonLoader: React.FC = () => {
  return (
    <Card>
      <Notification />
      <NotificationMedia />
      <Notification />
      <NotificationMedia />
    </Card>
  );
};

export default SkeletonLoader;
