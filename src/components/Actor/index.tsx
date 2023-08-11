import React from 'react';
import Avatar from 'components/Avatar';
import { CREATE_POST, VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';
import { ICreatedBy } from 'queries/post';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Icon from 'components/Icon';

type ActorProps = {
  visibility: string;
  contentMode?: string;
  createdTime?: string;
  createdBy?: ICreatedBy;
  dataTestId?: string;
  disabled?: boolean;
};

const Actor: React.FC<ActorProps> = ({
  visibility,
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

  const postVisibilityStylesContainer = clsx(
    {
      'text-neutral-900 rounded-17xl hover:rounded-17xl': disabled,
    },
    {
      'cursor-pointer': !disabled,
    },
  );

  const postVisibilityStyles = clsx({
    'flex justify-between items-center border border-neutral-300 rounded-17xl py-1.5 px-3':
      true,
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
              name={createdBy?.fullName || 'U'}
              size={32}
              image={
                createdBy ? createdBy.profileImage.original : user?.profileImage
              }
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
              {createdBy?.fullName || user?.name}
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
              <div className="bg-neutral-500 rounded-full w-2 h-2" />
              <Icon name="globalOutline" size={16} />
            </div>
          ) : null}
        </div>
      </div>
      <div className={postVisibilityStylesContainer}>
        {contentMode === CREATE_POST && (
          <div
            className={postVisibilityStyles}
            data-testid={`feed-createpost-visibility-${visibility.toLowerCase()}`}
          >
            <div className={iconStyle}>
              <Icon name="globalOutline" size={16} />
            </div>
            <div className={visibilityStyle}>{visibility}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actor;
