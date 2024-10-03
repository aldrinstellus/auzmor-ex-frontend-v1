import { Popover, Transition } from '@headlessui/react';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import useProduct from 'hooks/useProduct';
import {
  IPostFilters,
  PostFilterKeys,
  PostFilterPreference,
  PostType,
} from 'queries/post';
import {
  FC,
  ReactElement,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { xor } from 'lodash';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import useRole from 'hooks/useRole';

export enum FeedFilterContentType {
  Filter = 'FILTER',
  Section = 'SECTION',
}

export type FeedFilterOption = {
  label: string;
  value: string | PostType | PostFilterPreference;
  type: FeedFilterContentType;
  filterKey?: PostFilterKeys;
  isDisabled?: boolean;
  dataTestId: string;
  hidden?: boolean;
};

export type FeedFilterProps = {
  className?: string;
  disabled?: boolean;
  dataTestId?: string;
  appliedFeedFilters?: IPostFilters;
  onApplyFilters?: (filters: IPostFilters) => void;
};

export const filterKeyMap: Record<string | PostType, string> = {
  [PostType.Update]: 'Updates',
  [PostType.Training]: 'Training',
  [PostType.Event]: 'Event',
  [PostType.Forum]: 'Forum',
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
  const { t } = useTranslation('components', { keyPrefix: 'FeedFilter' });

  const [showFeedFilter, setShowFeedFilter] = useState<boolean>(false);
  const [feedFilters, setFeedFilters] =
    useState<IPostFilters>(appliedFeedFilters);
  const [haveFiltersBeenModified, setHaveFiltersBeenModified] =
    useState<boolean>(false);
  const { isLxp } = useProduct();
  const { isLearner } = useRole();

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
    const updatedFeedFilters = { ...feedFilters };
    if (option.filterKey === PostFilterKeys.PostType) {
      updatedFeedFilters[PostFilterKeys.PostType] = xor(
        updatedFeedFilters[PostFilterKeys.PostType] || [],
        [option.value],
      ) as PostType[];
    } else if (option.filterKey === PostFilterKeys.PostPreference) {
      updatedFeedFilters[PostFilterKeys.PostPreference] = xor(
        updatedFeedFilters[PostFilterKeys.PostPreference] || [],
        [option.value],
      ) as PostFilterPreference[];
    }
    setFeedFilters(updatedFeedFilters);
    setHaveFiltersBeenModified(true);
  };

  const getFeedFilterCount = () => {
    return feedFilters[PostFilterKeys.PostType]?.length || 0;
  };
  const isChannelPage = location.pathname.includes('/channels/');
  const feedFilterOptions: FeedFilterOption[] = [
    {
      label: t('contentTypeSection'),
      value: 'content-type',
      type: FeedFilterContentType.Section,
      dataTestId: 'filterby-content-type-section',
      hidden: false,
    },
    {
      label: t('update'),
      value: PostType.Update,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-updates',
      hidden: false,
    },
    {
      label: t('training'),
      value: PostType.Training,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-training',
      hidden: !(isLxp && !isChannelPage && isLearner), // if lxp and feed and learner view then show else dont
    },
    {
      label: t('event'),
      value: PostType.Event,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-event',
      hidden: !(isLxp && !isChannelPage && isLearner),
    },
    {
      label: t('forum'),
      value: PostType.Forum,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-forum',
      hidden: !(isLxp && !isChannelPage && isLearner),
    },
    {
      label: t('document'),
      value: PostType.Document,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      isDisabled: true,
      dataTestId: 'filterby-documents',
      hidden: true,
    },
    {
      label: t('shoutout'),
      value: PostType.Shoutout,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-shoutouts',
      hidden: false,
    },
    {
      label: t('birthday'),
      value: PostType.Birthday,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-birthdays',
      hidden: isLxp,
    },
    {
      label: t('workAnniversary'),
      value: PostType.WorkAniversary,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-workanniversary',
      hidden: isLxp,
    },
    {
      label: t('welcomeNewHire'),
      value: PostType.WelcomNewHire,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      isDisabled: true,
      dataTestId: 'filterby-welcomenewhire',
      hidden: true,
    },
    {
      label: t('poll'),
      value: PostType.Poll,
      filterKey: PostFilterKeys.PostType,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-polls',
      hidden: false,
    },
    {
      label: t('preferenceSection'),
      value: 'preference',
      type: FeedFilterContentType.Section,
      dataTestId: 'filterby-preference-section',
      hidden: false,
    },
    {
      label: t('myPosts'),
      value: PostFilterPreference.MyPosts,
      filterKey: PostFilterKeys.PostPreference,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-myposts',
      hidden: false,
    },
    {
      label: t('mentions'),
      value: PostFilterPreference.MentionedInPost,
      filterKey: PostFilterKeys.PostPreference,
      type: FeedFilterContentType.Filter,
      dataTestId: 'filterby-mentions',
      hidden: false,
    },
    {
      label: t('bookmarkedByMe'),
      value: PostFilterPreference.BookmarkedByMe,
      type: FeedFilterContentType.Filter,
      filterKey: PostFilterKeys.PostPreference,
      dataTestId: 'filterby-bookmarkedbyme',
      hidden: false,
    },
  ];

  const getFilterRowStyle = (option: FeedFilterOption) =>
    clsx({
      'bg-blue-50 font-medium text-xs pl-6 py-1 min-w-full text-neutral-500 cursor-default':
        option?.type === FeedFilterContentType.Section,
      'bg-white font-medium text-xs px-6 py-2 min-w-full text-neutral-900 overflow hover:bg-primary-50 focus:bg-primary-50 focus-within:bg-primary-50 flex items-center gap-[10px] border-b cursor-pointer':
        option?.type !== FeedFilterContentType.Section,
      'bg-green-50':
        option?.type !== FeedFilterContentType.Section &&
        isOptionSelected(option),
    });

  const getCheckboxStyle = (option: FeedFilterOption) =>
    clsx({
      hidden: option?.type === FeedFilterContentType.Section,
      'block accent-primary-600':
        option?.type !== FeedFilterContentType.Section,
      'outline-none': true,
    });

  const clearFilterButtonStyle = useCallback(
    () =>
      clsx({
        'text-sm font-bold': true,
        'text-gray-400': isFeelFiltersEmpty(),
        'text-gray-900': !isFeelFiltersEmpty(),
      }),
    [feedFilters],
  );

  // Events
  const handleFilterButtonClick = () => {
    setShowFeedFilter(!showFeedFilter);
    setHaveFiltersBeenModified(false);
  };
  const handleFilterByClick = () => {
    setShowFeedFilter(false);
    setHaveFiltersBeenModified(true);
  };

  return (
    <Popover className="z-40">
      <Tooltip tooltipContent={t('filtersTooltip')} tooltipPosition="top">
        <Popover.Button
          className="box-border font-bold flex flex-row justify-center items-center border-none relative outline-none"
          onClick={handleFilterButtonClick}
          onKeyUp={(e) => (e.code === 'Enter' ? handleFilterButtonClick() : '')}
          data-testid={dataTestId}
          aria-label="filters"
        >
          {getFeedFilterCount() > 0 && (
            <div className="absolute rounded-full bg-red-600 text-white text-xxs -top-1 -right-1.5 flex w-4 h-4 items-center justify-center">
              {getFeedFilterCount()}
            </div>
          )}
          <Icon name="filter" size={24} />
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
              onClick={handleFilterByClick}
              onKeyUp={(e) => (e.code === 'Enter' ? handleFilterByClick() : '')}
            >
              <p className="text-base font-bold">{t('filterBy')}</p>
              <Icon
                name="close"
                size={16}
                className="cursor-pointer outline-none"
                dataTestId="filter-closeicon"
                tabIndex={0}
              />
            </div>
            <div>
              <ul className="text-left">
                {feedFilterOptions
                  .filter((option) => !option.hidden)
                  .map((option) => (
                    <li
                      className={getFilterRowStyle(option)}
                      value={option?.value}
                      data-testid={option.dataTestId}
                      onClick={() =>
                        !option.isDisabled && updateFeedFilters(option)
                      }
                      key={option.dataTestId}
                    >
                      <input
                        type="checkbox"
                        className={getCheckboxStyle(option)}
                        disabled={option.isDisabled}
                        checked={isOptionSelected(option)}
                        aria-label={option?.label}
                      ></input>
                      {option?.label}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex items-center justify-between py-2 px-6">
              <button
                className={clearFilterButtonStyle()}
                onClick={clearFeedFilters}
                disabled={isFeelFiltersEmpty()}
                data-testid="filters-clearfiltercta"
              >
                {t('clearFilters')}{' '}
              </button>
              <Button
                label={t('apply')}
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
