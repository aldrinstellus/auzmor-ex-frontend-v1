import Divider from 'components/Divider';
import Post from 'components/Post';
import { IFeed } from 'pages/Feed';
import React from 'react';
import SortByDropdown from './components/SortByDropdown';
import ClockIcon from 'components/Icon/components/Clock';
import FeedFilter from './components/FeedFilters';

type ActivityFeedProps = {
  activityFeed: IFeed[];
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activityFeed }) => {
  return (
    <div style={{ marginTop: 41.5 }}>
      <div className="flex flex-row items-center gap-x-2">
        <FeedFilter name="Filters" />
        <ClockIcon />
        <Divider />
        <SortByDropdown />
      </div>
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
