import React, { ReactNode, useEffect, useState } from 'react';
import PostBuilder from 'components/PostBuilder';
import UserCard from 'components/UserWidget';
import AnnouncementCard from 'components/AnnouncementWidget';
import { IGetPost, useInfiniteFeed } from 'queries/post';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Post from 'components/Post';
import { useInView } from 'react-intersection-observer';
import { IMenuItem } from 'components/PopupMenu';

interface IFeedProps {}

export interface IPostTypeIcon {
  id: number;
  label: string;
  icon: ReactNode;
  menuItems: IMenuItem[];
  divider?: ReactNode;
}

export interface IProfileImage {
  blurHash: string;
  url: string;
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
  const [showModal, setShowModal] = useState(false);
  const { ref, inView } = useInView();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFeed();

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

  return (
    <>
      <div className="mb-12 space-x-8 flex relative">
        <div>
          <UserCard />
        </div>
        <div className="max-w-2xl">
          <div className="max-">
            <CreatePostCard setShowModal={setShowModal} />
            {isLoading ? (
              <div>loading...</div>
            ) : (
              <div>
                {feed.map((post) => (
                  <Post data={post} key={post.id} />
                ))}
              </div>
            )}

            <div className="h-12 w-12">
              {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
            </div>
            {isFetchingNextPage && <div>Loading more...</div>}
          </div>
        </div>
        <div className="max-w-xs">
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
