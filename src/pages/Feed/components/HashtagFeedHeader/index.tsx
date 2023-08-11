import Icon from 'components/Icon';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import HashtagIcon from 'images/hashtag.svg';

interface IHashtagFeedHeaderProps {
  hashtag: string;
  feedIds: {
    id: string;
  }[];
  setAppliedFeedFilters: (appliedFeedFilters: Record<string, any>) => void;
}

const HashtagFeedHeader: React.FC<IHashtagFeedHeaderProps> = ({
  hashtag,
  feedIds,
  setAppliedFeedFilters,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="bg-orange-50 shadow-md rounded-9xl h-24 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Icon
              name="arrowLeft"
              fill="#171717"
              stroke="#171717"
              onClick={() => {
                if (searchParams.has('hashtag')) {
                  searchParams.delete('hashtag');
                  setSearchParams(searchParams);
                  setAppliedFeedFilters({ hashtags: [''] });
                }
              }}
            />
            <div className="text-2xl font-bold text-neutral-900">
              <span>#</span>
              <span data-testid={`feedpage-filter-${hashtag}`}>{hashtag}</span>
            </div>
          </div>
          <div className="text-base font-normal text-neutral-500">
            <span data-testid="feedpage-filter-hashtagcount-text">
              {hashtag && feedIds?.length}
            </span>{' '}
            people are posting about this
          </div>
        </div>
        <div>
          <img src={HashtagIcon} />
        </div>
      </div>
    </div>
  );
};

export default HashtagFeedHeader;
