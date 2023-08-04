import React, { useEffect, useState } from 'react';
import PostBuilder from 'components/PostBuilder';
import UserCard from 'components/UserWidget';
import AnnouncementCard from 'components/AnnouncementWidget';
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
import { useSearchParams } from 'react-router-dom';
import HashtagIcon from 'images/hashtag.svg';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const hashtag = searchParams.get('hashtag') || '';
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

  return (
    <>
      <div className="mb-12 gap-x-[52px] flex w-full">
        <div className="top-10 z-10 w-1/4">
          <UserCard className="sticky top-24" />
        </div>
        <div className="w-1/2">
          <div className="">
            {hashtag ? (
              <div className="bg-orange-50 shadow-md rounded-9xl h-24 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="gap-y-1">
                    <div className="flex gap-x-3 items-center">
                      <Icon
                        name="arrowLeft"
                        fill="#171717"
                        stroke="#171717"
                        onClick={() => {
                          if (searchParams.has('hashtag')) {
                            searchParams.delete('hashtag');
                            setSearchParams(searchParams);
                            setAppliedFeedFilters({ hashtags: [''] });
                          }
                        }}
                      />
                      <div className="text-2xl font-bold text-neutral-900">
                        <span>#</span>
                        {hashtag}
                      </div>
                    </div>
                    <div className="text-base font-normal text-neutral-500">
                      {hashtag && feedIds?.length} people are posting about this
                    </div>
                  </div>
                  <div>
                    <img src={HashtagIcon} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <CreatePostCard
                  open={open}
                  openModal={openModal}
                  closeModal={closeModal}
                />
                <div className="flex flex-row items-center gap-x-2 mt-8">
                  <FeedFilter
                    appliedFeedFilters={appliedFeedFilters}
                    onApplyFilters={(filters: IPostFilters) => {
                      setAppliedFeedFilters(filters);
                    }}
                    dataTestId="filters-dropdown"
                  />
                  <Divider className="bg-neutral-200" />
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
              </>
            )}
            {isLoading ? (
              <SkeletonLoader />
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
