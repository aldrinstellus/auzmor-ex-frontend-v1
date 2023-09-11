import React, { useMemo } from 'react';
import Avatar from 'components/Avatar';
import { VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';
import { IAudience, ICreatedBy } from 'queries/post';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';
import AudiencePopup from 'components/AudiencePopup';

type ActorProps = {
  contentMode?: string;
  createdTime?: string;
  createdBy?: ICreatedBy;
  dataTestId?: string;
  disabled?: boolean;
  audience?: IAudience[];
  entityId?: string;
  postType?: string;
};

const Actor: React.FC<ActorProps> = ({
  contentMode,
  createdTime,
  createdBy,
  dataTestId,
  postType,
  disabled = false,
  entityId,
  audience,
}) => {
  const { user } = useAuth();

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
    <div className="flex items-center gap-4 flex-1">
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
      <div className="flex flex-col flex-1">
        <div
          className="font-bold text-sm text-neutral-900 flex gap-1"
          data-testid={dataTestId}
        >
          <Link
            to={`${
              createdBy?.userId && createdBy.userId !== user?.id
                ? '/users/' + createdBy.userId
                : '/profile'
            }`}
          >
            {createdBy ? getFullName(createdBy) : user ? getFullName(user) : ''}
          </Link>
          <span className="text-sm font-normal text-neutral-900">
            {actionLabel}
          </span>
        </div>
        {/* </Link> */}
        {contentMode === VIEW_POST ? (
          <div className="flex items-center gap-2">
            <div
              className="text-xs font-normal text-neutral-500"
              data-testid="feed-post-time"
            >
              {createdTime}
            </div>
            <div className="bg-neutral-500 rounded-full w-1 h-1" />
            <AudiencePopup entityId={entityId} audience={audience} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Actor;
