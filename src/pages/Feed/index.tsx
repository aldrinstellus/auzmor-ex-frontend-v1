import React, { useState } from 'react';
import { DeltaStatic } from 'quill';
import { feeds } from 'mocks/feed';
import ActivityFeed from 'components/ActivityFeed';
import CreatePostCard from './components/CreatePostCard';

interface IFeedProps {}

interface IContent {
  text: string;
  html: string;
  editor: DeltaStatic;
}
export interface IFeed {
  content: IContent;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  isAnnouncement: boolean;
}

const Feed: React.FC<IFeedProps> = () => {
  const [activityFeed, setActivityFeed] = useState<IFeed[]>(feeds);
  return (
    <div className="flex flex-col">
      <CreatePostCard
        activityFeed={activityFeed}
        setActivityFeed={setActivityFeed}
      />
      <ActivityFeed activityFeed={activityFeed} />
    </div>
  );
};

export default Feed;
