import Card from 'components/Card';
import Divider from 'components/Divider';
import HorizontalMenu from 'components/HorizontalMenu';
import Icon from 'components/Icon';
import React from 'react';
import NotificationCard from './components/NotificationCard';
import { UserStatus } from 'queries/users';

export enum ActionType {
  REACTED = 'REACTED',
  COMMENTED = 'COMMENTED',
  MENTIONED = 'MENTIONED',
  REPOSTED = 'REPOSTED',
}

export enum TargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export type Actor = {
  fullName: string;
  profileImage?: {
    blurHash?: string;
    original?: string;
  };
  workLocation?: string;
  userId?: string;
  department?: string;
  designation?: string;
  status: string;
};

export type Action = {
  type: string;
  content: string;
  actedAt: string;
  entityId: string;
  image?: string | null;
};

export type Target = {
  type: string;
  content: string;
  entityId: string;
  image?: string | null;
};

export type Notification = {
  actor: Actor;
  action: Action;
  target: Target[];
  isRead: boolean;
  createdAt: string;
  message: string;
};

type NotificationProps = {
  notifications?: Notification[];
};

const Notifications: React.FC<NotificationProps> = ({ notifications }) => {
  const notificationMenuItems = [
    {
      label: 'All',
      id: 'all',
    },
    {
      label: 'Mentions',
      id: 'mentions',
    },
  ];

  return (
    <Card className="absolute w-[500px] right-64 ">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <p className="text-gray-900 font-extrabold text-base">Notifications</p>
        {/* Mark all as read */}
        <div className="flex items-center gap-x-1 cursor-pointer">
          <Icon name="checkbox" stroke="#059669" size={18} />
          <p className="text-primary-600 font-bold text-sm">Mark all as read</p>
        </div>
      </div>
      {/* Content */}
      <Divider />
      <HorizontalMenu items={notificationMenuItems} />
      <Divider />
      <div className="flex flex-col max-h-96 overflow-y-auto ">
        {notifications?.map((notification, index) => (
          <div key={index}>
            <NotificationCard
              action={notification.action}
              actor={notification.actor}
              target={notification.target}
              isRead={notification.isRead}
              createdAt={notification.createdAt}
              message={notification.message}
            />
            <Divider className="bg-gray-200" />
          </div>
        ))}
        <Divider />
        <div className="text-neutral-500 text-sm font-normal flex justify-center py-4">
          That&apos;s all for now
        </div>
      </div>

      <div className="px-6 bg-blue-100 text-sm font-normal flex items-center justify-start py-4 rounded-b-9xl">
        <p className="text-neutral-900 font-bold text-base cursor-pointer">
          View All
        </p>
      </div>
    </Card>
  );
};

export default Notifications;
