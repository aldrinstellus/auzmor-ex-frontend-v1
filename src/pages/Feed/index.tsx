import React, { useState } from 'react';

import ArtDeco from 'components/ArtDeco';
import { feeds } from 'mocks/feed';
import ActivityFeed from 'components/ActivityFeed';

interface IFeedProps {}

interface IContent {
  text: string;
  html: string;
  editor: string;
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
      <ArtDeco activityFeed={activityFeed} setActivityFeed={setActivityFeed} />
      <ActivityFeed activityFeed={activityFeed} />
    </div>
  );
};

export default Feed;
