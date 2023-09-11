import React, { useEffect, useMemo, useState } from 'react';
import PostBuilder from 'components/PostBuilder';
import UserCard from 'components/UserWidget';
import AnnouncementCard from 'components/AnnouncementWidget';
import NoPosts from 'images/NoPostsFound.png';
import {
  IPostFilters,
  PostFilterKeys,
  PostType,
  useInfiniteFeed,
} from 'queries/post';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Post from 'components/Post';
import { useInView } from 'react-intersection-observer';
import FeedFilter, {
  filterKeyMap,
} from 'components/ActivityFeed/components/FeedFilters';
import Divider from 'components/Divider';
import SortByDropdown from 'components/ActivityFeed/components/SortByDropdown';
import Icon from 'components/Icon';
import PageLoader from 'components/PageLoader';
import useScrollTop from 'hooks/useScrollTop';
import SkeletonLoader from './components/SkeletonLoader';
import { useFeedStore } from 'stores/feedStore';
import useModal from 'hooks/useModal';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

import MyTeamWidget from 'components/MyTeamWidget';
import HashtagFeedHeader from './components/HashtagFeedHeader';
import BookmarkFeedHeader from './components/BookmarkFeedHeader';
import ScheduledFeedHeader from './components/ScheduledFeedHeader';
import Tooltip from 'components/Tooltip';
import CelebrationWidget, {
  CELEBRATION_TYPE,
} from 'components/CelebrationWidget';
import './index.css';

interface IFeedProps {}

export interface IProfileImage {
  blurHash: string;
  original: string;
}

export interface ICreated {
  designation: string;
  fullName: string;
  userId: string;
  workLocation: Record<string, string>;
  status: string;
  department: string;
  profileImage: IProfileImage;
}
export interface IMyReactions {
  id?: string;
  type?: string;
  reaction?: string;
  createdBy?: ICreated;
}

const Feed: React.FC<IFeedProps> = () => {
  useScrollTop();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const hashtag = searchParams.get('hashtag') || '';

  const bookmarks = pathname === '/bookmarks';
  const scheduled = pathname === '/scheduledPosts';

  const { ref, inView } = useInView();
  const [open, openModal, closeModal] = useModal(undefined, false);
  const [appliedFeedFilters, setAppliedFeedFilters] = useState<IPostFilters>({
    [PostFilterKeys.PostType]: [],
  });
  const { feed } = useFeedStore();

  useEffect(() => {
    if (hashtag) {
      setAppliedFeedFilters({ hashtags: [hashtag] });
    }
  }, [hashtag]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed(pathname, appliedFeedFilters);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const feedIds = (
    (data?.pages.flatMap((page) =>
      page.data?.result?.data
        .filter((post: { id: string }) => {
          if (bookmarks) {
            return !!feed[post.id].bookmarked;
          } else if (scheduled) {
            return !!feed[post.id].schedule;
          }
          return true;
        })
        .map((post: { id: string }) => post),
    ) as { id: string }[]) || []
  )
    ?.filter(({ id }) => !!feed[id])
    .sort(
      (a, b) =>
        new Date(feed[b.id].createdAt).getTime() -
        new Date(feed[a.id].createdAt).getTime(),
    );

  const announcementFeedIds = feedIds
    ? feedIds.filter(
        (post: { id: string }) =>
          !!feed[post.id]?.announcement?.end && !feed[post.id]?.acknowledged,
      )
    : [];

  const regularFeedIds = feedIds
    ? feedIds.filter(
        (post: { id: string }) =>
          !!!feed[post.id]?.announcement?.end || feed[post.id]?.acknowledged,
      )
    : [];

  const clearAppliedFilters = () => {
    setAppliedFeedFilters({
      ...appliedFeedFilters,
      [PostFilterKeys.PostType]: [],
      [PostFilterKeys.MyPosts]: false,
      [PostFilterKeys.MentionedInPost]: false,
    });
  };

  const getAppliedFiltersCount = () => {
    return appliedFeedFilters[PostFilterKeys.PostType]?.length || 0;
  };

  const removePostTypeFilter = (filter: PostType) => {
    if (appliedFeedFilters[PostFilterKeys.PostType]) {
      setAppliedFeedFilters({
        ...appliedFeedFilters,
        [PostFilterKeys.PostType]: appliedFeedFilters[
          PostFilterKeys.PostType
        ].filter((each) => each !== filter),
      });
    }
  };

  const getEmptyFeedComponent = () => {
    if (bookmarks) {
      return (
        <div className="bg-white mt-4 p-6 flex flex-col rounded-9xl">
          <div className="h-220 bg-blue-50 flex justify-center rounded-9xl">
            <img src={NoPosts} data-testid="mybookmark-tab-nopost"></img>
          </div>
          <div className="font-bold text-2xl/[36px] text-center mt-5">
            No posts found
          </div>
          <div className="text-center mt-1" style={{ color: '#737373' }}>
            Your bookmarked posts will show here
          </div>
        </div>
      );
    } else if (scheduled) {
      return (
        <div className="bg-white mt-4 p-6 flex flex-col rounded-9xl">
          <div className="h-220 bg-blue-50 flex justify-center rounded-9xl">
            <img src={NoPosts} data-testid="mybookmark-tab-nopost"></img>
          </div>
          <div data-testid="scheduledpost-tab-nodata">
            <div className="font-bold text-base text-neutral-900 text-center mt-6">
              Not ready to share your post right now?
            </div>
            <div className="font-bold text-base text-neutral-900 text-center">
              Try scheduling for later.
            </div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const FeedHeader = useMemo(() => {
    if (hashtag) {
      return (
        <HashtagFeedHeader
          hashtag={hashtag}
          feedIds={feedIds}
          setAppliedFeedFilters={setAppliedFeedFilters}
        />
      );
    } else if (bookmarks) {
      return (
        <BookmarkFeedHeader setAppliedFeedFilters={setAppliedFeedFilters} />
      );
    } else if (scheduled) {
      return (
        <ScheduledFeedHeader setAppliedFeedFilters={setAppliedFeedFilters} />
      );
    } else {
      return (
        <>
          <CreatePostCard
            open={open}
            openModal={openModal}
            closeModal={closeModal}
          />
          <div className="flex flex-row items-center mt-8">
            <div className="flex items-center">
              <FeedFilter
                appliedFeedFilters={appliedFeedFilters}
                onApplyFilters={(filters: IPostFilters) => {
                  setAppliedFeedFilters(filters);
                }}
                dataTestId="filters-dropdown"
              />

              <div className="mr-4">
                <Tooltip
                  tooltipContent="My Scheduled Posts"
                  tooltipPosition="top"
                >
                  <Link to="/scheduledPosts">
                    <Icon name="clock" size={24} />
                  </Link>
                </Tooltip>
              </div>
              <div className="mr-4">
                <Tooltip tooltipContent="My Bookmarks" tooltipPosition="top">
                  <Link to="/bookmarks" data-testid="feed-page-mybookmarks">
                    <Icon name="postBookmark" size={24} />
                  </Link>
                </Tooltip>
              </div>
            </div>
            <Divider className="bg-neutral-200" />
            <SortByDropdown />
          </div>

          {getAppliedFiltersCount() > 0 && (
            <div className="flex w-full items-center justify-between overflow-y-auto mt-2 space-x-2">
              <div className="flex items-center space-x-2">
                <div className="text-base font-medium text-neutral-500 whitespace-nowrap">
                  Filter By
                </div>
                {appliedFeedFilters[PostFilterKeys.PostType]?.map(
                  (filter: PostType) => (
                    <>
                      <div
                        key={filter}
                        className="border border-neutral-200 rounded-[8px] px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1"
                      >
                        <div className="mr-1 text-base text-primary-500 font-bold whitespace-nowrap">
                          {filterKeyMap[filter]}
                        </div>
                        <Icon
                          name="closeOutline"
                          color="text-neutral-900"
                          className="cursor-pointer"
                          size={16}
                          onClick={() => removePostTypeFilter(filter)}
                        />
                      </div>
                    </>
                  ),
                )}
              </div>

              {getAppliedFiltersCount() > 0 && (
                <div
                  className="flex items-center cursor-pointer font-medium text-neutral-500 rounded-[8px] border border-neutral-200 px-3 py-1 whitespace-nowrap"
                  onClick={clearAppliedFilters}
                >
                  Clear filters
                </div>
              )}
            </div>
          )}
        </>
      );
    }
  }, [hashtag, feedIds, bookmarks, scheduled]);

  return (
    <>
      <div className="mb-12 gap-x-[52px] flex w-full">
        <div className="z-10 min-w-[293px] max-w-[293px] sticky top-24 space-y-6">
          <UserCard />
          <MyTeamWidget />
        </div>
        <div className="w-1/2">
          {FeedHeader}
          {isLoading ? (
            <SkeletonLoader />
          ) : feedIds?.length === 0 ? (
            getEmptyFeedComponent()
          ) : (
            <div className="mt-4">
              {announcementFeedIds?.map((feedId, index) => (
                <div data-testid={`feed-post-${index}`} key={feedId.id}>
                  <Post post={feed[feedId.id!]} />
                </div>
              ))}
              {regularFeedIds?.map((feedId, index) => (
                <div data-testid={`feed-post-${index}`} key={feedId.id}>
                  <Post post={feed[feedId.id!]} />
                </div>
              ))}
            </div>
          )}

          <div className="h-12 w-12">
            {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
          </div>
          {isFetchingNextPage && <PageLoader />}
        </div>
        <div className="min-w-[293px] max-w-[293px]">
          <div className="flex flex-col gap-6 sticky top-24 overflow-y-auto max-h-[calc(100vh-120px)] widget-hide-scroll">
            <CelebrationWidget type={CELEBRATION_TYPE.Birthday} />
            <CelebrationWidget type={CELEBRATION_TYPE.WorkAnniversary} />
            <AnnouncementCard openModal={openModal} />
          </div>
        </div>
      </div>
      <PostBuilder open={open} openModal={openModal} closeModal={closeModal} />
    </>
  );
};

export default Feed;
