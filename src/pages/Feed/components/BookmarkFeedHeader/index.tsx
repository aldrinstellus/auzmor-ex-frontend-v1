import Icon from 'components/Icon';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface IBookmarkFeedHeaderProps {
  setAppliedFeedFilters: (appliedFeedFilters: Record<string, any>) => void;
}

const BookmarkFeedHeader: React.FC<IBookmarkFeedHeaderProps> = ({
  setAppliedFeedFilters,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div
      className="bg-blue-50 shadow-md rounded-9xl h-32 px-6 py-4"
      data-testid="mybookmarks-tab"
    >
      <div className="flex justify-between items-center">
        <div className="gap-y-1">
          <div className="flex gap-x-3 items-center">
            <Link to="/feed">
              <Icon name="arrowLeft" fill="#171717" stroke="#171717" />
            </Link>
            <div className="text-2xl font-bold text-neutral-900">
              <span data-testid={`feedpage-filter-bookmark`}>My Bookmarks</span>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div
              className="w-28 inline-flex py-2 px-4 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ borderColor: '#e5e5e5' }}
              data-testid="mybookmarks-tab-posts"
            >
              Posts
            </div>
            <div
              className="w-28 inline-flex py-2 px-4 w-106 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ backgroundColor: '#e5e5e5', color: '#A3A3A3' }}
              data-testid="mybookmarks-tab-channels"
            >
              Channels
            </div>
            <div
              className="w-28 inline-flex py-2 px-4 w-106 justify-center align-center rounded-full border-solid border-white bg-white font-bold"
              style={{ backgroundColor: '#e5e5e5', color: '#A3A3A3' }}
              data-testid="mybookmarks-tab-documents"
            >
              Documents
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkFeedHeader;
