import { FC, Fragment, memo, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// components
import Card from 'components/Card';
import Actor from 'components/Actor';
import Tooltip from 'components/Tooltip';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import { Comment } from 'components/Comments/components/Comment';
import Likes, { ReactionType } from 'components/Reactions';
import Icon from 'components/Icon';
import RenderQuillContent from 'components/RenderQuillContent';
import Button, { Size, Variant } from 'components/Button';
import FeedPostMenu from './components/FeedPostMenu';
import AcknowledgementBanner from './components/AcknowledgementBanner';
import ReactionModal from './components/ReactionModal';
import PublishPostModal from './components/PublishPostModal';
import EditSchedulePostModal from './components/EditSchedulePostModal';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

// queries
import { IPost, createBookmark, deleteBookmark } from 'queries/post';

// utils
import { getTimeInScheduleFormat, humanizeTime } from 'utils/time';
import { getNouns } from 'utils/misc';

// hooks
import useModal from 'hooks/useModal';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';

import { useFeedStore } from 'stores/feedStore';
import Avatar from 'components/Avatar';
import LinkAttachments from './components/LinkAttachments';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
export const iconsStyle = (key: string) => {
  const iconStyle = clsx(
    {
      'bg-blue-300': key === ReactionType.Like,
    },
    {
      'bg-red-100': key === ReactionType.Support,
    },
    {
      'bg-yellow-100': key === ReactionType.Celebrate,
    },
    {
      'bg-red-100': key === ReactionType.Love,
    },
    {
      'bg-yellow-100': key === ReactionType.Funny,
    },
    {
      'bg-yellow-100': key === ReactionType.Insightful,
    },
  );

  return iconStyle;
};

type PostProps = {
  postId: string;
  commentIds?: string[];
  setHasChanges?: (flag: boolean) => any;
};

const Post: FC<PostProps> = ({ postId, commentIds = [], setHasChanges }) => {
  const [feed, getPost, updateFeed] = useFeedStore((state) => [
    state.feed,
    state.getPost,
    state.updateFeed,
  ]);
  const [showComments, openComments, closeComments] = useModal(false);
  const [showPublishModal, openPublishModal, closePublishModal] = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showReactionModal, openReactionModal, closeReactionModal] =
    useModal(false);
  const previousShowComment = useRef<boolean>(false);
  const { currentTimezone } = useCurrentTimezone();
  const [
    showEditSchedulePostModal,
    openEditSchedulePostModal,
    closeEditSchedulePostModal,
  ] = useModal();

  const post = feed[postId];
  const reaction = post?.myReaction?.reaction;
  const totalCount = Object.values(post.reactionsCount || {}).reduce(
    (total, count) => total + count,
    0,
  );

  // Effects
  useEffect(() => {
    if (showComments) {
      previousShowComment.current = true;
      updateFeed(postId, { ...feed[postId], relevantComments: [] });
    }
    setHasChanges?.(showComments);
  }, [showComments]);

  // Mutations
  const createBookmarkMutation = useMutation({
    mutationKey: ['create-bookmark-mutation'],
    mutationFn: createBookmark,
    onMutate: (id) => {
      updateFeed(id, { ...getPost(id), bookmarked: true });
    },
    onError: (_error, variables, _context) => {
      updateFeed(variables, { ...getPost(variables), bookmarked: false });
    },
    onSuccess: async (_data, _variables) => {
      successToastConfig({
        message: 'Post has been bookmarked successfully!',
        dataTestId: 'successfully-bookmarked-toast',
        actionLabel: 'View Bookmarks',
        action: () => navigate('/bookmarks'),
      });
      await queryClient.invalidateQueries(['bookmarks'], { exact: false });
    },
  });
  const deleteBookmarkMutation = useMutation({
    mutationKey: ['delete-bookmark-mutation'],
    mutationFn: deleteBookmark,
    onMutate: (variables) => {
      updateFeed(variables, { ...getPost(variables), bookmarked: false });
    },
    onError: (_error, variables, _context) => {
      updateFeed(variables, { ...getPost(variables), bookmarked: true });
    },
    onSuccess: async (_data, _variables) => {
      successToastConfig({
        message: 'Post removed from your bookmarks',
        dataTestId: 'removed-bookmark-toast',
      });
    },
  });

  // Utility functions
  const handleBookmarkClick = (post: IPost) => {
    if (post.bookmarked) {
      deleteBookmarkMutation.mutate(post.id as string);
    } else {
      createBookmarkMutation.mutate(post.id as string);
    }
  };
  const CustomCard: FC = () => {
    const iconMap: Record<string, string> = {
      clock: 'clock',
      play: 'play',
      calendar: 'calendar',
      camera: 'video',
      location: 'location',
    };

    const CustomImg = ({ alt, src, ...props }: any) => {
      return (
        <img alt={alt} src={src} className="w-4 h-4 object-cover" {...props} />
      );
    };
    const CustomDate = (props: any) => {
      const dateString = moment
        .unix(props.unix)
        .tz(currentTimezone)
        .format(props.format);
      return <span>{dateString}</span>;
    };

    const components = {
      date: CustomDate,
      img: CustomImg,
      p: ({ ...props }: any) => (
        <p className="flex gap-2 items-center" {...props} />
      ),
    };

    return (
      <Card className="w-full h-[266px] relative overflow-hidden group/card">
        <img
          src={post?.cardContext?.image?.url}
          className="w-full h-full object-cover group-hover/card:scale-[1.10]"
          style={{
            transition: 'all 0.25s ease-in 0s',
            animation: '0.15s ease-in 0s 1 normal both running fadeIn',
          }}
          alt="Image"
        />
        <div
          className="rounded-lg absolute"
          style={{
            color: 'rgba(0,0,0,.87)',
            boxSizing: 'inherit',
            background:
              'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 55%, rgb(0, 0, 0) 100%)',
            inset: '0px',
            zIndex: 2,
          }}
        />
        <div className="absolute top-4 left-4 px-2.5 py-1 text-xs bg-primary-500 text-white font-medium rounded">
          {post?.cardContext?.resource}
        </div>

        <div className="absolute bottom-0 left-0 flex flex-col p-4 z-10 gap-2 w-full">
          {post?.cardContext?.categories?.length && (
            <div className="flex gap-2">
              {post?.cardContext?.categories
                ?.slice(0, 2)
                ?.map((category: string) => (
                  <div
                    key={category}
                    className="flex px-2 py-1 rounded bg-white border border-white bg-opacity-10 border-opacity-20 max-w-[90px]"
                  >
                    <p className="text-xs font-medium truncate text-white">
                      {category}
                    </p>
                  </div>
                ))}
              {post?.cardContext?.categories?.length > 2 && (
                <div className="px-2 py-1 rounded bg-white border border-white flex bg-opacity-10 text-white border-opacity-20 text-xs font-medium">
                  +{post?.cardContext?.categories?.length - 2}
                </div>
              )}
            </div>
          )}
          {post?.cardContext?.title && (
            <div className="flex gap-3 items-center">
              <div className="text-white font-bold text-base line-clamp-2 flex">
                {post?.cardContext?.title}
              </div>
              {post?.cardContext?.cardBadgeIcon && (
                <div className="flex items-center justify-center h-5 w-5 bg-primary-500 z-10 rounded">
                  <Icon
                    name="medalStar"
                    size={14}
                    color="text-white"
                    hover={false}
                  />
                </div>
              )}
            </div>
          )}
          {post?.cardContext?.avatar && (
            <div className="flex items-center gap-2">
              <Avatar
                name={post?.cardContext?.avatar?.text || 'U'}
                image={post?.cardContext?.avatar?.url}
                size={32}
              />
              <div className="text-white text-sm font-medium">
                {post?.cardContext?.avatar?.text || 'User'}
              </div>
            </div>
          )}
          {post?.cardContext?.description && (
            <div className="text-sm text-white">
              <Markdown
                components={components}
                remarkPlugins={[
                  remarkDirective,
                  remarkDirectiveRehype,
                  remarkGfm,
                ]}
              >
                {post?.cardContext?.description}
              </Markdown>
            </div>
          )}
          {post?.cardContext?.blockStrings?.length && (
            <div className="flex gap-2 items-center">
              {post?.cardContext?.blockStrings?.map((blockString, index) => (
                <Fragment key={blockString?.text}>
                  <div className="flex gap-1 items-center">
                    <Icon
                      name={iconMap[blockString.icon]}
                      size={16}
                      color="text-white"
                      hover={false}
                    />
                    <p className="text-xs text-white">{blockString?.text}</p>
                  </div>
                  {index < post?.cardContext?.blockStrings.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  )}
                </Fragment>
              ))}
            </div>
          )}
          {post?.ctaButton?.text && (
            <div className="flex font">
              <Button
                label={post?.ctaButton?.text}
                onClick={() => window.location.assign(post?.ctaButton?.url)}
                labelClassName="px-4 font-normal"
                size={Size.Small}
              />
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <>
      <Card className="flex flex-col">
        <AcknowledgementBanner data={post} />
        <div className="post-content px-4 py-3 flex flex-col gap-3">
          <div className="flex gap-3 justify-between items-start p-1">
            <Actor
              contentMode={VIEW_POST}
              createdTime={humanizeTime(post.createdAt!)}
              createdBy={post?.createdBy || post?.intendedUsers?.[0]}
              audience={post.audience}
              dataTestId="feedpage-activity-username"
              entityId={post.id}
              postType={post?.occasionContext?.type}
              title={post?.title}
            />
            <Tooltip
              tooltipContent={
                post.bookmarked ? 'Remove from bookmark' : 'Bookmark post'
              }
              tooltipPosition="top"
            >
              <Icon
                name={post.bookmarked ? 'postBookmarkFilled' : 'postBookmark'}
                size={24}
                dataTestId="feed-post-bookmark"
                onClick={() => handleBookmarkClick(post)}
                isActive={post.bookmarked}
              />
            </Tooltip>
            <div className="relative">
              <FeedPostMenu data={post as unknown as IPost} />
            </div>
          </div>
          {post?.schedule && (
            <div className="flex items-center gap-2 bg-primary-50 justify-between px-3 py-2">
              <Icon name="calendarOutline" size={16} color="text-neutral-900" />
              <div className="text-xs font-medium text-neutral-600 flex-1">
                Post scheduled for{' '}
                {getTimeInScheduleFormat(
                  new Date(post?.schedule.dateTime),
                  moment(post?.schedule.dateTime).format('h:mm a'),
                  post?.schedule.timeZone,
                  currentTimezone,
                )}
              </div>
              <div className="flex items-center gap-3">
                <Icon
                  name="editOutline"
                  size={16}
                  color="text-neutral-900"
                  onClick={openEditSchedulePostModal}
                />
                <div
                  className="text-xs font-bold whitespace-nowrap text-neutral-900 underline cursor-pointer hover:text-primary-500 decoration-neutral-400 hover:decoration-primary-400"
                  onClick={openPublishModal}
                  data-testid="scheduledpost-tab-publishnow"
                >
                  Publish now
                </div>
              </div>
            </div>
          )}
          <RenderQuillContent data={post} />
          {post?.cardContext && <CustomCard />}
          {post?.linkAttachments && (
            <LinkAttachments attachments={post?.linkAttachments} />
          )}
          {/* Reaction Count */}
          {(totalCount > 0 || post?.commentsCount > 0) && !!!post.schedule && (
            <div className="flex flex-row justify-between py-3 border-y-1 border-y-neutral-100">
              <div
                className={`flex flex-row items-center space-x-1 group`}
                data-testid="feed-post-reactioncount"
                onClick={() => openReactionModal()}
              >
                {totalCount > 0 && (
                  <div className="flex">
                    {Object.keys(post.reactionsCount)
                      .filter(
                        (key) =>
                          !!post.reactionsCount[key] &&
                          post.reactionsCount[key] > 0,
                      )
                      .slice(0, 3)
                      .map((key, i) => (
                        <div
                          className={`${
                            i > 0 ? 'p-[1px] -ml-[8px] z-1' : 'p-[1px]'
                          }`}
                          key={key}
                        >
                          <Icon name={`${key}Reaction`} size={20} />
                        </div>
                      ))}
                  </div>
                )}
                {totalCount > 0 && (
                  <div
                    className={`flex text-xs font-normal text-neutral-500 cursor-pointer group-hover:text-primary-500`}
                  >
                    {totalCount} reacted
                  </div>
                )}
              </div>
              {post?.commentsCount > 0 && (
                <div className="flex flex-row text-xs font-normal text-neutral-500 space-x-7 items-center cursor-pointer hover:text-primary-500">
                  <div
                    onClick={() => {
                      if (showComments) {
                        closeComments();
                      } else {
                        openComments();
                      }
                    }}
                    data-testid="feed-post-commentscount"
                  >
                    {post.commentsCount || 0}{' '}
                    {getNouns('comment', post?.commentsCount || 0)}
                  </div>
                  {/* <div data-testid="feed-post-repostcount">0 reposts</div> */}
                </div>
              )}
            </div>
          )}
          {!!!post.schedule && (
            <div className="flex justify-between">
              <div className="flex space-x-6">
                {/* this is for post */}
                <Likes
                  reaction={reaction || ''}
                  entityId={post?.id || ''}
                  entityType="post"
                  reactionId={post?.myReaction?.id || ''}
                  queryKey="feed"
                  dataTestIdPrefix="post-reaction"
                />
                <Button
                  label="Comment"
                  variant={Variant.Tertiary}
                  size={Size.Small}
                  labelClassName="text-xs font-normal text-neutral-500 hover:text-primary-500"
                  leftIcon="comment"
                  leftIconHover={false}
                  className="space-x-1 !p-0"
                  onClick={() => {
                    if (showComments) {
                      closeComments();
                    } else {
                      openComments();
                    }
                  }}
                  data-testid="feed-post-comment"
                />
              </div>
            </div>
          )}
        </div>
        {/* Comments */}
        {showComments ? (
          <div className="pb-3 px-6">
            <CommentCard entityId={post?.id || ''} />
          </div>
        ) : !previousShowComment.current && commentIds?.length ? (
          commentIds.map((id) => (
            <div className="mx-6 mb-3" key={id}>
              <Comment commentId={id} />
            </div>
          ))
        ) : null}
      </Card>

      {showReactionModal && (
        <ReactionModal
          closeModal={() => closeReactionModal()}
          reactionCounts={post.reactionsCount}
          postId={post!.id!}
          entityType="post"
        />
      )}
      {showPublishModal && (
        <PublishPostModal closeModal={closePublishModal} post={post} />
      )}
      {showEditSchedulePostModal && (
        <EditSchedulePostModal
          closeModal={closeEditSchedulePostModal}
          schedule={post.schedule!}
          post={post}
        />
      )}
    </>
  );
};

export default memo(Post);
