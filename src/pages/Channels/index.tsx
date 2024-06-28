import Button, { Variant as ButtonVariant } from 'components/Button';
import Card from 'components/Card';
import { FC, useEffect, useMemo } from 'react';
import ChannelCard from './components/ChannelCard';
import FilterMenu from 'components/FilterMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useInfiniteChannels } from 'queries/channel';
import { isFiltersEmpty } from 'utils/misc';
import { ChannelVisibilityEnum } from 'stores/channelStore';
import useModal from 'hooks/useModal';
import ChannelModal from './components/ChannelModal';
import { ChannelTypeEnum } from 'components/FilterModal/ChannelType';
import ChannelRow from './components/ChannelRow';
import Divider from 'components/Divider';
import ChannelRowSkeleton from './components/ChannelRowSkeleton';
import ChannelCardSkeleton from './components/ChannelCardSkeleton';
import NoDataFound from 'components/NoDataFound';
import { ShowingCount } from 'pages/Users/components/Teams';
import { usePageTitle } from 'hooks/usePageTitle';
import clsx from 'clsx';

interface IChannelsProps {}

interface IFilterButton {
  label: string;
  isActive: boolean;
  onClick: () => void;
  labelClassName: string;
  className: string;
  dataTestId: string;
}

export const Channels: FC<IChannelsProps> = () => {
  usePageTitle('channels');
  const { t } = useTranslation('channels');
  const { filters, clearFilters, updateFilter } = useAppliedFiltersStore();
  const [isModalOpen, openModal, closeModal] = useModal();

  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  useEffect(() => () => clearFilters(), []);

  const { watch } = filterForm;
  const searchValue = watch('search');

  const { data, channels, isLoading } = useInfiniteChannels(
    isFiltersEmpty({
      q: searchValue,
      visiblity:
        filters?.visibility == ChannelVisibilityEnum.All
          ? undefined
          : filters?.visibility,
      sort: filters?.sort,
      categoryIds: filters?.categories
        ?.map((category: any) => category.id)
        .join(','),
      isStarred: !!(filters?.channelType === ChannelTypeEnum.Starred),
      isManaged: !!(filters?.channelType === ChannelTypeEnum.Managed),
      isRequested: !!(filters?.channelType === ChannelTypeEnum.Requested),
      isArchived: !!(filters?.channelType === ChannelTypeEnum.Archived),
      discover: !!(
        filters?.channelType === ChannelTypeEnum.DiscoverNewChannels
      ),
    }),
  );

  const channelIds =
    (data?.pages.flatMap(
      (page) =>
        page?.data?.result?.data.map((channel: { id: string }) => channel) ||
        [],
    ) as { id: string }[]) || [];

  const onFilterButtonClick = (type: ChannelTypeEnum) => {
    return () => {
      updateFilter('channelType', type);
    };
  };

  const filterButtons: IFilterButton[] = useMemo(() => {
    const getLableClassName = (flag: boolean) => {
      return clsx({
        'font-bold text-primary-500': flag,
        'font-normal text-neutral-500 group-hover:text-primary-600 group-focus:text-primary-600':
          !flag,
      });
    };
    const getClassName = (flag: boolean) => {
      return clsx({
        'focus:border-primary-600 focus:text-primary-600 hover:border-primary-600 focus:text-primary-600 group':
          true,
        'border-0': flag,
      });
    };
    return [
      {
        label: t('filterCTA.myChannels'),
        isActive: filters?.channelType === ChannelTypeEnum.MyChannels,
        onClick: onFilterButtonClick(ChannelTypeEnum.MyChannels),
        labelClassName: `text-sm ${getLableClassName(
          filters?.channelType === ChannelTypeEnum.MyChannels,
        )}`,
        className: `${getClassName(
          filters?.channelType === ChannelTypeEnum.MyChannels,
        )}`,
        dataTestId: 'my-channels-filter',
      },
      {
        label: t('filterCTA.managed'),
        isActive: filters?.channelType === ChannelTypeEnum.Managed,
        onClick: onFilterButtonClick(ChannelTypeEnum.Managed),
        labelClassName: `text-sm ${getLableClassName(
          filters?.channelType === ChannelTypeEnum.Managed,
        )}`,
        className: `${getClassName(
          filters?.channelType === ChannelTypeEnum.Managed,
        )}`,
        dataTestId: 'managed',
      },
      {
        label: t('filterCTA.discoverNewChannels'),
        isActive: filters?.channelType === ChannelTypeEnum.DiscoverNewChannels,
        onClick: onFilterButtonClick(ChannelTypeEnum.DiscoverNewChannels),
        labelClassName: `text-sm ${getLableClassName(
          filters?.channelType === ChannelTypeEnum.DiscoverNewChannels,
        )}`,
        className: `${getClassName(
          filters?.channelType === ChannelTypeEnum.DiscoverNewChannels,
        )}`,
        dataTestId: 'discover-new-channels-filter',
      },
      {
        label: t('filterCTA.starred'),
        isActive: filters?.channelType === ChannelTypeEnum.Starred,
        onClick: onFilterButtonClick(ChannelTypeEnum.Starred),
        labelClassName: `text-sm ${getLableClassName(
          filters?.channelType === ChannelTypeEnum.Starred,
        )}`,
        className: `${getClassName(
          filters?.channelType === ChannelTypeEnum.Starred,
        )}`,
        dataTestId: 'starred-filter',
      },
      {
        label: t('filterCTA.requested'),
        isActive: filters?.channelType === ChannelTypeEnum.Requested,
        onClick: onFilterButtonClick(ChannelTypeEnum.Requested),
        labelClassName: `text-sm ${getLableClassName(
          filters?.channelType === ChannelTypeEnum.Requested,
        )}`,
        className: `${getClassName(
          filters?.channelType === ChannelTypeEnum.Requested,
        )}`,
        dataTestId: 'requested-filter',
      },
    ];
  }, [filters]);

  return (
    <>
      <Card className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            {t('channels')}
          </h1>
          <Button
            label={t('createChannelCTA')}
            leftIcon="add"
            leftIconClassName="text-white pointer-events-none group-hover:text-white"
            onClick={openModal}
            dataTestId="createchannel-cta"
          />
        </div>
        <FilterMenu
          filterForm={filterForm}
          searchPlaceholder={t('searchChannels')}
          dataTestIdFilter="channel-filter-icon"
          dataTestIdSort="channel-sort-icon"
          dataTestIdSearch="channel-search"
        >
          <div className="flex gap-2 items-center">
            <p className="text-neutral-500 text-base">
              <ShowingCount
                isLoading={isLoading}
                count={data?.pages[0]?.data?.result?.totalCount}
              />
            </p>
            {filterButtons.map((filterButton) => (
              <Button
                key={filterButton.label}
                label={filterButton.label}
                variant={ButtonVariant.Secondary}
                active={filterButton.isActive}
                onClick={filterButton.onClick}
                labelClassName={filterButton.labelClassName}
                className={filterButton.className}
                dataTestId={filterButton.dataTestId}
              />
            ))}
          </div>
        </FilterMenu>
        {channelIds?.length == 0 && !isLoading && (
          <NoDataFound
            illustration="noChannelFound"
            className="py-4 w-full"
            onClearSearch={() => {}}
            labelHeader="No channels yet"
            message={<p>Channels created will be visible here</p>}
            hideClearBtn
            dataTestId={`$channel-noresult`}
          />
        )}
        {filters?.channelType === ChannelTypeEnum.Archived ? (
          isLoading ? (
            [...Array(5)].map((_each, index) => (
              <ChannelRowSkeleton key={index} />
            ))
          ) : (
            <>
              {channelIds.map(({ id }) => (
                <div key={id}>
                  <ChannelRow channel={channels[id]} />
                  <Divider />
                </div>
              ))}
            </>
          )
        ) : (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {isLoading ? (
              [...Array(5)].map((_each, index) => (
                <ChannelCardSkeleton key={index} />
              ))
            ) : (
              <>
                {channelIds.map(({ id }) => (
                  <ChannelCard key={id} channel={channels[id]} />
                ))}
              </>
            )}
          </div>
        )}
      </Card>
      {isModalOpen && (
        <ChannelModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </>
  );
};

export default Channels;
