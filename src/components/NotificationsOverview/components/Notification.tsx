import Avatar from 'components/Avatar';
import React, { ReactElement } from 'react';
import NotificationCard from './NotificationCard';
import {
  getNotificationMessage,
  getNotificationElementContent,
} from '../utils';
import { NotificationProps } from './NotificationsList';
import { useMutation } from '@tanstack/react-query';
import { markNotificationAsReadById } from 'queries/notifications';
import queryClient from 'utils/queryClient';
import { Link } from 'react-router-dom';
import { humanizeTime } from 'utils/time';

type NotificationCardProps = NotificationProps;

const Notification: React.FC<NotificationCardProps> = ({
  actor,
  action,
  target,
  isRead,
  id,
}): ReactElement => {
  const notificationMessage = getNotificationMessage(
    action.type,
    target[target.length - 1].type,
  );

  const { cardContent, redirect } = getNotificationElementContent(
    action,
    target,
  );

  const markNotificationAsReadMutation = useMutation({
    mutationKey: ['mark-notification-as-read'],
    mutationFn: markNotificationAsReadById,
    onSuccess: (response) => {
      console.log(
        'Notification successfully marked as read: ',
        JSON.stringify(response),
      );
      queryClient.invalidateQueries(['get-notifications']);
      queryClient.invalidateQueries(['unread-count']);
      queryClient.refetchQueries(['notifications-page']);
    },
    onError: (response) => {
      console.log(
        'Error in marking notification as read: ',
        JSON.stringify(response),
      );
    },
  });

  const handleOnClick = () => {
    // Redirect user to the post
    if (!isRead) {
      markNotificationAsReadMutation.mutateAsync(id);
    }
  };

  return (
    <Link
      to={`/posts/${redirect?.postId}${
        redirect?.commentId ? '?commentId=' + redirect?.commentId : ''
      }`}
      onClick={handleOnClick}
    >
      <div
        className={`${
          !isRead ? 'bg-orange-50' : 'bg-white'
        } py-4 px-6 cursor-pointer`}
      >
        <div className="flex gap-x-4">
          {/* Avatar of the actor with indicator */}
          <div className="w-fit">
            <Avatar
              name={actor.fullName}
              image={actor.profileImage?.original}
              size={40}
            />
          </div>
          {/* Content */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-y-1 w-11/12">
              <p className="text-neutral-900">
                <span className="font-bold">{actor.fullName}&nbsp;</span>
                {notificationMessage}
              </p>
              <p className="text-sm text-neutral-500 font-normal">
                {humanizeTime(action.actedAt)}
              </p>
              <NotificationCard
                TopCardContent={cardContent?.TopCardContent}
                BottomCardContent={cardContent?.BottomCardContent}
                image={cardContent?.image}
              />
            </div>
            {/* Unread indicator (orange dot) */}
            {!isRead && (
              <div className="bg-orange-400 rounded-full w-2 h-2 mt-2" />
            )}
          </div>

          <div />
        </div>
      </div>
    </Link>
  );
};

export default Notification;
