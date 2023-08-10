import React, { useEffect, useState } from 'react';
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
import FeedFilter from 'components/ActivityFeed/components/FeedFilters';
import Divider from 'components/Divider';
import SortByDropdown from 'components/ActivityFeed/components/SortByDropdown';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import PageLoader from 'components/PageLoader';
import useScrollTop from 'hooks/useScrollTop';
import SkeletonLoader from './components/SkeletonLoader';
import { useFeedStore } from 'stores/feedStore';
import useModal from 'hooks/useModal';
import { Link, useSearchParams } from 'react-router-dom';

import MyTeamWidget from 'components/MyTeamWidget';
import HashtagFeedHeader from './components/HashtagFeedHeader';
import BookmarkFeedHeader from './components/BookmarkFeedHeader';
import ScheduledFeedHeader from './components/ScheduledFeedHeader';
interface IFeedProps {}

export interface IProfileImage {
  blurHash: string;
  original: string;
}

export interface ICreated {
  designation: string;
  fullName: string;
  userId: string;
  workLocation: string;
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
  const hashtag = searchParams.get('hashtag') || '';
  const bookmarks = searchParams.get('bookmarks') || false;
  const scheduled = searchParams.get('scheduled') || false;
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

  useEffect(() => {
    if (bookmarks) {
      setAppliedFeedFilters({ bookmarks: true });
    }
  }, [bookmarks]);

  useEffect(() => {
    if (scheduled) {
      setAppliedFeedFilters({ scheduled: true });
    }
  }, [scheduled]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed(appliedFeedFilters);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const feedIds = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((post: any) => {
      try {
        return post;
      } catch (e) {
        console.log('Error', { post });
      }
    });
  }) as { id: string }[];

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
          <div className="font-bold text-base text-neutral-900 text-center mt-6">
            Not ready to share your post right now?
          </div>
          <div className="font-bold text-base text-neutral-900 text-center">
            Try scheduling for later.
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <div className="mb-12 gap-x-[52px] flex w-full">
        <div className="z-10 w-1/4 sticky top-24 space-y-6">
          <UserCard />
          <MyTeamWidget />
        </div>
        <div className="w-1/2">
          <div className="">
            {hashtag ? (
              <HashtagFeedHeader
                hashtag={hashtag}
                feedIds={feedIds}
                setAppliedFeedFilters={setAppliedFeedFilters}
              />
            ) : bookmarks ? (
              <BookmarkFeedHeader
                setAppliedFeedFilters={setAppliedFeedFilters}
              />
            ) : scheduled ? (
              <ScheduledFeedHeader
                setAppliedFeedFilters={setAppliedFeedFilters}
              />
            ) : (
              <>
                <CreatePostCard
                  open={open}
                  openModal={openModal}
                  closeModal={closeModal}
                />
                <div className="flex flex-row items-center mt-8">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <FeedFilter
                        appliedFeedFilters={appliedFeedFilters}
                        onApplyFilters={(filters: IPostFilters) => {
                          setAppliedFeedFilters(filters);
                        }}
                        dataTestId="filters-dropdown"
                      />
                    </div>
                    <Link to="/feed?scheduled=true">
                      <Icon name="clockFilled" size={24} className="mr-4" />
                    </Link>
                    <Link to="/feed?bookmarks=true">
                      <Icon name="postBookmark" size={24} className="mr-4" />
                    </Link>
                  </div>
                  <Divider className="bg-neutral-200" />
                  <SortByDropdown />
                </div>

                <div className="flex w-full items-center justify-between overflow-y-auto">
                  <div className="flex items-center space-x-2">
                    {appliedFeedFilters[PostFilterKeys.PostType]?.map(
                      (filter: PostType) => (
                        <>
                          <div className="text-base font-medium text-neutral-500">
                            Filter By
                          </div>
                          <div
                            key={filter}
                            className="border border-neutral-200 rounded-17xl px-3 py-2 flex bg-white capitalize text-sm font-medium items-center mr-1"
                          >
                            <div className="mr-1 text-sm text-primary-500 font-bold">
                              {filter.toLocaleLowerCase()}
                            </div>
                            <Icon
                              name="closeOutline"
                              stroke={twConfig.theme.colors.neutral['900']}
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
                      className="flex items-center cursor-pointer"
                      onClick={clearAppliedFilters}
                    >
                      <Icon
                        name="deleteOutline"
                        size={16}
                        className="mr-1"
                        stroke={twConfig.theme.colors.primary['600']}
                        strokeWidth={'2'}
                      />
                      <div className="font-bold text-sm text-primary-600">
                        Clear all
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            {isLoading ? (
              <SkeletonLoader />
            ) : feedIds.length === 0 ? (
              getEmptyFeedComponent()
            ) : (
              <div className="mt-4">
                {feedIds
                  .filter(({ id }) => !!feed[id])
                  .map((feedId, index) => (
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
        </div>
        <div className="w-1/4">
          <AnnouncementCard />
        </div>
      </div>
      <PostBuilder open={open} openModal={openModal} closeModal={closeModal} />
    </>
  );
};

export default Feed;
