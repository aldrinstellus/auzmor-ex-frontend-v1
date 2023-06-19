import React, { ReactElement } from 'react';
import AnnouncementSkeleton from 'images/announcement-skeleton.png';
import PostSkeleton from 'images/post-skeleton.png';

const FeedSkeleton: React.FC = (): ReactElement => {
  return (
    <div className="animate-pulse w-[100%] flex flex-col gap-y-4 mt-4">
      <img src={AnnouncementSkeleton} />
      <img src={PostSkeleton} />
    </div>
  );
};

export default FeedSkeleton;
