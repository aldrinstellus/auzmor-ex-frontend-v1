import Icon from 'components/Icon';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { twConfig } from 'utils/misc';

interface IScheduledFeedHeaderProps {
  setAppliedFeedFilters: (appliedFeedFilters: Record<string, any>) => void;
}

const ScheduledFeedHeader: React.FC<IScheduledFeedHeaderProps> = ({
  setAppliedFeedFilters,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const btnStyle =
    'min-w-[106px] inline-flex py-2 px-4 justify-center align-center rounded-full text-sm font-bold';

  return (
    <div
      className="bg-blue-50 shadow-md rounded-9xl h-32 px-6 py-4"
      data-testid="scheduled-tab"
    >
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Link to="/feed">
              <Icon
                name="arrowLeft"
                color={twConfig.theme.colors.neutral[900]}
              />
            </Link>
            <div className="text-2xl font-bold text-neutral-900">
              <span data-testid={`feedpage-filter-scheduled`}>
                Scheduled posts
              </span>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div
              className={`${btnStyle} border-1 border-neutral-200 bg-white`}
              data-testid="scheduledpost-tab-all"
            >
              All posts
            </div>
            <div
              className={`${btnStyle} bg-neutral-200 text-neutral-400`}
              data-testid="scheduledpost-tab-announcement"
            >
              Announcements
            </div>
            <div
              className={`${btnStyle} bg-neutral-200 text-neutral-400`}
              data-testid="scheduledpost-tab-polls"
            >
              Polls
            </div>
            <div
              className={`${btnStyle} bg-neutral-200 text-neutral-400`}
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
