import React from 'react';
import Post from 'components/Post';
import { IGetPost, useProfileFeed } from 'queries/post';

export interface IProfileActivityFeedProps {}

const ProfileActivityFeed: React.FC<IProfileActivityFeedProps> = () => {
  const { data, isLoading } = useProfileFeed();

  const feed = data?.pages.flatMap((page) => {
    return page.data?.result?.data.map((post: any) => {
      try {
        return post;
      } catch (e) {
        console.log('Error', { post });
      }
    });
  }) as IGetPost[];

  return (
    <div>
      {isLoading ? (
        <div className="mt-4">loading...</div>
      ) : (
        <div className="mt-4">
          {feed.map((post) => (
            <Post data={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileActivityFeed;
