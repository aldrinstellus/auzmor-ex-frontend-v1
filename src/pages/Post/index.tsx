import AnnouncementCard from 'components/AnnouncementWidget';
import { Comment } from 'components/Comments/components/Comment';
import PageLoader from 'components/PageLoader';
import Post from 'components/Post';
import { Reply } from 'components/Reply/Reply';
import UserCard from 'components/UserWidget';
import { useGetPost } from 'queries/post';
import { FC } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFeedStore } from 'stores/feedStore';

const PostPage: FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const commentId = searchParams.get('commentId') || undefined;
  if (!id) {
    return <div>Error</div>;
  }

  const { isLoading, isError } = useGetPost(id, commentId);
  const { feed } = useFeedStore();

  if (isLoading) {
    return <PageLoader />;
  } else if (isError) {
    return <div>Error...</div>;
  }
  return (
    <>
      <div className="mb-12 space-x-8 flex w-full">
        <div className="sticky top-10 z-10 min-w-[293px] max-w-[293px]">
          <UserCard />
        </div>
        <div className="w-1/2">
          <Post
            post={feed[id]}
            customNode={
              feed[id]?.comment && (
                <div className="mt-6">
                  <Comment
                    comment={feed[id].comment}
                    customNode={
                      feed[id]?.comment?.comment ? (
                        <div className="mt-4">
                          <Reply comment={feed[id]?.comment?.comment} />
                        </div>
                      ) : null
                    }
                  />
                </div>
              )
            }
          />
        </div>
        <div className="min-w-[293px] max-w-[293px]">
          <AnnouncementCard postId={feed[id].id} />
        </div>
      </div>
    </>
  );
};

export default PostPage;
