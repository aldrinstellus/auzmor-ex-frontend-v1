import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ILocation } from 'interfaces';
import { FC, useEffect } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IFilterForm } from '.';
import ItemSkeleton from './ItemSkeleton';
import NoDataFound from 'components/NoDataFound';
import { isFiltersEmpty } from 'utils/misc';
import Truncate from 'components/Truncate';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

interface IChannelsProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Channels: FC<IChannelsProps> = ({ control, watch, setValue }) => {
  const { ref, inView } = useInView();
  const { getApi } = usePermissions();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'channelSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `channel-search`,
    },
  ];

  const [channelSearch, channelCheckbox] = watch([
    'channelSearch',
    'channelCheckbox',
  ]);

  const debouncedChannelSearchValue = useDebounce(channelSearch || '', 300);
  const useInfiniteChannels = getApi(ApiEnum.GetChannels);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteChannels(
      isFiltersEmpty({ q: debouncedChannelSearchValue, limit: 30 }),
    );
  const channelsData = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((channel: any) => channel);
  });

  const channelFields = [
    {
      type: FieldType.CheckboxList,
      name: 'channelCheckbox',
      control,
      options: channelsData?.map((location: ILocation) => ({
        data: location,
        datatestId: `location-${location.name}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <>
          <Truncate
            text={option.data.name}
            className="ml-2.5 cursor-pointer text-xs max-w-[200px]"
          />
        </>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!channelCheckbox?.length && (
          <ul className="flex mt-2 mb-3 flex-wrap">
            {channelCheckbox.map((channel: ICheckboxListOption) => (
              <li
                key={channel.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <Truncate
                  text={channel.data.name}
                  className="text-primary-500 text-sm font-medium whitespace-nowrap max-w-[128px]"
                />
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'channelCheckbox',
                        channelCheckbox.filter(
                          (selectedChannel: ICheckboxListOption) =>
                            selectedChannel.data.id !== channel.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {(() => {
          if (isLoading) {
            return (
              <>
                {[...Array(10)].map((_value, i) => (
                  <div
                    key={`${i}-location-item-skeleton`}
                    className={`px-6 py-3 border-b-1 border-b-bg-neutral-200 flex items-center`}
                  >
                    <ItemSkeleton />
                  </div>
                ))}
              </>
            );
          }
          if ((channelsData || []).length > 0) {
            return (
              <div>
                <Layout fields={channelFields} />
                {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                {isFetchingNextPage && (
                  <div className="w-full flex items-center justify-center p-8">
                    <Spinner />
                  </div>
                )}
              </div>
            );
          }
          return (
            <>
              {(debouncedChannelSearchValue === undefined ||
                debouncedChannelSearchValue === '') &&
              channelsData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  <NoDataFound
                    illustration="noResultAlt"
                    className="py-10 w-full"
                    searchString={''}
                    onClearSearch={() => {}}
                    labelHeader={<p> No Channel found</p>}
                    hideClearBtn
                    dataTestId={`noresult`}
                  />
                </div>
              ) : (
                <div className="flex items-center w-full text-lg font-bold ">
                  <NoDataFound
                    illustration="noResultAlt"
                    className="py-10 w-full"
                    searchString={debouncedChannelSearchValue}
                    onClearSearch={() => {}}
                    message={
                      <p>
                        Sorry we can&apos;t find the channel you are looking
                        for.
                        <br /> Please try using different filters
                      </p>
                    }
                    hideClearBtn
                    dataTestId={`noresult`}
                  />
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Channels;
