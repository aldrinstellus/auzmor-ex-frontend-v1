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
  const { data, channels, isLoading } = useInfiniteChannels(
    isFiltersEmpty({
      categoryIds: [],
      visibility: filters?.visibility,
      isStarred: !!(filters?.channelType === ChannelTypeEnum.Starred),
      isManaged: !!(filters?.channelType === ChannelTypeEnum.Managed),
      isRequested: !!(filters?.channelType === ChannelTypeEnum.Requested),
      isArchived: !!(filters?.channelType === ChannelTypeEnum.Archived),
      discover: !!(
        filters?.channelType === ChannelTypeEnum.DiscoverNewChannels
      ),
    }),
    !!(filters && !!(filters.channelType === ChannelTypeEnum.MyChannels)),
  );

  const channelIds = (
    (data?.pages.flatMap((page) =>
      page.data?.result?.data.map((channel: { id: string }) => channel),
    ) as { id: string }[]) || []
  )
    ?.filter(({ id }) => !!channels[id])
    .sort(
      (a, b) =>
        new Date(channels[b.id].createdAt).getTime() -
        new Date(channels[a.id].createdAt).getTime(),
    );

  const onFilterButtonClick = (type: ChannelTypeEnum) => {
    return () => {
      updateFilter('channelType', type);
    };
  };

  const filterButtons: IFilterButton[] = useMemo(
    () => [
      {
        label: t('filterCTA.myChannels'),
        isActive: filters?.channelType === ChannelTypeEnum.MyChannels,
        onClick: onFilterButtonClick(ChannelTypeEnum.MyChannels),
        labelClassName: `text-sm ${
          filters?.channelType === ChannelTypeEnum.MyChannels
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.channelType === ChannelTypeEnum.MyChannels ? 'border-0' : '',
        dataTestId: 'my-channels-filter',
      },
      {
        label: t('filterCTA.managed'),
        isActive: filters?.channelType === ChannelTypeEnum.Managed,
        onClick: onFilterButtonClick(ChannelTypeEnum.Managed),
        labelClassName: `text-sm ${
          filters?.channelType === ChannelTypeEnum.Managed
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.channelType === ChannelTypeEnum.Managed ? 'border-0' : '',
        dataTestId: 'managed',
      },
      {
        label: t('filterCTA.discoverNewChannels'),
        isActive: filters?.channelType === ChannelTypeEnum.DiscoverNewChannels,
        onClick: onFilterButtonClick(ChannelTypeEnum.DiscoverNewChannels),
        labelClassName: `text-sm ${
          filters?.channelType === ChannelTypeEnum.DiscoverNewChannels
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.channelType === ChannelTypeEnum.DiscoverNewChannels
            ? 'border-0'
            : '',
        dataTestId: 'discover-new-channels-filter',
      },
      {
        label: t('filterCTA.starred'),
        isActive: filters?.channelType === ChannelTypeEnum.Starred,
        onClick: onFilterButtonClick(ChannelTypeEnum.Starred),
        labelClassName: `text-sm ${
          filters?.channelType === ChannelTypeEnum.Starred
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.channelType === ChannelTypeEnum.Starred ? 'border-0' : '',
        dataTestId: 'starred-filter',
      },
      {
        label: t('filterCTA.requested'),
        isActive: filters?.channelType === ChannelTypeEnum.Requested,
        onClick: onFilterButtonClick(ChannelTypeEnum.Requested),
        labelClassName: `text-sm ${
          filters?.channelType === ChannelTypeEnum.Requested
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.channelType === ChannelTypeEnum.Requested ? 'border-0' : '',
        dataTestId: 'requested-filter',
      },
    ],
    [filters],
  );

  return (
    <>
      <Card className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-neutral-900">{t('channels')}</p>
          <Button
            label={t('createChannelCTA')}
            leftIcon="add"
            leftIconClassName="text-white pointer-events-none group-hover:text-white"
            onClick={openModal}
            dataTestId="createchannel-cta"
            className="hidden"
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
              {`Showing ${channelIds.length} ${
                channelIds.length === 1 ? 'result' : 'results'
              }`}
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
        {filters?.channelType === ChannelTypeEnum.Archived ? (
          isLoading ? (
            [...Array(8)].map((_each, index) => (
              <ChannelRowSkeleton key={index} />
            ))
          ) : (
            channelIds.map(({ id }) => (
              <>
                <ChannelRow key={id} channel={channels[id]} />
                <Divider />
              </>
            ))
          )
        ) : (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {isLoading
              ? [...Array(8)].map((_each, index) => (
                  <ChannelCardSkeleton key={index} />
                ))
              : channelIds.map(({ id }) => (
                  <ChannelCard
                    key={id}
                    channel={channels[id]}
                    showJoinChannelBtn={
                      filters?.channelType ===
                        ChannelTypeEnum.DiscoverNewChannels &&
                      channels[id].channelSettings?.visibility ===
                        ChannelVisibilityEnum.Public
                    }
                    showRequestBtn={
                      filters?.channelType ===
                        ChannelTypeEnum.DiscoverNewChannels &&
                      channels[id].channelSettings?.visibility ===
                        ChannelVisibilityEnum.Private &&
                      !!!channels[id].isRequested
                    }
                    showWithdrawBtn={
                      filters?.channelType ===
                        ChannelTypeEnum.DiscoverNewChannels &&
                      channels[id].channelSettings?.visibility ===
                        ChannelVisibilityEnum.Private &&
                      !!channels[id].isRequested
                    }
                  />
                ))}
          </div>
        )}
      </Card>
      {isModalOpen && (
        <ChannelModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </>
  );
};
