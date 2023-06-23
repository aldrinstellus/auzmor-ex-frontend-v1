import React from 'react';
import Avatar from 'components/Avatar';
import Earth from 'images/earth.svg';
import { CREATE_POST, VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';
import { ICreatedBy } from 'queries/post';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

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
      'cursor-not-allowed text-neutral-900 bg-neutral-100 rounded-17xl hover:rounded-17xl':
        disabled,
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
      'text-xxs font-medium ml-1.5': true,
    },
    {
      'text-neutral-400': disabled,
    },
  );

  return (
    <div className={actorStyles}>
      <div className="flex items-center">
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
              image={createdBy?.profileImage.original || user?.profileImage}
            />
          </Link>
        </div>
        <div className="ml-3">
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
            <div className="flex">
              <div
                className="text-xs font-normal text-neutral-500 mr-4"
                data-testid="feed-post-time"
              >
                {createdTime}
              </div>
              <img src={Earth} width={13.33} height={13.33} />
            </div>
          ) : null}
        </div>
      </div>
      {/* post visibility - dropdown */}
      <div className={postVisibilityStylesContainer}>
        {contentMode === CREATE_POST && (
          <div
            className={postVisibilityStyles}
            data-testid={`feed-createpost-visibility-${visibility.toLowerCase()}`}
          >
            <div className={iconStyle}>
              <img src={Earth} height={13.33} width={13.33} />
            </div>
            <div className={visibilityStyle}>{visibility}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actor;
