import { FC, ReactElement } from 'react';
import NotificationOverview from 'pages/Notifications/components/SkeletonLoader/Notification';
import NotificationOverviewMedia from 'pages/Notifications/components/SkeletonLoader/NotificationMedia';

const NotificationsOverviewSkeleton: FC = (): ReactElement => {
  return (
    <div>
      <NotificationOverview />
      <NotificationOverviewMedia />
    </div>
  );
};

export default NotificationsOverviewSkeleton;
