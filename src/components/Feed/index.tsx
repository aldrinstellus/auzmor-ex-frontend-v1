import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import PageLoader from 'components/PageLoader';
import PostBuilder from 'components/PostBuilder';
import useMediaQuery from 'hooks/useMediaQuery';
import useModal from 'hooks/useModal';
import useRole from 'hooks/useRole';
import {
  IPostFilters,
  PostFilterKeys,
  PostFilterPreference,
  PostType,
  PostTypeMapping,
  useInfiniteFeed,
} from 'queries/post';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FeedModeEnum, useFeedStore } from 'stores/feedStore';
import { getLearnUrl, isFiltersEmpty, isRegularPost } from 'utils/misc';
import NoPosts from 'images/NoPostsFound.png';
import SkeletonLoader from './components/SkeletonLoader';
import VirtualisedPost from 'components/VirtualisedPost';
import useScrollTop from 'hooks/useScrollTop';
import HashtagFeedHeader from './components/HashtagFeedHeader';
import BookmarkFeedHeader from './components/BookmarkFeedHeader';
import ScheduledFeedHeader from './components/ScheduledFeedHeader';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import FeedFilter, {
  filterKeyMap,
} from 'components/ActivityFeed/components/FeedFilters';
import AppLauncher from 'components/AppLauncher';
import LinksWidget, { LinksWidgetProps } from 'components/LinksWidget';
import ChannelRequestWidget, {
  ChannelRequestWidgetProps,
} from 'components/ChannelRequestWidget';
import MembersWidget, {
  MembersWidgetProps,
} from 'pages/ChannelDetail/components/MembersWidget';
import AdminsWidget from 'pages/ChannelDetail/components/AdminsWidget';
import { IChannel } from 'stores/channelStore';
import { useGetRecommendation } from 'queries/learn';
import useAuth from 'hooks/useAuth';
import Recommendation from 'components/Recommendation';
import ChannelsWidget from 'components/ChannelsWidget';
import MyTeamWidget, { IMyTeamWidgetProps } from 'components/MyTeamWidget';
import ProgressTrackerWidget from 'components/ProgressTrackerWidget';
import CelebrationWidget, {
  ICelebrationWidgetProps,
} from 'components/CelebrationWidget';
import EventWidget, { IEventWidgetProps } from 'components/EventWidget';
import AnnouncementCard, {
  IAnnouncementCardProps,
} from 'components/AnnouncementWidget';
import UserCard from 'components/UserWidget';
import Welcome from 'pages/ChannelDetail/components/Home/Welcome';
import FinishSetup from 'pages/ChannelDetail/components/Home/FinishSetup';

export enum WidgetEnum {
  AppLauncher = 'APP_LAUNCHER',
  Links = 'LINKS',
  ChannelRequest = 'CHANNEL_REQUEST',
  ChannelMember = 'CHANNEL_MEMBER',
  ChannelAdmin = 'CHANNEL_ADMIN',
  UserCard = 'USER_CARD',
  Channels = 'CHANNELS',
  MyTeam = 'MY_TEAM',
  ProgressTracker = 'PROGRESS_TRACKER',
  CelebrationBirthday = 'CELEBRATION_BIRTHDAY',
  CelebrationAnniversary = 'CELEBRATION_ANNIVERSARY',
  Event = 'EVENT',
  AnnouncementCard = 'ANNOUNCEMENT_CARD',
}

export const widgetMapping = {
  [WidgetEnum.AppLauncher]: AppLauncher,
  [WidgetEnum.Links]: LinksWidget,
  [WidgetEnum.ChannelRequest]: ChannelRequestWidget,
  [WidgetEnum.ChannelMember]: MembersWidget,
  [WidgetEnum.ChannelAdmin]: AdminsWidget,
  [WidgetEnum.UserCard]: UserCard,
  [WidgetEnum.Channels]: ChannelsWidget,
  [WidgetEnum.MyTeam]: MyTeamWidget,
  [WidgetEnum.ProgressTracker]: ProgressTrackerWidget,
  [WidgetEnum.CelebrationBirthday]: CelebrationWidget,
  [WidgetEnum.CelebrationAnniversary]: CelebrationWidget,
  [WidgetEnum.Event]: EventWidget,
  [WidgetEnum.AnnouncementCard]: AnnouncementCard,
};

interface IFeedProps {
  leftWidgets: WidgetEnum[];
  rightWidgets: WidgetEnum[];
  mode?: FeedModeEnum;
  widgetProps?: {
    [WidgetEnum.AppLauncher]?: null;
    [WidgetEnum.Links]?: LinksWidgetProps;
    [WidgetEnum.ChannelRequest]?: ChannelRequestWidgetProps;
    [WidgetEnum.ChannelMember]?: MembersWidgetProps;
    [WidgetEnum.ChannelAdmin]?: null;
    [WidgetEnum.UserCard]?: null;
    [WidgetEnum.Channels]?: null;
    [WidgetEnum.MyTeam]?: IMyTeamWidgetProps;
    [WidgetEnum.ProgressTracker]?: null;
    [WidgetEnum.CelebrationBirthday]?: ICelebrationWidgetProps;
    [WidgetEnum.CelebrationAnniversary]?: ICelebrationWidgetProps;
    [WidgetEnum.Event]?: IEventWidgetProps;
    [WidgetEnum.AnnouncementCard]?: IAnnouncementCardProps;
  };
  modeProps?: {
    [FeedModeEnum.Default]?: {
      params?: {
        entityType: string;
        entityId: string;
      };
    };
    [FeedModeEnum.Channel]?: {
      params?: {
        entityType: string;
        entityId: string;
      };
      channel: IChannel;
    };
    [FeedModeEnum.Personal]?: {
      params?: {
        entityType: string;
        entityId: string;
      };
    };
  };
}

const Feed: FC<IFeedProps> = ({
  leftWidgets,
  rightWidgets,
  mode = FeedModeEnum.Default,
  widgetProps,
  modeProps,
}) => {
  const { t } = useTranslation('feed');
  const isLargeScreen = useMediaQuery('(min-width: 1300px)');
  const [open, openModal, closeModal] = useModal(undefined, false);
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { feed, setActiveFeedPostCount, setFeedMode } = useFeedStore();
  const { pathname } = useLocation();
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const currentDate = new Date().toISOString();
  const [appliedFeedFilters, setAppliedFeedFilters] = useState<IPostFilters>({
    [PostFilterKeys.PostType]: [],
    [PostFilterKeys.PostPreference]: [],
  });
  const { getScrollTop, pauseRecordingScrollTop, resumeRecordingScrollTop } =
    useScrollTop('app-shell-container');

  const hashtag = searchParams.get('hashtag') || '';
  let bookmarks = false;
  let scheduled = false;
  let apiEndpoint = '/feed';

  switch (mode) {
    case FeedModeEnum.Default:
      bookmarks = pathname === '/bookmarks';
      scheduled = pathname === '/scheduledPosts';
      break;
    case FeedModeEnum.Channel:
      bookmarks =
        pathname ===
        `/channels/${modeProps?.[FeedModeEnum.Channel]?.channel.id}/bookmarks`;
      scheduled =
        pathname ===
        `/channels/${
          modeProps?.[FeedModeEnum.Channel]?.channel.id
        }/scheduledPosts`;
      break;
  }

  if (bookmarks) {
    apiEndpoint = '/bookmarks';
  }
  if (scheduled) apiEndpoint = '/scheduledPosts';

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

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    setFeedMode(mode);
  }, [mode]);

  useEffect(() => {
    if (!searchParams.has('hashtag')) {
      setAppliedFeedFilters({ hashtags: [] });
    }
    if (hashtag) {
      setAppliedFeedFilters({ hashtags: [hashtag] });
    }
  }, [hashtag]);

  // Learn data
  const { data: recommendationData, isLoading: recommendationLoading } =
    useGetRecommendation(mode === FeedModeEnum.Default);
  const trendingCards =
    recommendationData?.data?.result?.data?.trending?.trainings || [];
  const recentlyPublishedCards =
    recommendationData?.data?.result?.data?.recently_published?.trainings || [];

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed(
      apiEndpoint,
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
        ...((modeProps as any)[mode as any]?.params || {}),
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

  useEffect(() => setActiveFeedPostCount(feedIds.length), [feedIds]);

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
            {t('bookmark.noPostFound')}
          </div>
          <div className="text-center mt-1" style={{ color: '#737373' }}>
            {t('bookmark.emptyMessage')}
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
              {t('scheduledPosts.emptyMessage1')}
            </div>
            <div className="font-bold text-base text-neutral-900 text-center">
              {t('scheduledPosts.emptyMessage2')}
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
    const getScheduleLinkTo = () => {
      switch (mode) {
        case FeedModeEnum.Default:
          return '/scheduledPosts';
        case FeedModeEnum.Channel:
          return `/channels/${
            modeProps?.[FeedModeEnum.Channel]?.channel.id
          }/scheduledPosts`;
        default:
          return '/scheduledPosts';
      }
    };
    const getBookmarkLinkTo = () => {
      switch (mode) {
        case FeedModeEnum.Default:
          return '/bookmarks';
        case FeedModeEnum.Channel:
          return `/channels/${
            modeProps?.[FeedModeEnum.Channel]?.channel.id
          }/bookmarks`;
        default:
          return '/bookmarks';
      }
    };
    if (hashtag) {
      return (
        <HashtagFeedHeader
          hashtag={hashtag}
          feedIds={feedIds}
          setAppliedFeedFilters={setAppliedFeedFilters}
        />
      );
    } else if (bookmarks) {
      return <BookmarkFeedHeader mode={mode} />;
    } else if (scheduled) {
      return <ScheduledFeedHeader mode={mode} />;
    } else {
      return (
        <div className="flex flex-col gap-6">
          <CreatePostCard openModal={openModal} />
          <div className=" flex flex-col gap-6">
            <div className="flex flex-row items-center gap-6">
              <div className="flex items-center gap-4 z-20">
                <Tooltip
                  tooltipContent={t('scheduledPosts.tooltip')}
                  tooltipPosition="top"
                >
                  <Link
                    to={getScheduleLinkTo()}
                    aria-label="scheduled posts"
                    tabIndex={0}
                    className="outline-none"
                  >
                    <Icon name="clock" size={24} />
                  </Link>
                </Tooltip>
                <Tooltip
                  tooltipContent={t('bookmark.tooltip')}
                  tooltipPosition="top"
                >
                  <Link
                    to={getBookmarkLinkTo()}
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

  const getWidgets = (widgetList: WidgetEnum[]) => {
    let Widget: any = null;

    if (!isLargeScreen) {
      widgetList = [...widgetList, ...rightWidgets];
    }
    return widgetList.map((widgetenum) => {
      Widget = widgetMapping[widgetenum];
      if (widgetProps && widgetProps[widgetenum]) {
        if (widgetenum === WidgetEnum.AnnouncementCard) {
          return (
            <Widget
              {...widgetProps[widgetenum]}
              key={widgetenum}
              openModal={openModal}
            />
          );
        }
        return <Widget {...widgetProps[widgetenum]} key={widgetenum} />;
      }
      return <Widget key={widgetenum} />;
    });
  };

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

  const getListItem = (id: string, index: number) => {
    return (
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
        {mode === FeedModeEnum.Default && (
          <>
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
        )}
      </>
    );
  };

  return (
    <section className="pb-6 flex justify-between gap-12">
      {/* Left section */}
      <section className="z-10 w-[293px] flex flex-col gap-6">
        {getWidgets(leftWidgets)}
      </section>

      {/* Feed section */}
      <section className="flex-grow w-0 flex flex-col gap-6">
        {/* Various feed headers */}
        {FeedHeader}

        {/* Feed */}
        {mode === FeedModeEnum.Channel && (
          <>
            <Welcome />
            <FinishSetup
              channelData={modeProps![FeedModeEnum.Channel]!.channel}
            />
          </>
        )}
        {isLoading ? (
          <SkeletonLoader />
        ) : feedIds?.length === 0 ? (
          getEmptyFeedComponent()
        ) : (
          <ul className="flex flex-col gap-6">
            {[...announcementFeedIds, ...regularFeedIds]?.map(({ id }, index) =>
              getListItem(id, index),
            )}
          </ul>
        )}

        {/* Load more components */}
        {isFetchingNextPage ? (
          <div className="h-2">
            <PageLoader />
          </div>
        ) : (
          <div className="h-12 w-12">{hasNextPage && <div ref={ref} />}</div>
        )}
      </section>

      {/* Right section */}
      {isLargeScreen && (
        <section className="w-[293px] flex flex-col gap-6">
          {getWidgets(rightWidgets)}
        </section>
      )}
      {open && (
        <PostBuilder
          open={open}
          openModal={openModal}
          closeModal={closeModal}
        />
      )}
    </section>
  );
};

export default Feed;
