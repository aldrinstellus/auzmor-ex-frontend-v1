import React from 'react';
import Post from 'components/Post';
import {
  IGetPost,
  useInfiniteMyProfileFeed,
  useInfinitePeopleProfileFeed,
} from 'queries/post';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import NoDataCard from './NoDataCard';
import PostBuilder from 'components/PostBuilder';

export interface IProfileActivityFeedProps {
  data: any;
  userId: string;
  showFeedModal: boolean;
  setShowFeedModal: (flag: boolean) => void;
  pathname?: string;
}

const ProfileActivityFeed: React.FC<IProfileActivityFeedProps> = ({
  data,
  pathname,
  userId,
  showFeedModal,
  setShowFeedModal,
}) => {
  if (pathname === '/profile') {
    const { data: myProfileFeed, isLoading: myProfileFeedLoading } =
      useInfiniteMyProfileFeed();

    return (
      <div>
        <CreatePostCard setShowModal={setShowFeedModal} />
        <PostBuilder
          showModal={showFeedModal}
          setShowModal={setShowFeedModal}
        />
        {myProfileFeedLoading && <div className="mt-4">loading...</div>}
        <div className="mt-4">
          {myProfileFeed?.pages?.[0].data?.result?.data.length === 0 ? (
            <NoDataCard user={data?.fullName} />
          ) : (
            <>
              {myProfileFeed?.pages?.[0].data?.result?.data?.map(
                (post: any) => (
                  <Post data={post} key={post.id} />
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
        {isPeopleProfileFeedLoading && <div className="mt-4">loading...</div>}
        <div className="mt-4">
          {peopleProfileFeed?.pages?.[0].data?.result?.data.length === 0 ? (
            <NoDataCard user={data?.fullName} />
          ) : (
            <>
              {peopleProfileFeed?.pages?.[0].data?.result?.data?.map(
                (post: any) => (
                  <Post data={post} key={post.id} />
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
