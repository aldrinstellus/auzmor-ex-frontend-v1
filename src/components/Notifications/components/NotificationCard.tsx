import Avatar from 'components/Avatar';
import React, { ReactElement } from 'react';
import PostCard from './PostCard';
import { Notification } from '..';
import { getTimeSinceActedAt } from '../utils';

type NotificationCardProps = Notification;

const NotificationCard: React.FC<NotificationCardProps> = ({
  actor,
  action,
  target,
  isRead,
  createdAt,
  message,
}): ReactElement => {
  return (
    <div
      className={`${
        !isRead ? 'bg-orange-50' : 'bg-white'
      } py-4 px-6 cursor-pointer`}
    >
      <div className="flex gap-x-4 items-start">
        {/* Avatar of the actor with indicator */}
        <Avatar
          name={actor.fullName}
          image={actor.profileImage?.original}
          showActiveIndicator={true}
          size={40}
        />
        {/* Content */}
        <div className="flex items-start gap-x-3">
          <div className="flex flex-col gap-y-1">
            <p className="text-neutral-900">
              {actor.fullName} {message}
            </p>
            <p className="text-sm text-neutral-500 font-normal">
              {getTimeSinceActedAt(action.actedAt)}
            </p>
            <PostCard content={action.content} />
          </div>
          {/* Unread indicator (orange dot) */}
          {!isRead && (
            <div className="bg-orange-400 rounded-full w-2 h-2 mt-2" />
          )}
        </div>

        <div />
      </div>
    </div>
  );
};

export default NotificationCard;
