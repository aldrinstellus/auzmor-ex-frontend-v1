import React from 'react';
import Avatar from 'components/Avatar';
import { CREATE_POST, VIEW_POST } from './constant';
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
};

const Actor: React.FC<ActorProps> = ({
  contentMode,
  createdTime,
  createdBy,
  dataTestId,
  disabled = false,
}) => {
  const { user } = useAuth();

  const actorStyles = clsx({
    'flex justify-between items-center mx-6 mt-6 mb-4': true,
  });

  const iconStyle = clsx({
    'text-neutral-400': disabled,
  });

  const visibilityStyle = clsx(
    {
      'text-xxs text-neutral-900 font-medium ml-1.5': true,
    },
    {
      'text-neutral-400': disabled,
    },
  );

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
              image={
                createdBy
                  ? getProfileImage(createdBy)
                  : user
                  ? getProfileImage(user)
                  : ''
              }
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
              {contentMode === VIEW_POST ? (
                <span className="ml-1 text-sm font-normal text-neutral-900">
                  shared a post
                </span>
              ) : null}
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
