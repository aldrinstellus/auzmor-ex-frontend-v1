import Avatar from 'components/Avatar';
import { FC, ReactElement } from 'react';
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

const Notification: FC<NotificationCardProps> = ({
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

  const { cardContent, redirect, showActor } = getNotificationElementContent(
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
          <span className="font-bold text-primary-500">
            {actor.fullName} {actor.status === 'INACTIVE' && '(deactivated)'}
          </span>
          <span className="font-bold">! 🎉🥳</span>
        </>
      );
    } else if (action.type === ActionType.NEW_MEMBERS_TO_TEAM) {
      return <span className="font-bold">{notificationMessage}</span>;
    } else {
      return (
        <>
          <span className="font-bold">
            {actor.fullName} {actor.status === 'INACTIVE' && '(deactivated)'}
            &nbsp;
          </span>
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
    <Link to={redirect} onClick={handleOnClick}>
      <div
        className={`${!isRead ? 'bg-blue-50' : 'bg-white'} p-4 cursor-pointer`}
        data-testid={`notification-all-row`}
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            {/* Avatar of the actor */}
            {showActor && (
              <div className="w-fit">
                <Avatar
                  name={actor.fullName}
                  image={getProfileImage(actor)}
                  size={32}
                />
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-neutral-900 text-sm">
                {getNotificationHeaderMessage()}
              </p>
              <p className="text-xs text-neutral-500 font-normal">
                {humanizeTime(action.actedAt)}
              </p>
            </div>
          </div>
          {/* Content */}
          <div className="flex items-center justify-between w-full mr-4">
            {/* Unread indicator (blue dot) */}
            <div className="w-2 h-2 mr-8">
              {!isRead && <div className="bg-blue-500 w-2 h-2 rounded-full" />}
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <NotificationCard
                TopCardContent={cardContent?.TopCardContent}
                BottomCardContent={cardContent?.BottomCardContent}
                image={cardContent?.image}
                type={cardContent?.type}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Notification;
