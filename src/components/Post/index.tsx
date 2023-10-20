import { FC, ReactNode, memo, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// components
import Card from 'components/Card';
import Actor from 'components/Actor';
import Tooltip from 'components/Tooltip';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import Likes, { ReactionType } from 'components/Reactions';
import Icon from 'components/Icon';
import RenderQuillContent from 'components/RenderQuillContent';
import Button, { Size, Variant } from 'components/Button';
import FeedPostMenu from './components/FeedPostMenu';
import AcknowledgementBanner from './components/AcknowledgementBanner';
import ReactionModal from './components/ReactionModal';
import PublishPostModal from './components/PublishPostModal';
import EditSchedulePostModal from './components/EditSchedulePostModal';
import SuccessToast from 'components/Toast/variants/SuccessToast';

// queries
import { IPost, createBookmark, deleteBookmark } from 'queries/post';

// utils
import { getTimeInScheduleFormat, humanizeTime } from 'utils/time';
import { getNouns, twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';

// hooks
import useModal from 'hooks/useModal';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';

import { useFeedStore } from 'stores/feedStore';

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
  post: IPost;
  customNode?: ReactNode;
  setHasChanges?: (flag: boolean) => any;
};

const Post: FC<PostProps> = ({ post, customNode = null, setHasChanges }) => {
  const [showComments, openComments, closeComments] = useModal(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showReactionModal, openReactionModal, closeReactionModal] =
    useModal(false);

  const reaction = post?.myReaction?.reaction;

  const totalCount = Object.values(post.reactionsCount || {}).reduce(
    (total, count) => total + count,
    0,
  );
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);

  const previousShowComment = useRef<boolean>(false);

  const { currentTimezone } = useCurrentTimezone();

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
      toast(
        <SuccessToast
          content="Post has been bookmarked successfully!"
          dataTestId="successfully-bookmarked-toast"
          actionLabel="View Bookmarks"
          action={() => navigate('/bookmarks')}
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-white" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
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
      toast(
        <SuccessToast
          content="Post removed from your bookmarks"
          dataTestId="removed-bookmark-toast"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-white" size={20} />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  const handleBookmarkClick = (post: IPost) => {
    if (post.bookmarked) {
      deleteBookmarkMutation.mutate(post.id as string);
    } else {
      createBookmarkMutation.mutate(post.id as string);
    }
  };

  useEffect(() => {
    if (showComments) {
      previousShowComment.current = true;
    }
    setHasChanges?.(showComments);
  }, [showComments]);

  const [showPublishModal, openPublishModal, closePublishModal] = useModal();
  const [
    showEditSchedulePostModal,
    openEditSchedulePostModal,
    closeEditSchedulePostModal,
  ] = useModal();

  return (
    <>
      <Card className="flex flex-col">
        <AcknowledgementBanner data={post} />
        <div className="post-content p-6 flex flex-col gap-4">
          <div className="flex gap-4 justify-between items-start p-1">
            <Actor
              contentMode={VIEW_POST}
              createdTime={humanizeTime(post.createdAt!)}
              createdBy={post?.createdBy || post?.intendedUsers?.[0]}
              audience={post.audience}
              dataTestId="feedpage-activity-username"
              entityId={post.id}
              postType={post?.occasionContext?.type}
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
              <div className="flex items-center gap-4">
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
        ) : (
          !previousShowComment.current && customNode
        )}
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
