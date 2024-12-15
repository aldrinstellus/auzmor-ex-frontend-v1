import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import ChannelLogo from 'pages/Channels/components/ChannelLogo';
import { isFiltersEmpty } from 'utils/misc';
import InfiniteSearch from 'components/InfiniteSearch';
import { ICategory } from 'interfaces';
import Truncate from 'components/Truncate';
import NoDataFound from 'components/NoDataFound';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

type ApiCallFunction = (queryParams: any) => any;
interface IChannelsBodyProps {
  entityRenderer?: (data: IChannel) => ReactNode;
  selectedChannelIds?: string[];
  dataTestId?: string;
  fetchChannels?: ApiCallFunction;
}

const ChannelsBody: FC<IChannelsBodyProps> = ({
  entityRenderer,
  selectedChannelIds = [],
  dataTestId,
  fetchChannels,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { form } = useEntitySearchFormStore();
  const { getApi } = usePermissions();
  const { watch, setValue, control, resetField } = form!;
  const [channelSearch, privacy, categories, channels, showSelectedMembers] =
    watch([
      'channelSearch',
      'privacy',
      'categories',
      'channels',
      'showSelectedMembers',
    ]);

  // Reset state on unmount
  useEffect(
    () => () => {
      setValue('selectAll', false);
      setValue('showSelectedMembers', false);
    },
    [],
  );

  const debouncedSearchValue = useDebounce(channelSearch || '', 500);
  const useInfiniteChannels = getApi(ApiEnum.GetChannels);
  const queryParams = isFiltersEmpty({
    limit: 30,
    q: debouncedSearchValue,
    visibility: privacy?.value,
    categoryIds: selectedCategories.length ? selectedCategories : undefined,
  });
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    fetchChannels
      ? fetchChannels(queryParams)
      : useInfiniteChannels(queryParams);

  const channelsData = data?.pages
    .flatMap((page: any) => page?.data?.result?.data)
    .filter((channel: IChannel) => {
      if (showSelectedMembers) {
        return !!channels[channel.id];
      }
      return true;
    });

  const useInfiniteCategories = getApi(ApiEnum.GetCategories);
  const {
    data: fetchedCategories,
    isLoading: categoryLoading,
    isFetchingNextPage: isFetchingNextCategoryPage,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
  } = useInfiniteCategories();

  const categoryData = fetchedCategories?.pages?.flatMap((page: any) =>
    page.data.result.data.map((category: ICategory) => category),
  );

  const { ref, inView } = useInView({
    root: document.getElementById(`channel-${dataTestId}-list`), // root-id
    rootMargin: '20%',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

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

  const updateSelectAll = () => {
    if (!channelsData || channelsData.length === 0 || showSelectedMembers) {
      setValue('selectAll', false);
      return;
    }
    const allSelected = channelsData.every(
      (channel: IChannel) => !!channels[channel.id],
    );
    setValue('selectAll', allSelected && channelsData.length > 1);
  };

  useEffect(() => {
    if (showSelectedMembers) {
      setValue('selectAll', false);
    }
    updateSelectAll();
  }, [showSelectedMembers]);

  const selectedCount = Object.values(channels || {}).filter(Boolean).length;

  const isControlsDisabled =
    !channelsData?.length && debouncedSearchValue !== '';

  return (
    <div className="flex flex-col min-h-[489px]">
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
          <div className="flex items-center text-neutral-500 font-medium text-sm">
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
              className="ml-2  "
            />
            <div className="relative">
              <InfiniteSearch
                title="Category"
                control={control}
                options={
                  categoryData?.map((category: ICategory) => ({
                    label: category.name,
                    value: category,
                    id: category.id,
                  })) || []
                }
                searchName={'categorySearch'}
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
                      setValue(`categories.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedCategories.length}
                dataTestId={`${dataTestId}-filter-category`}
              />
            </div>
          </div>
          <div
            className={`cursor-pointer text-neutral-500 text-sm font-medium hover:underline ${
              isControlsDisabled ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => {
              resetField('privacy');
              resetField('categories');
              setSelectedCategories([]);
            }}
            data-testid={`${dataTestId}-clearfilter`}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div
          className={`flex justify-between py-4 pr-6 ${
            isControlsDisabled ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
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
                    input: (value: boolean) => value && !showSelectedMembers,
                    output: (e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        selectAllEntity();
                      } else {
                        deselectAll();
                      }
                      return e.target.checked;
                    },
                  },
                  disabled:
                    showSelectedMembers ||
                    isControlsDisabled ||
                    !channelsData?.length ||
                    channelsData.length === 1,
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
            className="cursor-pointer text-neutral-500 font-semibold hover:underline"
            onClick={() => {
              deselectAll();
              setValue('selectAll', false);
              setValue('showSelectedMembers', false);
            }}
            data-testid={`${dataTestId}-clearall`}
          >
            clear all
          </div>
        </div>
        <div
          className="flex flex-col max-h-80 overflow-scroll"
          id={`channel-${dataTestId}-list`}
          data-testid={`${dataTestId}-list`}
        >
          {isLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : channelsData?.length ? (
            <ul>
              {channelsData?.map((channel: IChannel, index: number) => (
                <li key={`channel-${channel.id}-${index}`}>
                  <div className="py-2 flex items-center w-full">
                    <Layout
                      fields={[
                        {
                          type: FieldType.Checkbox,
                          name: `channels.${channel.id}`,
                          control,
                          className: 'flex item-center mr-4 w-full',
                          transform: {
                            input: (value: IChannel | boolean) => !!value,
                            output: (e: ChangeEvent<HTMLInputElement>) => {
                              const result = e.target.checked ? channel : false;
                              return result;
                            },
                          },
                          defaultChecked: selectedChannelIds.includes(
                            channel.id,
                          ),
                          dataTestId: `${dataTestId}-select-${channel.id}`,
                          label: (
                            <div className="w-full cursor-pointer">
                              {(entityRenderer && entityRenderer(channel)) || (
                                <div className="flex gap-2 items-center pl-1 w-full">
                                  <ChannelLogo
                                    channel={channel}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div className="flex flex-col">
                                    <Truncate
                                      toolTipTextClassName="w-48"
                                      text={channel?.name || ''}
                                      className="text-neutral-900 font-bold text-sm"
                                    />
                                    <p className="text-xs text-neutral-500">
                                      {channel?.totalMembers} members
                                    </p>
                                  </div>
                                </div>
                              )}
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
          ) : (
            <NoDataFound
              className="py-4 w-full"
              searchString={channelSearch}
              onClearSearch={() => {}}
              message={
                <p>
                  {' '}
                  Sorry we can&apos;t find the channel you are looking for.
                  <br /> Please check the spelling or try again.{' '}
                </p>
              }
              hideClearBtn
              dataTestId={`${dataTestId}-noresult`}
            />
          )}
          {hasNextPage && !showSelectedMembers && !isFetchingNextPage && (
            <div ref={ref} />
          )}
          {isFetchingNextPage && (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelsBody;
