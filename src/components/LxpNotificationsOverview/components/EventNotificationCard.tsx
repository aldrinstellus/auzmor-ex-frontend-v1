import React from 'react';

import {
  getAvatarInitial,
  getNotificationTitle,
  humanizeTimestamp,
  parseMentions,
} from '../utils/learnNotification';
import truncate from 'lodash/truncate';

import { getLearnUrl } from 'utils/misc';
import EventNotificationAvatar from './EventNotificationAvatar';

interface EventNotificationCardProps {
  id: number;
  isLearn?: boolean;
  source: 'user' | 'system';
  isRead: boolean;
  actionType: string;
  periods?: number;
  actor: any;
  createdAt: number;
  deletedTargetName?: string;
  targetId1?: number;
  target2Type?: string;
  target1Type?: string;
  viewInline?: boolean;
  onMarkAsRead: (id: any) => void;
  additionalInfo?: any;
  isManager?: boolean;
}

const EventNotificationCard: React.FC<EventNotificationCardProps> = ({
  id,
  isLearn = false,
  source,
  isRead,
  actionType,
  periods,
  actor,
  createdAt,
  deletedTargetName,
  targetId1,
  target2Type,
  target1Type,
  viewInline = false,
  onMarkAsRead,
  additionalInfo,
  isManager = false,
}) => {
  const parseText = (targetText: string | undefined): string => {
    if (!targetText) return '';
    const finalText = targetText
      .replace(/(<\/?ol>|<\/?ul>|<\/li>|\n)/g, '')
      .replace(/(<li>)/g, ' ')
      .trim();
    if (additionalInfo?.mentions && additionalInfo.mentions.length > 0) {
      return parseMentions(additionalInfo.mentions, finalText);
    }
    return finalText;
  };

  const notificationTitle = getNotificationTitle(
    true,
    actionType,
    periods,
    actor?.id,
    actor && truncate(actor.display_name, { length: 30 }),
    actor?.id,
    truncate(parseText(deletedTargetName), { length: 30 }),
    targetId1,
    isLearn,
    target1Type,
    target2Type,
    additionalInfo,
  );

  return (
    <div
      className={`flex justify-between  items-center  `}
      data-testid={`notification_${id}`}
    >
      <div
        className={`flex flex-row items-start pl-5 ${
          viewInline ? 'w-[86%]' : 'w-[74%]'
        }`}
        data-testid="left-section"
      >
        <div
          className="cursor-pointer"
          onClick={() =>
            isLearn || source === 'system' || isManager
              ? false
              : window.location.assign(
                  `${getLearnUrl()}/people/${actor.id}/overview`,
                )
          }
          data-testid="profile-icon"
        >
          <EventNotificationAvatar
            source={source}
            actionType={actionType}
            userImageUrl={actor && actor?.image_url}
            profileColor={actor && actor?.profile_color}
            target1Type={target1Type}
            name={
              (actor &&
                getAvatarInitial({
                  firstName: actor?.first_name,
                  lastName: actor?.last_name,
                })) ||
              '✷'
            }
          />
        </div>
        <div
          className="pl-4 flex flex-col"
          data-testid="title"
          onClick={() => !isRead && onMarkAsRead(id)}
        >
          {notificationTitle}
          {viewInline && (
            <p className="text-xs leading-[18px] tracking-[0.21px] text-gray-600">
              {humanizeTimestamp(createdAt)}
            </p>
          )}
        </div>
      </div>

      <div
        className={`flex flex-col items-end pr-5 h-full ${
          viewInline ? 'justify-center' : 'justify-around'
        }`}
        data-testid="right-section"
      >
        {!viewInline && (
          <>
            <div
              className={`w-2 h-2 rounded-full cursor-pointer ${
                isRead ? 'bg-transparent' : 'bg-red-500'
              }`}
              onClick={() => !isRead && onMarkAsRead(id)}
            />
            <p className="text-sm leading-[25px] tracking-[0.23px]">
              {humanizeTimestamp(createdAt)}
            </p>
          </>
        )}
        {viewInline && (
          <div
            className={`w-2 h-2 rounded-full cursor-pointer ${
              isRead ? 'bg-transparent' : 'bg-red-500'
            }`}
            onClick={() => !isRead && onMarkAsRead(id)}
          />
        )}
      </div>
    </div>
  );
};

export default EventNotificationCard;
