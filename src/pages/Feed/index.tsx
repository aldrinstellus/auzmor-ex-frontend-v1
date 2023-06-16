import React, { useEffect, useState } from 'react';
import PostBuilder from 'components/PostBuilder';
import UserCard from 'components/UserWidget';
import AnnouncementCard from 'components/AnnouncementWidget';
import {
  IGetPost,
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
  id: string;
  type: string;
  reaction: string;
  createdBy: ICreated;
}

const Feed: React.FC<IFeedProps> = () => {
  useScrollTop();
  const [showModal, setShowModal] = useState(false);
  const [appliedFeedFilters, setAppliedFeedFilters] = useState<IPostFilters>({
    [PostFilterKeys.PostType]: [],
  });
  const { ref, inView } = useInView();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed(appliedFeedFilters);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const feed = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((post: any) => {
      try {
        return post;
      } catch (e) {
        console.log('Error', { post });
      }
    });
  }) as IGetPost[];

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

  return (
    <>
      <div className="mb-12 space-x-8 flex w-full">
        <div className="top-10 z-10 w-1/4">
          <UserCard className="sticky top-24" />
        </div>
        <div className="w-1/2">
          <div className="">
            <CreatePostCard setShowModal={setShowModal} />
            <div className="flex flex-row items-center gap-x-2 mt-8">
              <FeedFilter
                appliedFeedFilters={appliedFeedFilters}
                onApplyFilters={(filters: IPostFilters) => {
                  setAppliedFeedFilters(filters);
                }}
                dataTestId="filters-dropdown"
              />
              <Divider />
              <SortByDropdown />
            </div>
            <div className="flex w-full overflow-y-auto">
              {appliedFeedFilters[PostFilterKeys.PostType]?.map(
                (filter: PostType) => (
                  <div
                    key={filter}
                    className="border border-neutral-200 rounded-17xl px-3 py-2 flex bg-white capitalize text-sm font-medium items-center mr-1"
                  >
                    <div className="mr-1">{filter.toLocaleLowerCase()}</div>
                    <Icon
                      name="closeCircleOutline"
                      stroke={twConfig.theme.colors.neutral['900']}
                      className="cursor-pointer"
                      onClick={() => removePostTypeFilter(filter)}
                    />
                  </div>
                ),
              )}
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
            {isLoading ? (
              <PageLoader />
            ) : (
              <div className="mt-4">
                {feed.map((post, index) => (
                  <div data-testid={`feed-post-${index}`} key={post.id}>
                    <Post data={post} />
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
        {/* <ActivityFeed
      activityFeed={feed}
      loadMore={fetchNextPage}
      setShowModal={setShowModal}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
    /> */}
      </div>
      <PostBuilder showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default Feed;
