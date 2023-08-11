import Icon from 'components/Icon';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface IScheduledFeedHeaderProps {
  setAppliedFeedFilters: (appliedFeedFilters: Record<string, any>) => void;
}

const ScheduledFeedHeader: React.FC<IScheduledFeedHeaderProps> = ({
  setAppliedFeedFilters,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div
      className="bg-blue-50 shadow-md rounded-9xl h-32 px-6 py-4"
      data-testid="scheduled-tab"
    >
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Icon
              name="arrowLeft"
              fill="#171717"
              stroke="#171717"
              onClick={() => {
                if (searchParams.has('scheduled')) {
                  searchParams.delete('scheduled');
                  setSearchParams(searchParams);
                  setAppliedFeedFilters({ scheduled: false });
                }
              }}
            />
            <div className="text-2xl font-bold text-neutral-900">
              <span data-testid={`feedpage-filter-scheduled`}>
                Scheduled posts
              </span>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div
              className="inline-flex py-2 px-4 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ borderColor: '#e5e5e5' }}
              data-testid="scheduledpost-tab-all"
            >
              All posts
            </div>
            <div
              className="inline-flex py-2 px-4 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ backgroundColor: '#e5e5e5', color: '#A3A3A3' }}
              data-testid="scheduledpost-tab-announcement"
            >
              Announcements
            </div>
            <div
              className="inline-flex py-2 px-4 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ backgroundColor: '#e5e5e5', color: '#A3A3A3' }}
              data-testid="scheduledpost-tab-polls"
            >
              Polls
            </div>
            <div
              className="inline-flex py-2 px-4 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ backgroundColor: '#e5e5e5', color: '#A3A3A3' }}
              data-testid="scheduledpost-tab-shoutouts"
            >
              Shoutouts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledFeedHeader;
