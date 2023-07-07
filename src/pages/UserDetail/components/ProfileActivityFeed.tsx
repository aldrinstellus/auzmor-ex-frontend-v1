import React from 'react';
import Post from 'components/Post';
import {
  useInfiniteMyProfileFeed,
  useInfinitePeopleProfileFeed,
} from 'queries/post';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import NoDataCard from './NoDataCard';
import PostBuilder from 'components/PostBuilder';
import SkeletonLoader from 'pages/Feed/components/SkeletonLoader';

export interface IProfileActivityFeedProps {
  data: any;
  userId: string;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  pathname?: string;
}

const ProfileActivityFeed: React.FC<IProfileActivityFeedProps> = ({
  data,
  pathname,
  userId,
  open,
  openModal,
  closeModal,
}) => {
  if (pathname === '/profile') {
    const { data: myProfileFeed, isLoading: myProfileFeedLoading } =
      useInfiniteMyProfileFeed();

    return (
      <div>
        <CreatePostCard
          open={open}
          openModal={openModal}
          closeModal={closeModal}
        />
        <PostBuilder
          open={open}
          openModal={openModal}
          closeModal={closeModal}
        />
        {myProfileFeedLoading && <SkeletonLoader />}
        <div className="mt-4">
          {myProfileFeed?.pages?.[0].data?.result?.data.length === 0 ? (
            <NoDataCard user={data?.fullName} />
          ) : (
            <>
              {myProfileFeed?.pages?.[0].data?.result?.data?.map(
                (post: any) => (
                  <Post post={post} key={post.id} />
                ),
              )}
            </>
          )}
        </div>
      </div>
    );
  } else {
    const { data: peopleProfileFeed, isLoading: isPeopleProfileFeedLoading } =
      useInfinitePeopleProfileFeed(userId, {});

    return (
      <div>
        {isPeopleProfileFeedLoading && <SkeletonLoader />}
        <div className="mt-4">
          {peopleProfileFeed?.pages?.[0].data?.result?.data.length === 0 ? (
            <NoDataCard user={data?.fullName} />
          ) : (
            <>
              {peopleProfileFeed?.pages?.[0].data?.result?.data?.map(
                (post: any) => (
                  <Post post={post} key={post.id} />
                ),
              )}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default ProfileActivityFeed;
