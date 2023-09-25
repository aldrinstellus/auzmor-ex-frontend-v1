import Card from 'components/Card';
import Notification from './Notification';
import NotificationMedia from './NotificationMedia';
import { FC } from 'react';

const SkeletonLoader: FC = () => {
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
