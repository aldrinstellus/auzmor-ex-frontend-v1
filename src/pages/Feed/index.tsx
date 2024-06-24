import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

// components
import PostBuilder from 'components/PostBuilder';
import UserCard from 'components/UserWidget';
import AnnouncementCard from 'components/AnnouncementWidget';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import VirtualisedPost from 'components/VirtualisedPost';
import FeedFilter, {
  filterKeyMap,
} from 'components/ActivityFeed/components/FeedFilters';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import PageLoader from 'components/PageLoader';
import SkeletonLoader from './components/SkeletonLoader';
import HashtagFeedHeader from './components/HashtagFeedHeader';
import BookmarkFeedHeader from './components/BookmarkFeedHeader';
import ScheduledFeedHeader from './components/ScheduledFeedHeader';
import Tooltip from 'components/Tooltip';
import CelebrationWidget, {
  CELEBRATION_TYPE,
} from 'components/CelebrationWidget';

// hooks
import useScrollTop from 'hooks/useScrollTop';
import useModal from 'hooks/useModal';

// queries
import {
  IPostFilters,
  PostFilterKeys,
  PostFilterPreference,
  PostType,
  PostTypeMapping,
  useInfiniteFeed,
} from 'queries/post';

// store
import { useFeedStore } from 'stores/feedStore';

// misc
import NoPosts from 'images/NoPostsFound.png';
import AppLauncher from 'components/AppLauncher';
import MyTeamWidget from 'components/MyTeamWidget';
import useRole from 'hooks/useRole';
import { getLearnUrl, isFiltersEmpty, isRegularPost } from 'utils/misc';
import useMediaQuery from 'hooks/useMediaQuery';
import ProgressTrackerWidget from 'components/ProgressTrackerWidget';
import EventWidget from 'components/EventWidget';
import { useGetRecommendation } from 'queries/learn';
import Recommendation from 'components/Recommendation';
import useAuth from 'hooks/useAuth';
import { usePageTitle } from 'hooks/usePageTitle';

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

const Feed: FC<IFeedProps> = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1300px)');
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const hashtag = searchParams.get('hashtag') || '';
  const bookmarks = pathname === '/bookmarks';
  const scheduled = pathname === '/scheduledPosts';
  const [open, openModal, closeModal] = useModal(undefined, false);
  const [appliedFeedFilters, setAppliedFeedFilters] = useState<IPostFilters>({
    [PostFilterKeys.PostType]: [],
    [PostFilterKeys.PostPreference]: [],
  });
  const { isAdmin } = useRole();
  const { feed } = useFeedStore();
  const { ref, inView } = useInView();
  const currentDate = new Date().toISOString();
  const { getScrollTop, pauseRecordingScrollTop, resumeRecordingScrollTop } =
    useScrollTop('app-shell-container');
  const { user } = useAuth();

  // Set page title
  if (scheduled) {
    usePageTitle('scheduledPosts');
  } else if (bookmarks) {
    usePageTitle('bookmarks');
  } else {
    usePageTitle('feed');
  }

  //handle scroll
  useEffect(() => {
    if (hashtag) {
      pauseRecordingScrollTop();
      const ele = document.getElementById('app-shell-container');
      if (ele) {
        ele.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    } else {
      resumeRecordingScrollTop();
      const ele = document.getElementById('app-shell-container');
      if (ele) {
        ele.scrollTo({
          top: getScrollTop(),
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [hashtag]);

  // Learn data
  const { data: recommendationData, isLoading: recommendationLoading } =
    useGetRecommendation();
  const trendingCards =
    recommendationData?.data?.result?.data?.trending?.trainings || [];
  const recentlyPublishedCards =
    recommendationData?.data?.result?.data?.recently_published?.trainings || [];

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed(
      pathname,
      isFiltersEmpty({
        [PostFilterKeys.PostType]: appliedFeedFilters[PostFilterKeys.PostType]
          ?.map((postType) => (PostTypeMapping as any)[postType] || postType)
          .flat(),
        ...(appliedFeedFilters[PostFilterKeys.PostPreference]?.includes(
          PostFilterPreference.BookmarkedByMe,
        ) && { [PostFilterPreference.BookmarkedByMe]: true }),
        ...(appliedFeedFilters[PostFilterKeys.PostPreference]?.includes(
          PostFilterPreference.MentionedInPost,
        ) && { [PostFilterPreference.MentionedInPost]: true }),
        ...(appliedFeedFilters[PostFilterKeys.PostPreference]?.includes(
          PostFilterPreference.MyPosts,
        ) && { [PostFilterPreference.MyPosts]: true }),
        [PostFilterKeys.Hashtags]: appliedFeedFilters[PostFilterKeys.Hashtags],
      }),
    );

  const feedIds = (
    (data?.pages.flatMap((page) =>
      page.data?.result?.data
        .filter((post: { id: string }) => {
          if (bookmarks) {
            return !!feed[post.id]?.bookmarked;
          } else if (scheduled) {
            return !!feed[post.id]?.schedule;
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
          !isRegularPost(feed[post.id], currentDate, isAdmin),
      )
    : [];

  const regularFeedIds = feedIds
    ? feedIds.filter((post: { id: string }) =>
        isRegularPost(feed[post.id], currentDate, isAdmin),
      )
    : [];

  const clearAppliedFilters = () => {
    setAppliedFeedFilters({
      ...appliedFeedFilters,
      [PostFilterKeys.PostType]: [],
      [PostFilterKeys.PostPreference]: [],
    });
  };

  const getAppliedFiltersCount = () => {
    return (
      appliedFeedFilters[PostFilterKeys.PostType]?.length ||
      appliedFeedFilters[PostFilterKeys.PostPreference]?.length ||
      0
    );
  };

  const removePostTypeFilter = (
    filter: PostType | PostFilterPreference,
    type: PostFilterKeys.PostType | PostFilterKeys.PostPreference,
  ) => {
    if (
      type === PostFilterKeys.PostType &&
      appliedFeedFilters[PostFilterKeys.PostType]
    ) {
      setAppliedFeedFilters({
        ...appliedFeedFilters,
        [PostFilterKeys.PostType]: appliedFeedFilters[
          PostFilterKeys.PostType
        ].filter((each) => each !== filter),
      });
    }
    if (
      type === PostFilterKeys.PostPreference &&
      appliedFeedFilters[PostFilterKeys.PostPreference]
    ) {
      setAppliedFeedFilters({
        ...appliedFeedFilters,
        [PostFilterKeys.PostPreference]: appliedFeedFilters[
          PostFilterKeys.PostPreference
        ].filter((each) => each !== filter),
      });
    }
  };

  const handleApplyFilter = useCallback((filters: IPostFilters) => {
    setAppliedFeedFilters(filters);
  }, []);

  const getEmptyFeedComponent = () => {
    if (bookmarks) {
      return (
        <div className="bg-white p-6 flex flex-col rounded-9xl">
          <div className="h-220 bg-blue-50 flex justify-center rounded-9xl">
            <img
              src={NoPosts}
              data-testid="mybookmark-tab-nopost"
              alt="No Posts"
            />
          </div>
          <div className="font-bold text-2xl/[36px] text-center mt-5">
            No posts found
          </div>
          <div className="text-center mt-1" style={{ color: '#737373' }}>
            Your bookmarked posts will show here
          </div>
        </div>
      );
    }
    if (scheduled) {
      return (
        <div className="bg-white p-6 flex flex-col rounded-9xl">
          <div className="h-220 bg-blue-50 flex justify-center rounded-9xl">
            <img
              src={NoPosts}
              data-testid="mybookmark-tab-nopost"
              alt="No Posts"
            />
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
    }
    if (
      appliedFeedFilters[PostFilterKeys.PostType]?.length ||
      appliedFeedFilters[PostFilterKeys.PostPreference]?.length
    ) {
      return (
        <div className="bg-white p-6 flex flex-col rounded-9xl">
          <div className="h-220 bg-blue-50 flex justify-center rounded-9xl">
            <img
              src={NoPosts}
              data-testid="mybookmark-tab-nopost"
              alt="No Posts"
            />
          </div>
          <div className="font-bold text-2xl/[36px] text-center mt-5">
            No posts found
          </div>
        </div>
      );
    }
    if (feedIds?.length == 0) {
      return (
        <div className="bg-white p-6 flex flex-col rounded-9xl">
          <div className="h-220 bg-blue-50 flex justify-center rounded-9xl">
            <img
              src={NoPosts}
              data-testid="mybookmark-tab-nopost"
              alt="No Posts"
            />
          </div>
          <div data-testid="scheduledpost-tab-nodata">
            <div className="text-neutral-900 font-semibold text-lg mt-6 text-center">
              Publish your first post!
            </div>
            <div className="text-neutral-500 text-sm font-medium text-center mt-2">
              Post something interesting for your audience, share an update,
              <br /> or just make a little introduction to the teams.
            </div>
          </div>
        </div>
      );
    }
  };

  const FilterPill = ({
    name,
    onClick,
  }: {
    name: string;
    onClick: () => void;
  }) => (
    <div
      key={name}
      className="border border-neutral-200 rounded-[24px] px-3 py-1 bg-white items-center flex gap-2 cursor-pointer outline-none group"
      onClick={onClick}
      onKeyUp={(e) => (e.code === 'Enter' ? onClick() : '')}
      tabIndex={0}
    >
      <p className="text-sm font-medium whitespace-nowrap text-neutral-900 group-hover:text-primary-600">
        {name}
      </p>
      <Icon
        name="closeCircleOutline"
        color="text-neutral-900"
        className="cursor-pointer"
        size={16}
      />
    </div>
  );

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
        <div className="flex flex-col gap-6">
          <CreatePostCard openModal={openModal} />
          <div className=" flex flex-col gap-6">
            <div className="flex flex-row items-center gap-6">
              <div className="flex items-center gap-4 z-20">
                <Tooltip
                  tooltipContent="My Scheduled Posts"
                  tooltipPosition="top"
                >
                  <Link
                    to="/scheduledPosts"
                    aria-label="scheduled posts"
                    tabIndex={0}
                    className="outline-none"
                  >
                    <Icon name="clock" size={24} />
                  </Link>
                </Tooltip>
                <Tooltip tooltipContent="My Bookmarks" tooltipPosition="top">
                  <Link
                    to="/bookmarks"
                    data-testid="feed-page-mybookmarks"
                    aria-label="bookmarked posts"
                    className="outline-none"
                  >
                    <Icon name="postBookmark" size={24} />
                  </Link>
                </Tooltip>
              </div>
              <Divider className="bg-neutral-200 flex-1" />
              <div className="flex items-center gap-3">
                {getAppliedFiltersCount() > 0 && (
                  <div
                    className="flex items-center gap-1 cursor-pointer text-sm font-bold text-primary-600 bg-transparent"
                    onClick={clearAppliedFilters}
                    onKeyUp={(e) =>
                      e.code === 'Enter' ? clearAppliedFilters() : ''
                    }
                    tabIndex={0}
                    role="button"
                  >
                    <Icon
                      name="deleteOutline"
                      color="text-primary-600"
                      className="cursor-pointer"
                      size={16}
                    />
                    Clear All Filters
                  </div>
                )}
                <FeedFilter
                  appliedFeedFilters={appliedFeedFilters}
                  onApplyFilters={handleApplyFilter}
                  dataTestId="filters-dropdown"
                />
              </div>
            </div>

            {getAppliedFiltersCount() > 0 && (
              <div className="flex w-full flex-wrap items-center gap-1">
                {appliedFeedFilters[PostFilterKeys.PostType]?.map(
                  (filter: PostType) => (
                    <FilterPill
                      key={filter}
                      name={filterKeyMap[filter]}
                      onClick={() =>
                        removePostTypeFilter(filter, PostFilterKeys.PostType)
                      }
                    />
                  ),
                )}
                {appliedFeedFilters[PostFilterKeys.PostPreference]?.map(
                  (filter: PostFilterPreference) => (
                    <FilterPill
                      key={filter}
                      name={filterKeyMap[filter]}
                      onClick={() =>
                        removePostTypeFilter(
                          filter,
                          PostFilterKeys.PostPreference,
                        )
                      }
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  }, [hashtag, feedIds, bookmarks, scheduled]);

  useEffect(() => {
    if (!searchParams.has('hashtag')) {
      setAppliedFeedFilters({ hashtags: [] });
    }
    if (hashtag) {
      setAppliedFeedFilters({ hashtags: [hashtag] });
    }
  }, [hashtag]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getRightWidgets = () => (
    <>
      <ProgressTrackerWidget />
      <EventWidget className="sticky top-24" />
      <CelebrationWidget type={CELEBRATION_TYPE.Birthday} />
      <CelebrationWidget type={CELEBRATION_TYPE.WorkAnniversary} />
      <AnnouncementCard openModal={openModal} className="sticky top-24" />
    </>
  );

  const recommendationIndex = useMemo(() => {
    const totalPosts = announcementFeedIds.length + regularFeedIds.length;
    if (totalPosts > 10) {
      if (trendingCards.length > 1) {
        if (recentlyPublishedCards.length > 1) {
          return { tIndex: 4, rIndex: 9 };
        } else {
          return { tIndex: 4, rIndex: -1 };
        }
      } else {
        if (recentlyPublishedCards.length > 1) {
          return { tIndex: -1, rIndex: 4 };
        } else {
          return { tIndex: -1, rIndex: -1 };
        }
      }
    } else if (totalPosts <= 10 && totalPosts > 3) {
      if (trendingCards.length > 1) {
        if (recentlyPublishedCards.length > 1) {
          return { tIndex: 2, rIndex: 5 };
        } else {
          return { tIndex: 2, rIndex: -1 };
        }
      } else {
        if (recentlyPublishedCards.length > 1) {
          return { tIndex: -1, rIndex: 2 };
        } else {
          return { tIndex: -1, rIndex: -1 };
        }
      }
    } else if (totalPosts >= 3 && totalPosts < 5) {
      if (trendingCards.length > 1) {
        return { tIndex: 2, rIndex: -1 };
      } else {
        if (recentlyPublishedCards.length > 1) {
          return { tIndex: -1, rIndex: 2 };
        } else {
          return { tIndex: -1, rIndex: -1 };
        }
      }
    } else return { tIndex: -1, rIndex: -1 };
  }, [announcementFeedIds, regularFeedIds]);

  const handleTrendingContent = () => {
    if (user?.preferences?.learnerViewType === 'MODERN') {
      window.location.assign(`${getLearnUrl()}/user/trainings`);
    } else {
      window.location.assign(`${getLearnUrl()}/user/courses`);
    }
  };

  const handleRecentlyPublishContent = () => {
    if (user?.preferences?.learnerViewType === 'MODERN') {
      window.location.assign(
        `${getLearnUrl()}/user/trainings?type=elearning&tab=PUBLIC&sort=created_at`,
      );
    } else {
      window.location.assign(
        `${getLearnUrl()}/user/courses/shared?sort=created_at&viewAs=Grid`,
      );
    }
  };

  return (
    <div className="pb-6 flex justify-between">
      <h1 className="fixed top-0 left-0">Your feed page</h1>
      <section className="z-10 w-[293px] flex flex-col gap-6">
        <UserCard />
        <AppLauncher />
        {isLargeScreen && <MyTeamWidget className="sticky top-24" />}
        {!isLargeScreen && <MyTeamWidget />}
        {!isLargeScreen && getRightWidgets()}
      </section>
      <section className="flex-grow w-0 flex flex-col gap-6 px-12">
        {FeedHeader}
        {isLoading ? (
          <SkeletonLoader />
        ) : feedIds?.length === 0 ? (
          getEmptyFeedComponent()
        ) : (
          <ul className="flex flex-col gap-6">
            {[...announcementFeedIds, ...regularFeedIds]?.map(
              ({ id }, index) => (
                <>
                  <li
                    data-testid={`feed-post-${index}`}
                    className="flex flex-col gap-6"
                    key={id}
                    tabIndex={0}
                    title={`post ${index + 1}`}
                  >
                    <VirtualisedPost
                      postId={id!}
                      commentIds={feed[id]?.relevantComments || []}
                    />
                  </li>
                  {index === recommendationIndex.tIndex && (
                    <li
                      data-testid={`trending-content-post`}
                      tabIndex={0}
                      title="trending content"
                    >
                      <Recommendation
                        cards={trendingCards}
                        title="Trending Content"
                        isLoading={recommendationLoading}
                        onCLick={handleTrendingContent}
                      />
                    </li>
                  )}
                  {index === recommendationIndex.rIndex && (
                    <li
                      data-testid={`recently-published-content-post`}
                      tabIndex={0}
                      title="recently published"
                    >
                      <Recommendation
                        cards={recentlyPublishedCards}
                        title="Recently Published"
                        isLoading={recommendationLoading}
                        onCLick={handleRecentlyPublishContent}
                      />
                    </li>
                  )}
                </>
              ),
            )}
          </ul>
        )}

        {isFetchingNextPage ? (
          <div className="h-2">
            <PageLoader />
          </div>
        ) : (
          <div className="h-12 w-12">{hasNextPage && <div ref={ref} />}</div>
        )}
      </section>
      {isLargeScreen && (
        <section className="w-[293px] flex flex-col gap-6">
          {getRightWidgets()}
        </section>
      )}
      {open && (
        <PostBuilder
          open={open}
          openModal={openModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Feed;
