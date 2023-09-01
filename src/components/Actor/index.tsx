import React, { useMemo } from 'react';
import Avatar from 'components/Avatar';
import { VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';
import { IAudience, ICreatedBy } from 'queries/post';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Icon from 'components/Icon';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';

type ActorProps = {
  contentMode?: string;
  createdTime?: string;
  createdBy?: ICreatedBy;
  dataTestId?: string;
  disabled?: boolean;
  audience?: IAudience[];
  postType?: string;
};

const Actor: React.FC<ActorProps> = ({
  contentMode,
  createdTime,
  createdBy,
  dataTestId,
  postType,
  disabled = false,
}) => {
  const { user } = useAuth();

  const actorStyles = clsx({
    'flex justify-between items-center mx-6 mt-6 mb-4': true,
  });

  const actionLabel = useMemo(() => {
    if (postType === 'BIRTHDAY') {
      return 'is celebrating their birthday';
    }
    if (postType === 'WORK_ANNIVERSARY') {
      return 'is celebrating their work anniversary';
    }
    if (postType === 'NEW_JOINEE') {
      return 'is a new joinee';
    }
    if (contentMode === VIEW_POST) {
      return 'shared a post';
    }
    return '';
  }, [postType]);

  return (
    <div className={actorStyles}>
      <div className="flex items-center space-x-4">
        <div>
          <Link
            to={`${
              createdBy?.userId && createdBy.userId !== user?.id
                ? '/users/' + createdBy.userId
                : '/profile'
            }`}
          >
            <Avatar
              name={getFullName(createdBy) || 'U'}
              size={32}
              image={getProfileImage(createdBy)}
              bgColor={getAvatarColor(createdBy)}
            />
          </Link>
        </div>
        <div>
          <Link
            to={`${
              createdBy?.userId && createdBy.userId !== user?.id
                ? '/users/' + createdBy.userId
                : '/profile'
            }`}
          >
            <div
              className="font-bold text-sm text-neutral-900"
              data-testid={dataTestId}
            >
              {createdBy
                ? getFullName(createdBy)
                : user
                ? getFullName(user)
                : ''}
              <span className="ml-1 text-sm font-normal text-neutral-900">
                {actionLabel}
              </span>
            </div>
          </Link>
          {contentMode === VIEW_POST ? (
            <div className="flex items-center space-x-2">
              <div
                className="text-xs font-normal text-neutral-500"
                data-testid="feed-post-time"
              >
                {createdTime}
              </div>
              <div className="bg-neutral-500 rounded-full w-1 h-1" />
              <Icon name="globalOutline" size={16} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Actor;
