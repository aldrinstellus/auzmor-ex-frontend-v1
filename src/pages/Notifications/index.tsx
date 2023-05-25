import UserCard from 'components/UserWidget';
import { useGetNotifications } from 'queries/notifications';
import React, { ReactElement } from 'react';
import NotificationSettingsCard from './components/NotificationSettingsCard';

const Notifications: React.FC = (): ReactElement => {
  const { data, isLoading, isError } = useGetNotifications();

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <div className="mb-12 space-x-8 flex w-full">
        <div className="sticky top-10 z-10 w-1/4">
          <UserCard />
        </div>
        <div className="w-1/2">
          <div className="mt-4">{/* <Post data={post} /> */}</div>
        </div>
        <div className="w-1/4">
          <NotificationSettingsCard />
        </div>
      </div>
    </>
  );
};

export default Notifications;
