import { ICheckboxListOption } from 'components/CheckboxList';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { ILocation, useInfiniteLocations } from 'queries/location';
import React, { useEffect } from 'react';
import {
  Control,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IFilterForm } from '.';

interface ILocationsProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const Locations: React.FC<ILocationsProps> = ({ control, watch, setValue }) => {
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
        <div className="ml-2.5 cursor-pointer">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      {!!locationCheckbox?.length && (
        <div className="flex mt-2 mb-3 overflow-x-auto">
          {locationCheckbox.map((location: ICheckboxListOption) => (
            <div
              key={location.data.id}
              className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2"
            >
              <div className="text-primary-500 text-sm font-medium">
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
            </div>
          ))}
        </div>
      )}
      {isLoading ? (
        <div className="w-full flex items-center justify-center p-10">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-y-scroll max-h-96">
          <Layout fields={locationFields} />
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
          {isFetchingNextPage && (
            <div className="w-full flex items-center justify-center p-8">
              <Spinner />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Locations;
