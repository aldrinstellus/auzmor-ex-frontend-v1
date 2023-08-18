import React, { ReactNode, useEffect, useRef, useState } from 'react';
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
import { humanizeTime } from 'utils/time';
import AcknowledgementBanner from './components/AcknowledgementBanner';
import ReactionModal from './components/ReactionModal';
import RenderQuillContent from 'components/RenderQuillContent';
import { getNouns, twConfig } from 'utils/misc';
import Divider from 'components/Divider';
import useModal from 'hooks/useModal';
import PublishPostModal from './components/PublishPostModal';
import EditSchedulePostModal from './components/EditSchedulePostModal';
import { PRIMARY_COLOR, TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from 'stores/feedStore';
import { IpcNetConnectOpts } from 'net';
import Tooltip from 'components/Tooltip';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { slideInAndOutTop } from 'utils/react-toastify';
import moment from 'moment';
import _ from 'lodash';

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
  bookmarks?: boolean;
};

const Post: React.FC<PostProps> = ({ post, bookmarks, customNode = null }) => {
  const [showComments, openComments, closeComments] = useModal(false);
  const queryClient = useQueryClient();
  const [showReactionModal, openReactionModal, closeReactionModal] =
    useModal(false);
  const reaction = post?.myReaction?.reaction;
  const totalCount = Object.values(post.reactionsCount || {}).reduce(
    (total, count) => total + count,
    0,
  );
  const { feed, updateFeed, setFeed } = useFeedStore();
  const previousShowComment = useRef<boolean>(false);

  const createBookmarkMutation = useMutation({
    mutationKey: ['create-bookmark-mutation'],
    mutationFn: createBookmark,
    onMutate: (variables) => {
      if (!bookmarks) {
        updateFeed(variables, { ...feed[variables], bookmarked: true });
      }
    },
    onError: (error, variables, context) => {
      if (!bookmarks) {
        updateFeed(variables, { ...feed[variables], bookmarked: false });
      }
    },
    onSuccess: async (data, variables) => {
      toast(
        <SuccessToast
          content="Post has been bookmarked successfully!"
          data-testid="toast-successfully-bookmarked"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors['black-white'].white}
              size={20}
            />
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
      if (!bookmarks) {
        updateFeed(variables, { ...feed[variables], bookmarked: false });
      } else {
        const previousFeed = feed;
        setFeed({ ..._.omit(feed, [variables]) });
        return { previousFeed };
      }
    },
    onError: (error, variables, context) => {
      if (!bookmarks) {
        updateFeed(variables, { ...feed[variables], bookmarked: true });
      } else {
        if (context?.previousFeed) {
          setFeed(context?.previousFeed);
        }
      }
    },
    onSuccess: async (data, variables) => {
      toast(
        <SuccessToast
          content="Post removed from your bookmarks"
          data-testid="toast-removed-bookmark"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors['black-white'].white}
              size={20}
            />
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
                  name="calendarOutlineTwo"
                  size={16}
                  stroke={twConfig.theme.colors.neutral[900]}
                />
              </div>
              <div className="text-xs text-neutral-600">
                Post scheduled for{' '}
                {moment(post?.schedule.dateTime).format('ddd, MMM DD')} at{' '}
                {moment(post?.schedule.dateTime).format('h:mm a')}, based on
                your profile timezone.
              </div>
            </div>
            <div className="flex items-center">
              <div className="group mr-4">
                <Icon
                  name="editOutline"
                  size={16}
                  stroke={twConfig.theme.colors.neutral[900]}
                  onClick={openEditSchedulePostModal}
                />
              </div>
              <div
                className="text-neutral-900 underline cursor-pointer hover:text-primary-500"
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
                  <div className="flex flex-row text-sm font-normal text-neutral-500 space-x-7 items-center cursor-pointer">
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
            <CommentCard entityId={post?.id || ''} />
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
