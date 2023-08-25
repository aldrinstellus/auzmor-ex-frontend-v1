import React, { ReactNode, useEffect, useRef } from 'react';
import Card from 'components/Card';
import Actor from 'components/Actor';
import { VIEW_POST } from 'components/Actor/constant';
import CommentCard from 'components/Comments/index';
import Likes, { ReactionType } from 'components/Reactions';
import FeedPostMenu from './components/FeedPostMenu';
import {
  IPost,
  IPostFilters,
  createBookmark,
  deleteBookmark,
} from 'queries/post';
import Icon from 'components/Icon';
import clsx from 'clsx';
import { getTimeInScheduleFormat, humanizeTime } from 'utils/time';
import AcknowledgementBanner from './components/AcknowledgementBanner';
import ReactionModal from './components/ReactionModal';
import RenderQuillContent from 'components/RenderQuillContent';
import { getNouns, twConfig } from 'utils/misc';
import Divider from 'components/Divider';
import useModal from 'hooks/useModal';
import PublishPostModal from './components/PublishPostModal';
import EditSchedulePostModal from './components/EditSchedulePostModal';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from 'stores/feedStore';
import Tooltip from 'components/Tooltip';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { slideInAndOutTop } from 'utils/react-toastify';
import moment from 'moment';
import _ from 'lodash';
import { useNavigate } from 'react-router';
import { useCurrentUser } from 'queries/users';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';

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
};

const Post: React.FC<PostProps> = ({ post, customNode = null }) => {
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
  const { feed, updateFeed } = useFeedStore();
  const previousShowComment = useRef<boolean>(false);
  const { currentTimezone } = useCurrentTimezone();

  const createBookmarkMutation = useMutation({
    mutationKey: ['create-bookmark-mutation'],
    mutationFn: createBookmark,
    onMutate: (id) => {
      updateFeed(id, { ...feed[id], bookmarked: true });
    },
    onError: (error, variables, context) => {
      updateFeed(variables, { ...feed[variables], bookmarked: false });
    },
    onSuccess: async (data, variables) => {
      toast(
        <SuccessToast
          content="Post has been bookmarked successfully!"
          data-testid="toast-successfully-bookmarked"
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
      await queryClient.invalidateQueries(['bookmarks']);
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationKey: ['delete-bookmark-mutation'],
    mutationFn: deleteBookmark,
    onMutate: (variables) => {
      updateFeed(variables, { ...feed[variables], bookmarked: false });
    },
    onError: (error, variables, context) => {
      updateFeed(variables, { ...feed[variables], bookmarked: true });
    },
    onSuccess: async (data, variables) => {
      toast(
        <SuccessToast
          content="Post removed from your bookmarks"
          data-testid="toast-removed-bookmark"
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
  }, [showComments]);

  const [showPublishModal, openPublishModal, closePublishModal] = useModal();
  const [
    showEditSchedulePostModal,
    openEditSchedulePostModal,
    closeEditSchedulePostModal,
  ] = useModal();

  return (
    <>
      <Card className="mb-6 pb-6">
        <AcknowledgementBanner data={post} />
        <div className="flex justify-between items-center">
          <Actor
            contentMode={VIEW_POST}
            createdTime={humanizeTime(post.createdAt!)}
            createdBy={post?.createdBy}
            audience={post.audience}
            dataTestId="feedpage-activity-username"
          />
          <div className="relative flex space-x-4 mr-6">
            <Tooltip
              tooltipContent={
                post.bookmarked ? 'Remove from bookmark' : 'Bookmark post'
              }
              tooltipPosition="top"
            >
              <Icon
                name="postBookmark"
                size={24}
                dataTestId="feed-post-bookmark"
                onClick={() => handleBookmarkClick(post)}
                isActive={post.bookmarked}
              />
            </Tooltip>
            <FeedPostMenu data={post as unknown as IPost} />
          </div>
        </div>
        {post?.schedule && (
          <div className="flex mx-6 items-center bg-primary-50 px-3 py-2 justify-between mb-4">
            <div className="flex">
              <div className="mr-2">
                <Icon
                  name="calendarOutline"
                  size={16}
                  color="text-neutral-900"
                />
              </div>
              <div className="text-xs font-medium text-neutral-600">
                Post scheduled for{' '}
                {getTimeInScheduleFormat(
                  new Date(post?.schedule.dateTime),
                  moment(post?.schedule.dateTime).format('h:mm a'),
                  post?.schedule.timeZone,
                  currentTimezone,
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="group mr-4">
                <Icon
                  name="editOutline"
                  size={16}
                  color="text-neutral-900"
                  onClick={openEditSchedulePostModal}
                />
              </div>
              <div
                className="text-xs font-bold whitespace-nowrap text-neutral-900 
                underline cursor-pointer hover:text-primary-500 decoration-neutral-400"
                onClick={openPublishModal}
                data-testid="scheduledpost-tab-publishnow"
              >
                Publish now
              </div>
            </div>
          </div>
        )}

        <div className="mx-6">
          <RenderQuillContent data={post} />
          {/* Reaction Count */}

          {(totalCount > 0 || post?.commentsCount > 0) && !!!post.schedule && (
            <>
              <Divider className="mt-4" />
              <div className="flex flex-row justify-between my-3">
                <div
                  className={`flex flex-row items-center space-x-1`}
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
                      className={`flex text-xs font-normal text-neutral-500 cursor-pointer`}
                    >
                      {totalCount} reacted
                    </div>
                  )}
                </div>
                {post?.commentsCount > 0 && (
                  <div className="flex flex-row text-xs font-normal text-neutral-500 space-x-7 items-center cursor-pointer">
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
              <Divider className="mt-3" />
            </>
          )}

          {!!!post.schedule && (
            <div className="flex justify-between pt-4">
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
                <button
                  className="flex items-center space-x-1"
                  onClick={() => {
                    if (showComments) {
                      closeComments();
                    } else {
                      openComments();
                    }
                  }}
                  data-testid="feed-post-comment"
                >
                  <Icon name="comment" size={16} />
                  <div className="text-xs font-normal text-neutral-500">
                    Comment
                  </div>
                </button>
              </div>
              <div
                className="flex items-center space-x-1 cursor-pointer text-neutral-500 hover:text-primary-500"
                data-testid="feed-post-repost"
              >
                <Icon name="repost" size={16} />
                <span className="text-xs font-normal">Repost</span>
              </div>
            </div>
          )}
          {/* Comments */}
          {showComments ? (
            <div className="mt-6">
              <CommentCard entityId={post?.id || ''} />
            </div>
          ) : (
            !previousShowComment.current && customNode
          )}
        </div>
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

export default Post;
