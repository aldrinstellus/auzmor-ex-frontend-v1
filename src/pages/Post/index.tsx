import AnnouncementCard from 'components/AnnouncementWidget';
import PageLoader from 'components/PageLoader';
import Post from 'components/Post';
import UserCard from 'components/UserWidget';
import useMediaQuery from 'hooks/useMediaQuery';
import PageNotFound from 'pages/PageNotFound';
import { useGetPost } from 'queries/post';
import { FC } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFeedStore } from 'stores/feedStore';

const PostPage: FC = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1300px)');
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const commentId = searchParams.get('commentId') || undefined;
  if (!id) {
    return <div>Error</div>;
  }

  const { isLoading, isError, isFetching } = useGetPost(id, commentId);
  const { getPost } = useFeedStore();

  if (isLoading || isFetching) {
    return <PageLoader />;
  } else if (isError) {
    return <PageNotFound statusCode={404} message={'Post not Found'} />;
  }

  const post = getPost(id);

  const getRightWidgets = () => <AnnouncementCard postId={post.id} />;
  return post ? (
    <>
      <div className="mb-12 space-x-8 flex w-full">
        <div className="z-10 w-[293px] flex flex-col gap-6">
          <UserCard />
          {!isLargeScreen && getRightWidgets()}
        </div>
        <div className="flex-grow flex flex-col">
          <Post postId={id} commentIds={[(post as any).comment.id] || []} />
        </div>
        {isLargeScreen && (
          <div className="z-10 w-[293px] flex flex-col gap-6">
            {getRightWidgets()}
          </div>
        )}
      </div>
    </>
  ) : (
    <PageNotFound statusCode={404} message={'Post not Found'} />
  );
};

export default PostPage;
