import Divider from 'components/Divider';
import Post from 'components/Post';
import React from 'react';
import SortByDropdown from './components/SortByDropdown';
import ClockIcon from 'components/Icon/components/Clock';
import FeedFilter from './components/FeedFilters';
import { IGetPost } from 'queries/post';

import { InfiniteScroll } from 'components/InfiniteScroll';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Icon from 'components/Icon';

type ActivityFeedProps = {
  activityFeed: any;
  // activityFeed: IGetPost[];
  loadMore: any; // Change this type to something more appropriate for functions
  setShowModal: (flag: boolean) => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activityFeed,
  loadMore,
  setShowModal,
  isLoading = false,
  isFetchingNextPage = false,
}) => {
  return (
    <>
      {activityFeed?.length > 0 ? (
        <InfiniteScroll
          // innerHeight > outerHeight
          outerClassName="flex justify-between h-[calc(100vh-64px)] overflow-y-scroll"
          innerClassName="flex flex-col"
          itemCount={activityFeed.length}
          itemRenderer={(index) => (
            <div key={`post-${index}`}>
              <Post data={activityFeed[index]} />
            </div>
          )}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          loadMore={loadMore}
          prependElement={
            <>
              <CreatePostCard setShowModal={setShowModal} />
              <div className="flex flex-row items-center gap-x-2 mt-8">
                <FeedFilter name="Filters" />
                <Icon name="clock" size={16} />
                <Divider />
                <SortByDropdown />
              </div>
            </>
          }
        />
      ) : (
        <>
          <CreatePostCard setShowModal={setShowModal} />
          {!isLoading && (
            <div className="flex justify-center items-center mt-20">
              Feed Not Found
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ActivityFeed;
