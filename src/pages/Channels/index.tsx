import Button, { Variant as ButtonVariant } from 'components/Button';
import Card from 'components/Card';
import { FC, useEffect, useMemo } from 'react';
import ChannelCard from './components/ChannelCard';
import FilterMenu from 'components/FilterMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { useForm } from 'react-hook-form';
import useURLParams from 'hooks/useURLParams';
import { useTranslation } from 'react-i18next';
import { useInfiniteChannels } from 'queries/channel';
import { isFiltersEmpty } from 'utils/misc';
import { ChannelVisibilityEnum } from 'stores/channelStore';
import useModal from 'hooks/useModal';
import ChannelModal from './components/ChannelModal';
import { ChannelTypeEnum } from 'components/FilterModal/ChannelType';

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
  const { t: tc } = useTranslation('common');
  const { filters, setFilters, clearFilters, updateFilter } =
    useAppliedFiltersStore();
  const { searchParams } = useURLParams();
  const [isModalOpen, openModal, closeModal] = useModal();

  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });
  useEffect(() => {
    setFilters({
      type: searchParams.get('type') || ChannelTypeEnum.MyChannels,
    });
    return () => clearFilters();
  }, []);

  const { data, channels } = useInfiniteChannels(
    isFiltersEmpty({
      categoryIds: [],
      visibility: ChannelVisibilityEnum.Private,
      isStarred: !!(filters?.type === ChannelTypeEnum.Starred),
      isManaged: !!(filters?.type === ChannelTypeEnum.Managed),
      isRequested: !!(filters?.type === ChannelTypeEnum.Requested),
      discover: !!(filters?.type === ChannelTypeEnum.DiscoverNewChannels),
    }),
    !!(filters && !!(filters.type === ChannelTypeEnum.MyChannels)),
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

  const filterButtons: IFilterButton[] = useMemo(
    () => [
      {
        label: t('filterCTA.myChannels'),
        isActive: filters?.type === ChannelTypeEnum.MyChannels,
        onClick: () => updateFilter('type', ChannelTypeEnum.MyChannels),
        labelClassName: `text-sm ${
          filters?.type === ChannelTypeEnum.MyChannels
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.type === ChannelTypeEnum.MyChannels ? 'border-0' : '',
        dataTestId: 'my-channels-filter',
      },
      {
        label: t('filterCTA.managed'),
        isActive: filters?.type === ChannelTypeEnum.Managed,
        onClick: () => updateFilter('type', ChannelTypeEnum.Managed),
        labelClassName: `text-sm ${
          filters?.type === ChannelTypeEnum.Managed
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className: filters?.type === ChannelTypeEnum.Managed ? 'border-0' : '',
        dataTestId: 'managed',
      },
      {
        label: t('filterCTA.discoverNewChannels'),
        isActive: filters?.type === ChannelTypeEnum.DiscoverNewChannels,
        onClick: () =>
          updateFilter('type', ChannelTypeEnum.DiscoverNewChannels),
        labelClassName: `text-sm ${
          filters?.type === ChannelTypeEnum.DiscoverNewChannels
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.type === ChannelTypeEnum.DiscoverNewChannels
            ? 'border-0'
            : '',
        dataTestId: 'discover-new-channels-filter',
      },
      {
        label: t('filterCTA.starred'),
        isActive: filters?.type === ChannelTypeEnum.Starred,
        onClick: () => updateFilter('type', ChannelTypeEnum.Starred),
        labelClassName: `text-sm ${
          filters?.type === ChannelTypeEnum.Starred
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className: filters?.type === ChannelTypeEnum.Starred ? 'border-0' : '',
        dataTestId: 'starred-filter',
      },
      {
        label: t('filterCTA.requested'),
        isActive: filters?.type === ChannelTypeEnum.Requested,
        onClick: () => updateFilter('type', ChannelTypeEnum.Requested),
        labelClassName: `text-sm ${
          filters?.type === ChannelTypeEnum.Requested
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.type === ChannelTypeEnum.Requested ? 'border-0' : '',
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
              {tc('showing')} {channelIds.length} {tc('result')}
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
        <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
          {channelIds.map(({ id }) => (
            <ChannelCard
              key={id}
              channel={channels[id]}
              showJoinChannelBtn={
                filters?.type === ChannelTypeEnum.DiscoverNewChannels &&
                channels[id].channelSettings?.visibility ===
                  ChannelVisibilityEnum.Public
              }
              showRequestBtn={
                filters?.type === ChannelTypeEnum.DiscoverNewChannels &&
                channels[id].channelSettings?.visibility ===
                  ChannelVisibilityEnum.Private &&
                !!!channels[id].isRequested
              }
              showWithdrawBtn={
                filters?.type === ChannelTypeEnum.DiscoverNewChannels &&
                channels[id].channelSettings?.visibility ===
                  ChannelVisibilityEnum.Private &&
                !!channels[id].isRequested
              }
            />
          ))}
        </div>
      </Card>
      {isModalOpen && (
        <ChannelModal isOpen={isModalOpen} closeModal={closeModal} />
      )}
    </>
  );
};
