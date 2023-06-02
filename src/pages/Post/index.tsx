import AnnouncementCard from 'components/AnnouncementWidget';
import { activeCommentsDataType } from 'components/Comments';
import { Comment } from 'components/Comments/components/Comment';
import PageLoader from 'components/PageLoader';
import Post from 'components/Post';
import { Reply } from 'components/Reply/Reply';
import UserCard from 'components/UserWidget';
import { IGetPost, useGetPost } from 'queries/post';
import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const commentId = searchParams.get('commentId') || undefined;
  if (!id) {
    return <div>Error</div>;
  }

  const { data, isLoading, isError } = useGetPost(id, commentId);

  const [activeComment, setActiveComment] =
    useState<activeCommentsDataType | null>(null);
  const [replyInputBox, setReplyInputBox] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  } else if (isError) {
    return <div>Error...</div>;
  }
  const post = data.data?.result?.data as IGetPost;
  return (
    <>
      <div className="mb-12 space-x-8 flex w-full">
        <div className="sticky top-10 z-10 w-1/4">
          <UserCard />
        </div>
        <div className="w-1/2">
          <div className="mt-4">
            <Post
              data={post}
              customNode={
                post?.comment && (
                  <Comment
                    comment={post.comment}
                    setActiveComment={setActiveComment}
                    activeComment={activeComment}
                    setReplyInputBox={setReplyInputBox}
                    replyInputBox={replyInputBox}
                    customNode={
                      post?.comment?.comment ? (
                        <Reply
                          handleClick={() => {}}
                          comment={post?.comment?.comment}
                        />
                      ) : null
                    }
                  />
                )
              }
            />
          </div>
        </div>
        <div className="w-1/4">
          <AnnouncementCard />
        </div>
      </div>
    </>
  );
};

export default PostPage;
