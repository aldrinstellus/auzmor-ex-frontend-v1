import Divider from 'components/Divider';
import Post from 'components/Post';
import { IFeed } from 'pages/Feed';
import React from 'react';
import SortByDropdown from './components/SortByDropdown';
import ClockIcon from 'components/Icon/components/Clock';
import FeedFilter from './components/FeedFilters';
import { InfiniteScroll } from 'components/InfiniteScroll';

type ActivityFeedProps = {
  activityFeed: IFeed[];
  loadMore: any; // Change this type to something more appropriate for functions
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activityFeed,
  loadMore,
}) => {
  return (
    <div style={{ marginTop: 41.5 }}>
      <div className="flex flex-row items-center gap-x-2">
        <FeedFilter name="Filters" />
        <ClockIcon />
        <Divider />
        <SortByDropdown />
      </div>

      {activityFeed?.length > 0 ? (
        <InfiniteScroll
          // innerHeight > outerHeight
          // outerClassName="h-32 overflow-y-scroll"
          // innerClassName="h-full"
          itemCount={activityFeed.length}
          itemRenderer={(index) => (
            <Post data={activityFeed[index]?.content?.editor} />
          )}
          loadMore={loadMore}
        />
      ) : (
        <div className="flex justify-center items-center mt-20">
          Feed Not Found
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
