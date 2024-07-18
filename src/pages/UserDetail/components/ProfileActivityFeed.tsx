import Post from 'components/Post';
import {
  useInfiniteMyProfileFeed,
  useInfinitePeopleProfileFeed,
} from 'queries/post';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import NoDataCard from './NoDataCard';
import PostBuilder from 'components/PostBuilder';
import { useFeedStore } from 'stores/feedStore';
import { FC } from 'react';
import useRole from 'hooks/useRole';
import { isRegularPost } from 'utils/misc';
import SkeletonLoader from 'components/Feed/components/SkeletonLoader';

export interface IProfileActivityFeedProps {
  data: any;
  userId: string;
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  pathname?: string;
}

const ProfileActivityFeed: FC<IProfileActivityFeedProps> = ({
  data,
  pathname,
  userId,
  open,
  openModal,
  closeModal,
}) => {
  const { feed } = useFeedStore();
  const { isAdmin } = useRole();
  const currentDate = new Date().toISOString();
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
            !isRegularPost(feed[post.id], currentDate, isAdmin),
        )
      : [];

    const regularFeedIds = feedIds
      ? feedIds.filter((post: { id: string }) =>
          isRegularPost(feed[post.id], currentDate, isAdmin),
        )
      : [];

    return (
      <div className="pt-2">
        <CreatePostCard openModal={openModal} />
        {open && (
          <PostBuilder
            open={open}
            openModal={openModal}
            closeModal={closeModal}
          />
        )}
        <div className="pt-6">
          {myProfileFeedLoading ? (
            <SkeletonLoader />
          ) : feedIds.length === 0 ? (
            <div className="mt-[-0.5rem]">
              <NoDataCard user={data?.fullName} dataType={'activity'} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {announcementFeedIds.map((post: { id: string }) => (
                <Post postId={post.id} key={post.id} />
              ))}
              {regularFeedIds.map((post: { id: string }) => (
                <Post postId={post.id} key={post.id} />
              ))}
            </div>
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
            !isRegularPost(feed[post.id], currentDate, isAdmin),
        )
      : [];

    const regularFeedIds = feedIds
      ? feedIds.filter((post: { id: string }) =>
          isRegularPost(feed[post.id], currentDate, isAdmin),
        )
      : [];

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
              {announcementFeedIds.map((post: { id: string }) => (
                <Post postId={post.id} key={post.id} />
              ))}
              {regularFeedIds.map((post: { id: string }) => (
                <Post postId={post.id} key={post.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default ProfileActivityFeed;
