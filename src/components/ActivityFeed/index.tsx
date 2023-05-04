import Divider from 'components/Divider';
import Post from 'components/Post';
import { IFeed } from 'pages/Feed';
import React from 'react';
import SortByDropdown from './components/SortByDropdown';
import FeedFilter from './components/FeedFilters';
import { InfiniteScroll } from 'components/InfiniteScroll';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Icon from 'components/Icon';

type ActivityFeedProps = {
  activityFeed: IFeed[];
  loadMore: any; // Change this type to something more appropriate for functions
  setShowModal: (flag: boolean) => void;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activityFeed,
  loadMore,
  setShowModal,
}) => {
  return (
    <>
      {activityFeed?.length > 0 ? (
        <InfiniteScroll
          // innerHeight > outerHeight
          outerClassName="flex justify-between pt-16 px-32 h-[calc(100vh-64px)] overflow-y-scroll"
          innerClassName="w-1/2 flex flex-col"
          itemCount={activityFeed.length}
          itemRenderer={(index) => (
            <div key={`post-${index}`}>
              <Post data={activityFeed[index]} />
            </div>
          )}
          loadMore={loadMore}
          prependElement={
            <>
              <CreatePostCard setShowModal={setShowModal} />
              <div className="flex flex-row items-center gap-x-2">
                <FeedFilter name="Filters" />
                <Icon name="clock" size={16} />
                <Divider />
                <SortByDropdown />
              </div>
            </>
          }
        />
      ) : (
        <div className="flex justify-center items-center mt-20">
          Feed Not Found
        </div>
      )}
    </>
  );
};

export default ActivityFeed;
