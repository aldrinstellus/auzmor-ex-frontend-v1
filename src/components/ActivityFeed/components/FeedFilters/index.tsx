import { Popover, Transition } from '@headlessui/react';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import CloseIcon from 'components/Icon/components/Close';
import { IPostFilters, PostFilterKeys, PostType } from 'queries/post';
import React, { ReactElement, useEffect, useState } from 'react';

export enum FeedFilterContentType {
  Filter = 'FILTER',
  Section = 'SECTION',
}

export type FeedFilterOption = {
  label: string;
  value: string | PostType;
  type: FeedFilterContentType;
  filterKey?: PostFilterKeys;
  isDisabled?: boolean;
  dataTestId?: string;
};

export type FeedFilterProps = {
  className?: string;
  disabled?: boolean;
  dataTestId?: string;
  appliedFeedFilters?: IPostFilters;
  onApplyFilters?: (filters: IPostFilters) => void;
};

const feedFilterOptions: FeedFilterOption[] = [
  {
    label: 'Content (type)',
    value: 'content-type',
    type: FeedFilterContentType.Section,
  },
  {
    label: 'Updates',
    value: PostType.Update,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-updates',
  },
  {
    label: 'Events',
    value: PostType.Event,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-events',
  },
  {
    label: 'Documents',
    value: PostType.Document,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-documents',
  },
  {
    label: 'Shoutouts',
    value: PostType.ShoutOut,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-shoutouts',
  },
  {
    label: 'Birthdays',
    value: PostType.Birthday,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-birthdays',
  },
  {
    label: 'Work anniversary',
    value: PostType.WorkAniversary,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-workanniversary',
  },
  {
    label: 'Welcome new hire',
    value: PostType.WelcomNewHire,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-welcomenewhire',
  },
  {
    label: 'Polls',
    value: PostType.Poll,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-polls',
  },
  {
    label: 'Preference',
    value: 'preference',
    type: FeedFilterContentType.Section,
  },
  {
    label: 'My posts',
    value: 'my-posts',
    filterKey: PostFilterKeys.MyPosts,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-myposts',
  },
  {
    label: 'Mentions',
    value: 'mentions',
    filterKey: PostFilterKeys.MentionedInPost,
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-mentions',
  },
  {
    label: 'Bookmarked by me',
    value: 'bookmarked-by-me',
    type: FeedFilterContentType.Filter,
    isDisabled: true,
    dataTestId: 'filterby-bookmarkedbyme',
  },
];

const FeedFilter: React.FC<FeedFilterProps> = ({
  disabled = false,
  dataTestId = '',
  appliedFeedFilters = {},
  onApplyFilters,
}): ReactElement => {
  const [showFeedFilter, setShowFeedFilter] = useState<boolean>(false);
  const [feedFilters, setFeedFilters] =
    useState<IPostFilters>(appliedFeedFilters);
  const [haveFiltersBeenModified, setHaveFiltersBeenModified] =
    useState<boolean>(false);

  useEffect(() => {
    if (!showFeedFilter) {
      setFeedFilters(appliedFeedFilters);
    }
  }, [showFeedFilter]);

  useEffect(() => {
    setFeedFilters(appliedFeedFilters);
  }, [appliedFeedFilters]);

  const isOptionSelected = (option: FeedFilterOption) => {
    if (option.filterKey) {
      switch (option.filterKey) {
        case PostFilterKeys.PostType:
          return feedFilters[PostFilterKeys.PostType]?.includes(
            option.value as PostType,
          );
        case PostFilterKeys.MyPosts:
          feedFilters[PostFilterKeys.MyPosts];
        case PostFilterKeys.MentionedInPost:
          feedFilters[PostFilterKeys.MentionedInPost];
        default:
          return false;
      }
    } else return false;
  };

  const clearFeedFilters = () => {
    setFeedFilters({
      ...feedFilters,
      [PostFilterKeys.PostType]: [],
      [PostFilterKeys.MyPosts]: false,
      [PostFilterKeys.MentionedInPost]: false,
    });
    setHaveFiltersBeenModified(true);
  };

  const isFeelFiltersEmpty = () => {
    if (
      feedFilters[PostFilterKeys.PostType]?.length ||
      feedFilters[PostFilterKeys.MyPosts] ||
      feedFilters[PostFilterKeys.MentionedInPost]
    ) {
      return false;
    }
    return true;
  };

  const updateFeedFilters = (option: FeedFilterOption) => {
    if (option.filterKey === PostFilterKeys.PostType) {
      if (
        feedFilters[PostFilterKeys.PostType]?.includes(option.value as PostType)
      ) {
        setFeedFilters({
          ...feedFilters,
          [PostFilterKeys.PostType]: feedFilters[
            PostFilterKeys.PostType
          ].filter((each) => each !== option.value),
        });
      } else {
        setFeedFilters({
          ...feedFilters,
          [PostFilterKeys.PostType]: [
            ...(feedFilters[PostFilterKeys.PostType] as PostType[]),
            option.value as PostType,
          ],
        });
      }
    } else if (option.filterKey === PostFilterKeys.MentionedInPost) {
      setFeedFilters({
        ...feedFilters,
        [PostFilterKeys.MentionedInPost]:
          !feedFilters[PostFilterKeys.MentionedInPost],
      });
    } else if (option.filterKey === PostFilterKeys.MyPosts) {
      setFeedFilters({
        ...feedFilters,
        [PostFilterKeys.MyPosts]: !feedFilters[PostFilterKeys.MyPosts],
      });
    }
    setHaveFiltersBeenModified(true);
  };

  const getFeedFilterCount = () => {
    return feedFilters[PostFilterKeys.PostType]?.length || 0;
  };

  return (
    <Popover className="z-50 mr-6">
      <Popover.Button
        className="box-border font-bold flex flex-row justify-center items-center p-1 gap-4 border-none relative"
        onClick={() => {
          setShowFeedFilter(!showFeedFilter);
          setHaveFiltersBeenModified(false);
        }}
        data-testid={dataTestId}
      >
        {getFeedFilterCount() > 0 && (
          <div className="absolute rounded-full bg-red-600 text-white text-xxs -top-1 -right-1.5 flex w-4 h-4 items-center justify-center">
            {getFeedFilterCount()}
          </div>
        )}
        <Icon name="filter" size={16} className="" />
      </Popover.Button>
      <Transition
        show={showFeedFilter}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel static>
          <Card className="bg-white rounded-3xl top-full min-w-full w-max shadow-md z-10 mt-1 absolute">
            <div
              className="flex flex-row justify-center items-center py-2 px-4 gap-40"
              onClick={() => {
                setShowFeedFilter(false);
                setHaveFiltersBeenModified(true);
              }}
            >
              <p className="text-base font-bold">Filter by</p>
              <CloseIcon
                size={16}
                className="cursor-pointer"
                dataTestId="filter-closeicon"
              />
            </div>
            <div>
              <ul className="text-left border rounded-md space-y-1">
                {feedFilterOptions.map((option) => (
                  <div
                    key={option?.value}
                    onClick={() =>
                      !option.isDisabled && updateFeedFilters(option)
                    }
                    className={`${
                      option.isDisabled
                        ? 'cursor-default text-neutral-400'
                        : 'cursor-pointer'
                    }`}
                  >
                    <li
                      className={
                        option?.type === FeedFilterContentType.Section
                          ? 'bg-blue-50 text-gray-600 font-medium text-sm px-4 py-2 rounded-md min-w-full'
                          : `bg-white font-medium text-sm px-4 py-2 rounded-md min-w-full overflow ${
                              isOptionSelected(option) && 'bg-green-50'
                            } hover:bg-green-50 flex items-center`
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
                        disabled={option.isDisabled}
                        checked={isOptionSelected(option)}
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
                  isFeelFiltersEmpty() ? 'text-gray-400' : 'text-gray-900'
                }`}
                onClick={clearFeedFilters}
                disabled={isFeelFiltersEmpty()}
                data-testid="filters-clearfiltercta"
              >
                Clear filters
              </button>
              <Button
                label="Apply"
                variant={Variant.Primary}
                disabled={!haveFiltersBeenModified}
                onClick={() => {
                  onApplyFilters && onApplyFilters(feedFilters);
                  setShowFeedFilter(false);
                }}
                dataTestId="filters-applycta"
              />
            </div>
          </Card>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default FeedFilter;
