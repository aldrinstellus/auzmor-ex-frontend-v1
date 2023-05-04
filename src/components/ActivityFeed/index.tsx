import Divider from 'components/Divider';
import Post from 'components/Post';
import React from 'react';
import SortByDropdown from './components/SortByDropdown';
import ClockIcon from 'components/Icon/components/Clock';
import FeedFilter from './components/FeedFilters';
import { IPost } from 'queries/post';

import { InfiniteScroll } from 'components/InfiniteScroll';
import CreatePostCard from 'components/PostBuilder/components/CreatePostCard';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import { useMutation } from '@tanstack/react-query';
import { announcementRead } from 'queries/post';

type ActivityFeedProps = {
  activityFeed: IPost[];
  loadMore: any; // Change this type to something more appropriate for functions
  setShowModal: (flag: boolean) => void;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activityFeed,
  loadMore,
  setShowModal,
}) => {
  // const acknowledgeAnnouncement = useMutation({
  //   mutationKey: ['acknowledgeAnnouncement'],
  //   mutationFn: announcementRead,
  //   onError: (error) => console.log(error),
  //   onSuccess: (data, variables, context) => {
  //     console.log('data==>', data);
  //   },
  // });

  return (
    <div>
      {/* <div className="flex flex-row items-center gap-x-2">
        <FeedFilter name="Filters" />
        <ClockIcon />
        <Divider />
        <SortByDropdown />
      </div> */}
      <div>
        {activityFeed?.length > 0 ? (
          <InfiniteScroll
            // innerHeight > outerHeight
            outerClassName="flex justify-between h-[calc(100vh-64px)] overflow-y-scroll"
            innerClassName="flex flex-col"
            itemCount={activityFeed.length}
            itemRenderer={(index) => (
              <div key={`post-${index}`} className="mt-8">
                {activityFeed[index].isAnnouncement && (
                  <div className="flex justify-between items-center bg-blue-700 -mb-4 p-2 rounded-t-9xl">
                    <div className="flex justify-center items-center text-white text-xs font-bold space-x-4">
                      <div>
                        <Icon name="flashIcon" />
                      </div>
                      <div className="text-xs font-bold">Announcement</div>
                    </div>
                    <Button
                      className="text-sm font-bold"
                      label={'Mark as read'}
                      size={Size.Small}
                      variant={Variant.Tertiary}
                      onClick={() => {
                        // acknowledgeAnnouncement.mutate({
                        //   entityId: feed?.uuid,
                        //   entityType: feed?.type,
                        // });
                      }}
                    />
                  </div>
                )}
                <Post data={activityFeed[index]} />
              </div>
            )}
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
            <div className="flex justify-center items-center mt-20">
              Feed Not Found
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
