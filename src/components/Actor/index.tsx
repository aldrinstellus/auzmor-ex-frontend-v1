import { FC, ReactNode, useMemo } from 'react';
import Avatar from 'components/Avatar';
import { VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';
import { IAudience, ICreatedBy, PostTitle } from 'queries/post';
import { Link } from 'react-router-dom';
import {
  getAvatarColor,
  getFullName,
  getProfileImage,
  getUserCardTooltipProps,
} from 'utils/misc';
import AudiencePopup from 'components/AudiencePopup';
import Tooltip, { Variant } from 'components/Tooltip';
import UserCard from 'components/UserCard';
import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';

type ActorProps = {
  contentMode?: string;
  createdTime?: string;
  createdBy?: ICreatedBy;
  dataTestId?: string;
  disabled?: boolean;
  audience?: IAudience[];
  entityId?: string;
  postType?: string;
  title?: PostTitle;
};

const Actor: FC<ActorProps> = ({
  contentMode,
  createdTime,
  createdBy,
  dataTestId,
  postType,
  // disabled = false,
  entityId,
  audience,
  title,
}) => {
  const { user } = useAuth();
  const { isLxp } = useProduct();

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
    if (postType === 'POLL') {
      return 'shared a poll';
    }
    if (contentMode === VIEW_POST) {
      return 'shared a post';
    }
    return '';
  }, [postType]);

  const profileUrl = isLxp
    ? ''
    : `${
        createdBy?.userId && createdBy.userId !== user?.id
          ? '/users/' + createdBy.userId
          : '/profile'
      }`;

  const parseTitle: (title: PostTitle) => ReactNode = (_title) => {
    return <p>This is title</p>;
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      <div>
        <Link to={profileUrl}>
          <Avatar
            name={getFullName(createdBy) || 'U'}
            size={32}
            image={getProfileImage(createdBy)}
            bgColor={getAvatarColor(createdBy)}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        {title ? (
          parseTitle(title)
        ) : (
          <div
            className="font-bold text-sm text-neutral-900 flex gap-1"
            data-testid={dataTestId}
          >
            <Tooltip
              tooltipContent={
                <UserCard user={getUserCardTooltipProps(createdBy)} />
              }
              variant={Variant.Light}
              className="!p-4 !shadow-md !rounded-9xl !z-[999]"
            >
              <Link
                to={profileUrl}
                className="hover:text-primary-500 hover:underline"
              >
                {createdBy
                  ? getFullName(createdBy)
                  : user
                  ? getFullName(user)
                  : ''}
              </Link>
            </Tooltip>

            <span className="text-sm font-normal text-neutral-900">
              {actionLabel}
            </span>
          </div>
        )}

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

            <Tooltip
              tooltipContent={
                <AudiencePopup entityId={entityId} audience={audience} />
              }
              variant={Variant.Light}
              tooltipPosition="bottom"
              className="!p-0 border shadow-lg border-neutral-200 !rounded-9xl overflow-hidden min-w-[222px] z-[999]"
              showTooltip={!!(audience && audience.length)}
            >
              <Icon
                name={audience && audience.length ? 'noteFavourite' : 'global'}
                size={16}
              />
            </Tooltip>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Actor;
