import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ILocation, useInfiniteLocations } from 'queries/location';
import { FC, useEffect } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IFilterForm } from '.';
import ItemSkeleton from './ItemSkeleton';
import NoDataFound from 'components/NoDataFound';

interface ILocationsProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Locations: FC<ILocationsProps> = ({ control, watch, setValue }) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'locationSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `location-search`,
    },
  ];

  const [locationSearch, locationCheckbox] = watch([
    'locationSearch',
    'locationCheckbox',
  ]);

  // fetch location from search input
  const debouncedLocationSearchValue = useDebounce(locationSearch || '', 300);
  const {
    data: fetchedLocations,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteLocations({
    q: debouncedLocationSearchValue,
  });
  const locationData = fetchedLocations?.pages.flatMap((page) => {
    return page.data.result.data.map((location: ILocation) => location);
  });

  const locationFields = [
    {
      type: FieldType.CheckboxList,
      name: 'locationCheckbox',
      control,
      options: locationData?.map((location: ILocation) => ({
        data: location,
        datatestId: `location-${location.name}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!locationCheckbox?.length && (
          <ul className="flex mt-2 mb-3 flex-wrap">
            {locationCheckbox.map((location: ICheckboxListOption) => (
              <li
                key={location.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {location.data.name}
                </div>
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'locationCheckbox',
                        locationCheckbox.filter(
                          (selectedLocation: ICheckboxListOption) =>
                            selectedLocation.data.id !== location.data.id,
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
                {[...Array(10)].map((element) => (
                  <div
                    key={element}
                    className={`px-6 py-3 border-b-1 border-b-bg-neutral-200 flex items-center`}
                  >
                    <ItemSkeleton />
                  </div>
                ))}
              </>
            );
          }
          if ((locationData || []).length > 0) {
            return (
              <div>
                <Layout fields={locationFields} />
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
              {(debouncedLocationSearchValue === undefined ||
                debouncedLocationSearchValue === '') &&
              locationData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  <NoDataFound
                    illustration="noResultAlt"
                    className="py-10 w-full"
                    searchString={''}
                    onClearSearch={() => {}}
                    labelHeader={<p> No Locations found</p>}
                    hideClearBtn
                    dataTestId={`noresult`}
                  />
                </div>
              ) : (
                <div className="flex items-center w-full text-lg font-bold ">
                  <NoDataFound
                    illustration="noResultAlt"
                    className="py-10 w-full"
                    searchString={debouncedLocationSearchValue}
                    onClearSearch={() => {}}
                    message={
                      <p>
                        Sorry we can&apos;t find the location you are looking
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

export default Locations;
