import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import CloseIcon from 'components/Icon/components/Close';
import FilterIcon from 'components/Icon/components/Filter';
import React, { ReactElement, useState } from 'react';

export enum FeedFilterContentType {
  Filter = 'FILTER',
  Section = 'SECTION',
}

export type FeedFilterOption = {
  label: string;
  value: string;
  checked: boolean;
  type: FeedFilterContentType;
};

export type FeedFilterProps = {
  name: string;
  options?: FeedFilterOption[];
  onChange?: any;
  className?: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  dataTestId?: string;
};

const feedFilterOptions: FeedFilterOption[] = [
  {
    label: 'Content (type)',
    value: 'content-type',
    checked: false,
    type: FeedFilterContentType.Section,
  },
  {
    label: 'Updates',
    value: 'UPDATE',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Events',
    value: 'EVENT',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Documents',
    value: 'DOCUMENT',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Shoutouts',
    value: 'SHOUT_OUT',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Birthdays',
    value: 'BIRTHDAY',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Work anniversary',
    value: 'WORK_ANNIVERSARY',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Welcome new hire',
    value: 'WELCOME_NEW_HIRE',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Polls',
    value: 'POLL',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Preference',
    value: 'preference',
    checked: false,
    type: FeedFilterContentType.Section,
  },
  {
    label: 'My posts',
    value: 'my-posts',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Mentions',
    value: 'mentions',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
  {
    label: 'Bookmarked by me',
    value: 'bookmarked-by-me',
    checked: false,
    type: FeedFilterContentType.Filter,
  },
];

const FeedFilter: React.FC<FeedFilterProps> = ({
  name,
  options,
  error = '',
  loading = false,
  disabled = false,
  dataTestId = '',
}): ReactElement => {
  const [showFeedFilter, setShowFeedFilter] = useState<boolean>(false);
  const [feedFilters, setFeedFilters] = useState<string[]>([]);
  const [haveFiltersBeenModified, setHaveFiltersBeenModified] =
    useState<boolean>(false);
  return (
    <div className="relative">
      <button
        className="box-border font-bold flex flex-row justify-center items-center p-1 gap-4 border-none"
        onClick={() => {
          setShowFeedFilter(!showFeedFilter);
          setHaveFiltersBeenModified(false);
        }}
        data-testid={dataTestId}
      >
        <FilterIcon />
      </button>

      {showFeedFilter && (
        <Card className="bg-white rounded-3xl top-full min-w-full w-max shadow-md z-10 mt-1 absolute">
          <div
            className="flex flex-row justify-center items-center py-2 px-4 gap-40"
            onClick={() => {
              setShowFeedFilter(false);
              setHaveFiltersBeenModified(true);
            }}
          >
            <p className="text-base font-bold">Filter by</p>
            <CloseIcon size={16} className="cursor-pointer" />
          </div>
          <div>
            <ul className="text-left border rounded-md space-y-1">
              {feedFilterOptions.map((option) => (
                <div
                  key={option?.value}
                  onClick={() => {
                    setHaveFiltersBeenModified(true);
                    if (feedFilters.includes(option.value)) {
                      setFeedFilters(
                        feedFilters.filter((filter) => filter !== option.value),
                      );
                    } else {
                      setFeedFilters([...feedFilters, option?.value]);
                    }
                  }}
                >
                  <li
                    className={
                      option?.type === FeedFilterContentType.Section
                        ? 'bg-blue-50 text-gray-600 font-medium text-sm px-4 py-2 rounded-md min-w-full'
                        : 'bg-white font-medium text-sm px-4 py-2 rounded-md min-w-full overflow hover:bg-green-50 flex items-center'
                    }
                    value={option?.value}
                  >
                    <input
                      type="checkbox"
                      className={
                        option?.type === FeedFilterContentType.Section
                          ? 'hidden'
                          : 'block px-2 mr-2 accent-emerald-600 '
                      }
                      checked={
                        feedFilters.find((filter) => filter === option?.value)
                          ? true
                          : false
                      }
                    ></input>
                    {option?.label}
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-around mt-3 mb-2">
            <button
              className={`box-border border-none px-4 ${
                feedFilters.length > 0 ? 'text-gray-900 ' : 'text-gray-400'
              }`}
              onClick={() => {
                setHaveFiltersBeenModified(true);
                setFeedFilters([]);
              }}
              disabled={feedFilters.length === 0}
            >
              Clear filters
            </button>
            <Button
              label="Apply"
              variant={Variant.Primary}
              disabled={!haveFiltersBeenModified}
              onClick={() => setShowFeedFilter(false)}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default FeedFilter;
