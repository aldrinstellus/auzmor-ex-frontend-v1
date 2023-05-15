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
  const {
    data: myProfileActivityFeed,
    isLoading: isMyProfileActivityFeedLoading,
  } = useInfiniteMyProfileFeed();
  const { data: peopleProfileFeedData, isLoading: isPeopleProfileFeedLoading } =
    useInfinitePeopleProfileFeed(userId, {});

  const myProfileFeed = myProfileActivityFeed?.pages.flatMap((page) => {
    return page.data?.result?.data.map((post: any) => {
      try {
        return post;
      } catch (e) {
        console.log('Error', { post });
      }
    });
  }) as IGetPost[];

  const peopleProfileFeed = peopleProfileFeedData?.pages.flatMap((page) => {
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
      {pathname === '/profile' ? (
        <div>
          <CreatePostCard setShowModal={setShowFeedModal} />
          <PostBuilder
            showModal={showFeedModal}
            setShowModal={setShowFeedModal}
          />
          {isMyProfileActivityFeedLoading && (
            <div className="mt-4">loading...</div>
          )}
          <div className="mt-4">
            {myProfileFeed?.length === 0 ? (
              <NoDataCard user={data?.fullName} />
            ) : (
              <>
                {myProfileFeed?.map((post) => (
                  <Post data={post} key={post.id} />
                ))}
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <CreatePostCard setShowModal={setShowFeedModal} />
          <PostBuilder
            showModal={showFeedModal}
            setShowModal={setShowFeedModal}
          />
          {isPeopleProfileFeedLoading && <div className="mt-4">loading...</div>}
          <div className="mt-4">
            {peopleProfileFeed?.length === 0 ? (
              <NoDataCard user={data?.fullName} />
            ) : (
              <>
                {peopleProfileFeed?.map((post) => (
                  <Post data={post} key={post.id} />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileActivityFeed;
