import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteChannels } from 'queries/channel';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import ChannelLogo from 'pages/Channels/components/ChannelLogo';
import { isFiltersEmpty } from 'utils/misc';
import InfiniteSearch from 'components/InfiniteSearch';
import { ICategory, useInfiniteCategories } from 'queries/category';

interface IChannelsBodyProps {
  entityRenderer?: (data: IChannel) => ReactNode;
  selectedChannelIds?: string[];
  dataTestId?: string;
}

const ChannelsBody: FC<IChannelsBodyProps> = ({
  entityRenderer,
  selectedChannelIds,
  dataTestId,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control, resetField, unregister } = form!;
  const [channelSearch, privacy, categories, channels, showSelectedMembers] =
    watch([
      'channelSearch',
      'privacy',
      'categories',
      'channels',
      'showSelectedMembers',
    ]);

  const debouncedSearchValue = useDebounce(channelSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteChannels(
      isFiltersEmpty({
        limit: 30,
        q: debouncedSearchValue,
        visibility: privacy?.value,
        categoryIds: categories?.id,
      }),
    );
  let channelsData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((channel: any) => {
        try {
          return channel;
        } catch (e) {
          console.log('Error', { channel });
        }
      });
    })
    .filter((channel) => {
      if (showSelectedMembers) {
        return !!channels[channel.id];
      }
      return true;
    }) as IChannel[];

  const {
    data: fetchedCategoried,
    isLoading: categoryLoading,
    isFetchingNextPage: isFetchingNextCategoryPage,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
  } = useInfiniteCategories();

  const categoryData = fetchedCategoried?.pages?.flatMap((page) => {
    page.data.result.data.map((category: ICategory) => {
      try {
        return category;
      } catch (e) {
        console.log('Error', { category });
      }
    });
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const selectAllEntity = () => {
    channelsData?.forEach((channel: IChannel) =>
      setValue(`channels.${channel.id}`, channel),
    );
  };

  const deselectAll = () => {
    Object.keys(channels || {}).forEach((key) => {
      setValue(`channels.${key}`, false);
    });
  };

  const channelKeys = Object.keys(channels || {});

  useEffect(() => {
    if (!showSelectedMembers) {
      unregisterChannels();
    }
    updateSelectAll();
  }, [channelKeys, channelsData, showSelectedMembers]);

  const unregisterChannels = () => {
    channelKeys.forEach((key) => {
      if (
        !channelsData?.find((channel: IChannel) => channel.id === key) &&
        !channels[key]
      )
        unregister(`channels.${key}`);
    });
  };

  const selectedMembers = channelKeys
    .map((key) => channels[key])
    .filter(Boolean);
  const selectedCount = selectedMembers.length;

  const updateSelectAll = () => {
    if (
      channelsData?.length === 0 ||
      channelsData?.some((channel: IChannel) => !channels?.[channel.id]) ||
      showSelectedMembers
    ) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

  if (showSelectedMembers) channelsData = selectedMembers as IChannel[];

  return (
    <div className="flex flex-col min-h-[489px] ">
      <div className="flex flex-col py-4 px-6 gap-4">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'channelSearch',
              label: 'Search channels',
              placeholder: 'Search channels by name',
              isClearable: true,
              dataTestId: `${dataTestId}-search`,
              inputClassName: 'text-sm py-[9px]',
            },
          ]}
        />
        <div className="items-center justify-between hidden">
          <div className="flex items-center">
            Quick filters:
            <Layout
              fields={[
                {
                  type: FieldType.SingleSelect,
                  control,
                  name: 'privacy',
                  options: [
                    { value: ChannelVisibilityEnum.Public, label: 'Public' },
                    { value: ChannelVisibilityEnum.Private, label: 'Private' },
                  ],
                  placeholder: 'Privacy',
                  showSearch: false,
                },
              ]}
              className="ml-2"
            />
            <div className="relative">
              <InfiniteSearch
                title="Categories"
                control={control}
                options={
                  (categoryData as any)?.map((category: ICategory) => ({
                    label: category.name,
                    value: category,
                    id: category.id,
                  })) || []
                }
                searchName={'locationSearch'}
                optionsName={'categories'}
                isLoading={categoryLoading}
                isFetchingNextPage={isFetchingNextCategoryPage}
                fetchNextPage={fetchNextCategoryPage}
                hasNextPage={hasNextCategoryPage}
                onApply={() =>
                  setSelectedCategories([
                    ...Object.keys(categories).filter(
                      (key: string) => !!categories[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedCategories([]);
                  if (categories) {
                    Object.keys(categories).forEach((key: string) =>
                      setValue(`locations.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedCategories.length}
                dataTestId={`${dataTestId}-filter-location`}
              />
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              resetField('privacy');
              resetField('categories');
            }}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div className="flex justify-between py-4 pr-6">
          <div className="flex items-center">
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'selectAll',
                  control,
                  label: 'Select all',
                  className: 'flex item-center',
                  transform: {
                    input: (value: boolean) => {
                      return value;
                    },
                    output: (e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        selectAllEntity();
                      } else {
                        deselectAll();
                      }
                      return e.target.checked;
                    },
                  },
                  disabled: showSelectedMembers,
                  dataTestId: `${dataTestId}-selectall`,
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: `Show selected (${selectedCount})`,
                  className: 'flex item-center',
                  disabled: selectedCount === 0 && !showSelectedMembers,
                  dataTestId: `${dataTestId}-showselected`,
                },
              ]}
              className="ml-4"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              deselectAll();
              setValue('selectAll', false);
              setValue('showSelectedMembers', false);
            }}
          >
            clear all
          </div>
        </div>
        <div className="flex flex-col max-h-72 overflow-scroll">
          {isLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : (
            <ul>
              {channelsData?.map((channel, index) => (
                <li key={`channel-${channel.id}-${index}`}>
                  <div className="py-2 flex items-center w-full">
                    <Layout
                      fields={[
                        {
                          type: FieldType.Checkbox,
                          name: `channels.${channel.id}`,
                          control,
                          className: 'item-center mr-4 w-full',
                          transform: {
                            input: (value: IChannel | boolean) => {
                              updateSelectAll();
                              return !!value;
                            },
                            output: (e: ChangeEvent<HTMLInputElement>) => {
                              if (e.target.checked) return channel;
                              return false;
                            },
                          },
                          defaultChecked: selectedChannelIds?.includes(
                            channel.id,
                          ),
                          label: (entityRenderer &&
                            entityRenderer(channel)) || (
                            <div className="flex gap-2 items-center pl-1 w-full">
                              <ChannelLogo
                                channel={channel}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex flex-col">
                                <p className="text-neutral-900 font-bold text-sm">
                                  {channel.name}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {channel?.totalMembers} members
                                </p>
                              </div>
                            </div>
                          ),
                          labelContainerClassName: 'w-full',
                        },
                      ]}
                      className="w-full"
                    />
                  </div>
                  {index !== channelsData.length - 1 && <Divider />}
                </li>
              ))}
            </ul>
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
};

export default ChannelsBody;
