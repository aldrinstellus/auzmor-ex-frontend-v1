import { Popover, Transition } from '@headlessui/react';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import {
  IPostFilters,
  PostFilterKeys,
  PostFilterPreference,
  PostType,
} from 'queries/post';
import { FC, ReactElement, memo, useEffect, useState } from 'react';

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
  // {
  //   label: 'Events',
  //   value: PostType.Event,
  //   filterKey: PostFilterKeys.PostType,
  //   type: FeedFilterContentType.Filter,
  //   isDisabled: true,
  //   dataTestId: 'filterby-events',
  // },
  // {
  //   label: 'Documents',
  //   value: PostType.Document,
  //   filterKey: PostFilterKeys.PostType,
  //   type: FeedFilterContentType.Filter,
  //   isDisabled: true,
  //   dataTestId: 'filterby-documents',
  // },
  {
    label: 'Shoutouts',
    value: PostType.Shoutout,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-shoutouts',
  },
  {
    label: 'Birthdays',
    value: PostType.Birthday,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-birthdays',
  },
  {
    label: 'Work anniversary',
    value: PostType.WorkAniversary,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-workanniversary',
  },
  // {
  //   label: 'Welcome new hire',
  //   value: PostType.WelcomNewHire,
  //   filterKey: PostFilterKeys.PostType,
  //   type: FeedFilterContentType.Filter,
  //   isDisabled: true,
  //   dataTestId: 'filterby-welcomenewhire',
  // },
  {
    label: 'Polls',
    value: PostType.Poll,
    filterKey: PostFilterKeys.PostType,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-polls',
  },
  {
    label: 'Preference',
    value: 'preference',
    type: FeedFilterContentType.Section,
  },
  {
    label: 'My posts',
    value: PostFilterPreference.MyPosts,
    filterKey: PostFilterKeys.PostPreference,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-myposts',
  },
  {
    label: 'Mentions',
    value: PostFilterPreference.MentionedInPost,
    filterKey: PostFilterKeys.PostPreference,
    type: FeedFilterContentType.Filter,
    dataTestId: 'filterby-mentions',
  },
  {
    label: 'Bookmarked by me',
    value: PostFilterPreference.BookmarkedByMe,
    type: FeedFilterContentType.Filter,
    filterKey: PostFilterKeys.PostPreference,
    dataTestId: 'filterby-bookmarkedbyme',
  },
];

export const filterKeyMap: Record<string | PostType, string> = {
  [PostType.Update]: 'Updates',
  [PostType.Event]: 'Events',
  [PostType.Document]: 'Documents',
  [PostType.Shoutout]: 'Shoutouts',
  [PostType.Birthday]: 'Birthdays',
  [PostType.WorkAniversary]: 'Work anniversary',
  [PostType.WelcomNewHire]: 'Welcome new hire',
  [PostType.Poll]: 'Polls',
  [PostFilterPreference.MyPosts]: 'My Posts',
  [PostFilterPreference.MentionedInPost]: 'Mentions',
  [PostFilterPreference.BookmarkedByMe]: 'Bookmark by me',
};

const FeedFilter: FC<FeedFilterProps> = ({
  // disabled = false,
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
        case PostFilterKeys.PostPreference:
          return feedFilters[PostFilterKeys.PostPreference]?.includes(
            option.value as PostFilterPreference,
          );
        default:
          return false;
      }
    } else return false;
  };

  const clearFeedFilters = () => {
    setFeedFilters({
      ...feedFilters,
      [PostFilterKeys.PostType]: [],
      [PostFilterKeys.PostPreference]: [],
    });
    setHaveFiltersBeenModified(true);
  };

  const isFeelFiltersEmpty = () => {
    if (
      feedFilters[PostFilterKeys.PostType]?.length ||
      feedFilters[PostFilterKeys.PostPreference]?.length
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
            ...((feedFilters[PostFilterKeys.PostType] as PostType[]) || []),
            option.value as PostType,
          ],
        });
      }
    } else if (option.filterKey === PostFilterKeys.PostPreference) {
      if (
        feedFilters[PostFilterKeys.PostPreference]?.includes(
          option.value as PostFilterPreference,
        )
      ) {
        setFeedFilters({
          ...feedFilters,
          [PostFilterKeys.PostPreference]: feedFilters[
            PostFilterKeys.PostPreference
          ].filter((each) => each !== option.value),
        });
      } else {
        setFeedFilters({
          ...feedFilters,
          [PostFilterKeys.PostPreference]: [
            ...((feedFilters[
              PostFilterKeys.PostPreference
            ] as PostFilterPreference[]) || []),
            option.value as PostFilterPreference,
          ],
        });
      }
    }
    setHaveFiltersBeenModified(true);
  };

  const getFeedFilterCount = () => {
    return feedFilters[PostFilterKeys.PostType]?.length || 0;
  };

  return (
    <Popover className="z-40">
      <Tooltip tooltipContent="Filters" tooltipPosition="top">
        <Popover.Button
          className="box-border font-bold flex flex-row justify-center items-center border-none relative"
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
          <Icon name="filter" size={24} className="" />
        </Popover.Button>
      </Tooltip>
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
          <Card className="bg-white rounded-3xl top-full min-w-[250px] shadow-md z-10 mt-1 absolute right-0">
            <div
              className="flex justify-between items-center py-3 px-6"
              onClick={() => {
                setShowFeedFilter(false);
                setHaveFiltersBeenModified(true);
              }}
            >
              <p className="text-base font-bold">Filter by</p>
              <Icon
                name="close"
                size={16}
                className="cursor-pointer"
                dataTestId="filter-closeicon"
              />
            </div>
            <div>
              <ul className="text-left">
                {feedFilterOptions.map((option) => (
                  <div
                    key={option?.value}
                    onClick={() =>
                      !option.isDisabled && updateFeedFilters(option)
                    }
                    data-testid={option.dataTestId}
                  >
                    <li
                      className={
                        option?.type === FeedFilterContentType.Section
                          ? 'bg-blue-50 font-medium text-xs pl-6 py-1 min-w-full text-neutral-500 cursor-default'
                          : `bg-white font-medium text-xs px-6 py-2 min-w-full text-neutral-900 overflow ${
                              isOptionSelected(option) && 'bg-green-50'
                            } hover:bg-green-50 flex items-center gap-[10px] border-b cursor-pointer`
                      }
                      value={option?.value}
                    >
                      <input
                        type="checkbox"
                        className={
                          option?.type === FeedFilterContentType.Section
                            ? 'hidden'
                            : 'block accent-emerald-600 '
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
            <div className="flex items-center justify-between py-2 px-6">
              <button
                className={`text-sm font-bold ${
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
                size={Size.Small}
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

export default memo(FeedFilter);
