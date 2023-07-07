import Divider from 'components/Divider';
import Post from 'components/Post';
import React, { useState } from 'react';
import SortByDropdown from './components/SortByDropdown';
import FeedFilter from './components/FeedFilters';
import { IPostFilters } from 'queries/post';

import { InfiniteScroll } from 'components/InfiniteScroll';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Icon from 'components/Icon';

type ActivityFeedProps = {
  activityFeed: any;
  loadMore: any; // Change this type to something more appropriate for functions
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activityFeed,
  loadMore,
  open,
  openModal,
  closeModal,
  isLoading = false,
  isFetchingNextPage = false,
}) => {
  const [appliedFeedFilters, setAppliedFeedFilters] = useState<IPostFilters>(
    {},
  );
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
              <Post post={activityFeed[index]} />
            </div>
          )}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          loadMore={loadMore}
          prependElement={
            <>
              <CreatePostCard
                open={open}
                openModal={openModal}
                closeModal={closeModal}
              />
              <div className="flex flex-row items-center gap-x-2 mt-8">
                <FeedFilter
                  appliedFeedFilters={appliedFeedFilters}
                  onApplyFilters={(filters: IPostFilters) => {
                    setAppliedFeedFilters(filters);
                  }}
                />
                <Icon name="clock" size={16} />
                <Divider />
                <SortByDropdown />
              </div>
            </>
          }
        />
      ) : (
        <>
          <CreatePostCard
            open={open}
            openModal={openModal}
            closeModal={closeModal}
          />
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
