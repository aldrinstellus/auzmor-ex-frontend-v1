import Avatar from 'components/Avatar';
import { FC, ReactElement } from 'react';
// import NotificationCard from './NotificationCard';
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
import useProduct from 'hooks/useProduct';
import LxpLogoPng from 'components/Logo/images/lxpLogo.png';
import OfficeLogoSvg from 'components/Logo/images/OfficeLogo.svg';
import Icon from 'components/Icon';

type NotificationCardProps = NotificationProps;

const Notification: FC<NotificationCardProps> = ({
  actor,
  action,
  target,
  isRead,
  id,
  interactionCount,
}): ReactElement => {
  const { isLxp } = useProduct();
  // By Default, target is the last element in the array

  // target is not needed in case of lxp
  let targetType = target[target.length - 1].type;
  // For comment notifications, target is the last but 1 element because the newly created comment is also part of the array
  if (action.type === ActionType.COMMENT && target.length > 1)
    targetType = target[target.length - 2].type;

  const { message: notificationMessage, iconName } = getNotificationMessage(
    action.type,
    targetType,
    interactionCount,
  );

  const { redirect, showActor } = getNotificationElementContent(
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
    return (
      <>
        {action.type === ActionType.ACKNOWLEDGEMENT_REMINDER ? (
          <></>
        ) : (
          <span className="font-bold">
            {actor.fullName} {actor.status === 'INACTIVE' && '(deactivated)'}
            &nbsp;
          </span>
        )}
        <span dangerouslySetInnerHTML={{ __html: notificationMessage }} />
      </>
    );
  };

  const handleOnClick = () => {
    // Redirect user to the post
    if (!isRead) {
      markNotificationAsReadMutation.mutateAsync(id);
    }
  };

  const showAvatar = actor?.fullName || actor?.profileImage;
  return (
    <Link to={redirect} onClick={handleOnClick}>
      <div
        className={`${
          !isRead ? 'bg-blue-50' : 'bg-white'
        } px-4 py-2 cursor-pointer`}
        data-testid={`notification-all-row`}
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-4">
            {/* Avatar of the actor */}
            {action.type !== ActionType.ACKNOWLEDGEMENT_REMINDER &&
              showActor &&
              showAvatar && (
                <div className="relative ">
                  <Avatar
                    name={actor.fullName}
                    image={getProfileImage(actor)}
                    size={50}
                  />
                  <Icon
                    name={iconName}
                    className="absolute z-50 rounded-full  cursor-pointer bottom-0 right-0 -mr-2 -mb-2 "
                  />
                </div>
              )}
            {action.type == ActionType.ACKNOWLEDGEMENT_REMINDER && (
              <Icon name={iconName} className="w-[50px] h-[50px]" />
            )}
            {showActor && !showAvatar && (
              <div className="relative flex justify-center items-center rounded-full w-8 h-8 bg-primary-100 flex-shrink-0">
                <img
                  src={isLxp ? LxpLogoPng : OfficeLogoSvg}
                  alt="Office Logo"
                  className="w-4 h-4"
                />
              </div>
            )}

            {/* Message and Time */}
            <div className="flex flex-col flex-grow">
              <p className="text-neutral-900 text-sm flex-grow">
                {getNotificationHeaderMessage()}
              </p>
              <p className="text-xs text-neutral-500 font-normal">
                {humanizeTime(action.actedAt)}
              </p>
            </div>
            {/* Red dot */}
            {!isRead && (
              <div className="flex-shrink-0">
                <div className="bg-primary-500 w-3 h-3 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Notification;
