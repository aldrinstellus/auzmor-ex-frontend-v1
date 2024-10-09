import { FC, ReactElement } from 'react';
import NotificationOverview from 'pages/Notifications/components/SkeletonLoader/Notification';

const NotificationsOverviewSkeleton: FC = (): ReactElement => {
  return (
    <div>
      <NotificationOverview />
    </div>
  );
};

export default NotificationsOverviewSkeleton;
