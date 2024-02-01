import Button, { Variant as ButtonVariant } from 'components/Button';
import Card from 'components/Card';
import { FC, useEffect, useMemo } from 'react';
import ChannelCard from './components/ChannelCard';
import { IChannel, useChannelStore } from 'stores/channelStore';
import FilterMenu from 'components/FilterMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { useForm } from 'react-hook-form';
import useURLParams from 'hooks/useURLParams';

interface IChannelsProps {}

enum ChannelCardEnum {
  MyChannels = 'MY_CHANNELS',
  Managed = 'MANAGED',
  DiscoverNewChannels = 'DISCOVER_NEW_CHANNELS',
  Starred = 'STARRED',
  Requested = 'REQUESTED',
}

interface IFilterButton {
  label: string;
  isActive: boolean;
  onClick: () => void;
  labelClassName: string;
  className: string;
}

export const Channels: FC<IChannelsProps> = () => {
  const getChannels = useChannelStore((state) => state.getChannels);
  const { filters, setFilters, clearFilters, updateFilter } =
    useAppliedFiltersStore();
  const { searchParams } = useURLParams();

  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  useEffect(() => {
    setFilters({
      type: searchParams.get('type') || ChannelCardEnum.MyChannels,
    });
    return () => clearFilters();
  }, []);

  const filterButtons: IFilterButton[] = useMemo(
    () => [
      {
        label: 'My channels',
        isActive: filters?.type === ChannelCardEnum.MyChannels,
        onClick: () => updateFilter('type', ChannelCardEnum.MyChannels),
        labelClassName: `text-sm ${
          filters?.type === ChannelCardEnum.MyChannels
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.type === ChannelCardEnum.MyChannels ? 'border-0' : '',
      },
      {
        label: 'Managed',
        isActive: filters?.type === ChannelCardEnum.Managed,
        onClick: () => updateFilter('type', ChannelCardEnum.Managed),
        labelClassName: `text-sm ${
          filters?.type === ChannelCardEnum.Managed
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className: filters?.type === ChannelCardEnum.Managed ? 'border-0' : '',
      },
      {
        label: 'Discover new channels',
        isActive: filters?.type === ChannelCardEnum.DiscoverNewChannels,
        onClick: () =>
          updateFilter('type', ChannelCardEnum.DiscoverNewChannels),
        labelClassName: `text-sm ${
          filters?.type === ChannelCardEnum.DiscoverNewChannels
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.type === ChannelCardEnum.DiscoverNewChannels
            ? 'border-0'
            : '',
      },
      {
        label: 'Starred',
        isActive: filters?.type === ChannelCardEnum.Starred,
        onClick: () => updateFilter('type', ChannelCardEnum.Starred),
        labelClassName: `text-sm ${
          filters?.type === ChannelCardEnum.Starred
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className: filters?.type === ChannelCardEnum.Starred ? 'border-0' : '',
      },
      {
        label: 'Requested',
        isActive: filters?.type === ChannelCardEnum.Requested,
        onClick: () => updateFilter('type', ChannelCardEnum.Requested),
        labelClassName: `text-sm ${
          filters?.type === ChannelCardEnum.Requested
            ? 'font-bold text-primary-500'
            : 'font-normal text-neutral-500'
        }`,
        className:
          filters?.type === ChannelCardEnum.Requested ? 'border-0' : '',
      },
    ],
    [filters],
  );

  return (
    <Card className="p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-neutral-900">Channels</p>
        <Button
          label="Create channel"
          leftIcon="add"
          leftIconClassName="text-white pointer-events-none group-hover:text-white"
          onClick={() => setFilters({ managed: true })}
        />
      </div>
      <FilterMenu filterForm={filterForm}>
        <div className="flex gap-2">
          {filterButtons.map((filterButton) => (
            <Button
              key={filterButton.label}
              label={filterButton.label}
              variant={ButtonVariant.Secondary}
              active={filterButton.isActive}
              onClick={filterButton.onClick}
              labelClassName={filterButton.labelClassName}
              className={filterButton.className}
            />
          ))}
        </div>
      </FilterMenu>
      <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
        {getChannels().map((channel: IChannel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </Card>
  );
};
