import AnnouncementCard from 'components/AnnouncementWidget';
import { Comment } from 'components/Comments/components/Comment';
import PageLoader from 'components/PageLoader';
import Post from 'components/Post';
import { Reply } from 'components/Reply/Reply';
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

  const { isLoading, isError } = useGetPost(id, commentId);
  const { getPost } = useFeedStore();

  if (isLoading) {
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
          <Post
            post={post}
            customNode={
              post?.comment && (
                <div className="mx-6 mb-3">
                  <Comment
                    comment={post.comment}
                    customNode={
                      post?.comment?.comment ? (
                        <div className="mt-4 ml-8">
                          <Reply comment={post?.comment?.comment} />
                        </div>
                      ) : null
                    }
                  />
                </div>
              )
            }
          />
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
