import { FC, Fragment, useMemo } from 'react';
import Avatar from 'components/Avatar';
import { VIEW_POST } from './constant';
import useAuth from 'hooks/useAuth';
import { IAudience, ICreatedBy } from 'queries/post';
import { Link } from 'react-router-dom';
import {
  getAvatarColor,
  getFullName,
  getProfileImage,
  getUserCardTooltipProps,
} from 'utils/misc';
import Tooltip, { Variant } from 'components/Tooltip';
import UserCard from 'components/UserCard';
import Icon from 'components/Icon';
import useProduct from 'hooks/useProduct';
import LxpLogoPng from '../Logo/images/lxpLogo.png';
import OfficeLogoSvg from '../Logo/images/OfficeLogo.svg';
import useModal from 'hooks/useModal';
import AudienceModal, { getAudienceCount } from 'components/AudienceModal';
import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import LxpUserCard from 'components/UserCard/lxpUserCard';
import { CustomLink, CustomStrong } from './utils';
import remarkGfm from 'remark-gfm';
type ActorProps = {
  contentMode?: string;
  createdTime?: string;
  createdBy?: ICreatedBy;
  dataTestId?: string;
  disabled?: boolean;
  audience?: IAudience[];
  entityId?: string;
  postType?: string;
  title?: any;
};

const MarkdownTooltip = (props: any) => {
  return (
    <Tooltip
      tooltipContent={<LxpUserCard userId={props.node.properties.id} />}
      variant={Variant.Light}
      className="!p-4 !shadow-md !rounded-9xl !z-[999]"
    >
      <span className="font-bold text-sm text-neutral-900 hover:text-primary-500 hover:underline cursor-pointer">
        {props.node.properties.name}
      </span>
    </Tooltip>
  );
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
  const [isAudienceModalOpen, openAudienceModal, closeAudienceModal] =
    useModal(false);
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

  const components = {
    user: MarkdownTooltip,
    Strong: CustomStrong,
    a: CustomLink,
  };
  return (
    <Fragment>
      <div className="flex items-center gap-4 flex-1">
        <div>
          {createdBy ? (
            <Link to={profileUrl}>
              <Avatar
                name={getFullName(createdBy) || 'U'}
                size={32}
                image={getProfileImage(createdBy)}
                bgColor={getAvatarColor(createdBy)}
              />
            </Link>
          ) : (
            <div className="relative flex justify-center items-center rounded-full w-8 h-8 bg-primary-100">
              <img
                src={isLxp ? LxpLogoPng : OfficeLogoSvg}
                alt="Office Logo"
                className="w-4 h-4"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1">
          {title ? (
            <ReactMarkdown
              components={components}
              remarkPlugins={[
                remarkDirective,
                remarkDirectiveRehype,
                remarkGfm,
              ]}
            >
              {title?.content ?? title}
            </ReactMarkdown>
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

          {contentMode === VIEW_POST ? (
            <div className="flex items-center gap-2">
              <div
                className="text-xs font-normal text-neutral-500"
                data-testid="feed-post-time"
              >
                {createdTime}
              </div>
              <div className="bg-neutral-500 rounded-full w-1 h-1" />
              <Icon
                name={audience && audience.length ? 'noteFavourite' : 'global'}
                size={16}
                onClick={
                  audience && audience.length ? openAudienceModal : () => {}
                }
              />
            </div>
          ) : null}
        </div>
      </div>
      {isAudienceModalOpen && (
        <AudienceModal
          closeModal={closeAudienceModal}
          entityId={entityId || ''}
          entity={'posts'}
          audienceCounts={getAudienceCount(audience || [])}
        />
      )}
    </Fragment>
  );
};

export default Actor;
