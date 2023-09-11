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
import { useFeedStore } from 'stores/feedStore';

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
  const { feed } = useFeedStore();
  if (pathname === '/profile') {
    const { data: myProfileFeed, isLoading: myProfileFeedLoading } =
      useInfiniteMyProfileFeed();

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

    const announcementFeedIds = feedIds
      ? feedIds.filter(
          (post: { id: string }) =>
            !!feed[post.id]?.announcement?.end && !feed[post.id]?.acknowledged,
        )
      : [];

    const regularFeedIds = feedIds
      ? feedIds.filter(
          (post: { id: string }) =>
            !!!feed[post.id]?.announcement?.end || feed[post.id]?.acknowledged,
        )
      : [];

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
        <div className="mt-4">
          {myProfileFeedLoading ? (
            <SkeletonLoader />
          ) : feedIds.length === 0 ? (
            <NoDataCard user={data?.fullName} />
          ) : (
            <>
              {announcementFeedIds.map((post: { id: string }) => (
                <Post post={feed[post.id]} key={post.id} />
              ))}
              {regularFeedIds.map((post: { id: string }) => (
                <Post post={feed[post.id]} key={post.id} />
              ))}
            </>
          )}
        </div>
      </div>
    );
  } else {
    const { data: peopleProfileFeed, isLoading: isPeopleProfileFeedLoading } =
      useInfinitePeopleProfileFeed(userId, {});

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

    const announcementFeedIds = feedIds
      ? feedIds.filter(
          (post: { id: string }) =>
            !!feed[post.id]?.announcement?.end && !feed[post.id]?.acknowledged,
        )
      : [];

    const regularFeedIds = feedIds
      ? feedIds.filter(
          (post: { id: string }) =>
            !!!feed[post.id]?.announcement?.end || feed[post.id]?.acknowledged,
        )
      : [];

    return (
      <div>
        {isPeopleProfileFeedLoading && <SkeletonLoader />}
        <div className="mt-4">
          {isPeopleProfileFeedLoading ? (
            <SkeletonLoader />
          ) : feedIds.length === 0 ? (
            <NoDataCard user={data?.fullName} />
          ) : (
            <>
              {announcementFeedIds.map((post: { id: string }) => (
                <Post post={feed[post.id]} key={post.id} />
              ))}
              {regularFeedIds.map((post: { id: string }) => (
                <Post post={feed[post.id]} key={post.id} />
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default ProfileActivityFeed;
