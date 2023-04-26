import Post from 'components/Post';
import { IFeed } from 'pages/Feed';
import React from 'react';

type ActivityFeedProps = {
  activityFeed: IFeed[];
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activityFeed }) => {
  return (
    <div>
      {activityFeed.length > 0 ? (
        activityFeed?.map((feed) => (
          <div key={feed.uuid}>
            <Post data={feed?.content?.editor} />
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center mt-20">
          Feed Not Found
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
