import Avatar from 'components/Avatar';
import React, { ReactElement } from 'react';
import NotificationCard from './NotificationCard';
import {
  getNotificationMessage,
  getNotificationElementContent,
} from '../utils';
import { ActionType, NotificationProps } from './NotificationsList';
import { useMutation } from '@tanstack/react-query';
import { markNotificationAsReadById } from 'queries/notifications';
import queryClient from 'utils/queryClient';
import { Link } from 'react-router-dom';
import { humanizeTime } from 'utils/time';
import { getProfileImage } from 'utils/misc';

type NotificationCardProps = NotificationProps;

const Notification: React.FC<NotificationCardProps> = ({
  actor,
  action,
  target,
  isRead,
  id,
  interactionCount,
}): ReactElement => {
  const notificationMessage = getNotificationMessage(
    action.type,
    target[target.length - 1].type,
    interactionCount,
  );

  const { cardContent, redirect } = getNotificationElementContent(
    action,
    target,
    actor,
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

  const getNotificationHeaderMessage = () => {
    if (action.type === ActionType.SHOUTOUT) {
      return (
        <>
          <span className="font-bold">{notificationMessage}&nbsp;</span>
          <span className="font-bold text-primary-500">{actor.fullName}</span>
          <span className="font-bold">! 🎉🥳</span>
        </>
      );
    } else {
      return (
        <>
          <span className="font-bold">{actor.fullName}&nbsp;</span>
          {notificationMessage}
        </>
      );
    }
  };

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
        } py-4 pl-6 cursor-pointer`}
        data-testid={`notification-all-row`}
      >
        <div className="flex gap-x-2">
          {/* Avatar of the actor with indicator */}
          <div className="w-fit">
            <Avatar
              name={actor.fullName}
              image={getProfileImage(actor)}
              size={32}
            />
          </div>
          {/* Content */}
          <div className="flex items-start justify-between gap-x-2 w-full mr-4">
            <div className="flex flex-col gap-y-2 w-full">
              <div className="flex flex-col">
                <p className="text-neutral-900 text-sm">
                  {getNotificationHeaderMessage()}
                </p>
                <p className="text-xs text-neutral-500 font-normal">
                  {humanizeTime(action.actedAt)}
                </p>
              </div>
              <NotificationCard
                TopCardContent={cardContent?.TopCardContent}
                BottomCardContent={cardContent?.BottomCardContent}
                image={cardContent?.image}
                type={cardContent?.type}
              />
            </div>
            {/* Unread indicator (orange dot) */}
            <div className="w-2 h-2 mt-2">
              {!isRead && (
                <div className="bg-orange-400 w-2 h-2 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Notification;
