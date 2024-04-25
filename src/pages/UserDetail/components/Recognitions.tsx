import Post from 'components/Post';
import {
  useInfiniteMyRecognitionFeed,
  useInfinitePeopleProfileRecognitionFeed,
} from 'queries/post';
import NoDataCard from './NoDataCard';
import SkeletonLoader from 'pages/Feed/components/SkeletonLoader';
import { useFeedStore } from 'stores/feedStore';
import { FC } from 'react';

export type AppProps = {
  data: any;
  userId: string;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  pathname?: string;
};

const Recognitions: FC<AppProps> = ({ data, pathname, userId }) => {
  const { feed } = useFeedStore();

  if (pathname === '/profile') {
    const { data: myProfileFeed, isLoading: myProfileFeedLoading } =
      useInfiniteMyRecognitionFeed();

    const feedIds = (
      (myProfileFeed?.pages.flatMap((page) =>
        page.data?.result?.data?.map((post: { id: string }) => post),
      ) as { id: string }[]) || []
    )
      ?.filter(({ id }) => !!feed[id])
      .sort(
        (a, b) =>
          new Date(feed[b.id].createdAt).getTime() -
          new Date(feed[a.id].createdAt).getTime(),
      );

    return (
      <div>
        <div className="pt-2">
          {myProfileFeedLoading ? (
            <SkeletonLoader />
          ) : feedIds.length === 0 ? (
            <div className="mt-[-0.5rem]">
              <NoDataCard user={data?.fullName} dataType={'activity'} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {feedIds.map((post: { id: string }) => (
                <Post postId={post.id} key={post.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    const { data: peopleProfileFeed, isLoading: isPeopleProfileFeedLoading } =
      useInfinitePeopleProfileRecognitionFeed(userId, {});

    const feedIds = (
      (peopleProfileFeed?.pages.flatMap((page) =>
        page.data?.result?.data.map((post: { id: string }) => post),
      ) as { id: string }[]) || []
    )
      ?.filter(({ id }) => !!feed[id])
      .sort(
        (a, b) =>
          new Date(feed[b.id].createdAt).getTime() -
          new Date(feed[a.id].createdAt).getTime(),
      );

    return (
      <div className="pt-2">
        {isPeopleProfileFeedLoading && <SkeletonLoader />}
        <div className="pt-2">
          {isPeopleProfileFeedLoading ? (
            <SkeletonLoader />
          ) : feedIds.length === 0 ? (
            <div className="mt-[-0.5rem]">
              <NoDataCard user={data?.fullName} dataType={'activity'} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {feedIds.map((post: { id: string }) => (
                <Post postId={post.id} key={post.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Recognitions;
