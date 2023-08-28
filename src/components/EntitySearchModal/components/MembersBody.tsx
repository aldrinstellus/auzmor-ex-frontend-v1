import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IDepartment, useInfiniteDepartments } from 'queries/department';
import { useInfiniteLocations } from 'queries/location';
import { IGetUser, useInfiniteUsers } from 'queries/users';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IAudienceForm } from '..';
import UserRow from './UserRow';
import InfiniteSearch from 'components/InfiniteSearch';

interface IMembersBodyProps {
  control: Control<IAudienceForm, any>;
  watch: UseFormWatch<IAudienceForm>;
  setValue: UseFormSetValue<IAudienceForm>;
  resetField: UseFormResetField<IAudienceForm>;
  entityRenderer?: (data: IGetUser) => ReactNode;
  selectedMemberIds?: string[];
}

const MembersBody: React.FC<IMembersBodyProps> = ({
  control,
  watch,
  setValue,
  resetField,
  entityRenderer,
  selectedMemberIds = [],
}) => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const formData = watch();
  const debouncedSearchValue = useDebounce(formData.memberSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteUsers({
      q: debouncedSearchValue,
      department: selectedDepartments,
      location: selectedLocations,
    });
  const usersData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((user: IGetUser) => {
        try {
          return user;
        } catch (e) {
          console.log('Error', { user });
        }
      });
    })
    .filter((user: IGetUser) => {
      if (formData.showSelectedMembers) {
        return !!formData.users[user.id];
      }
      return true;
    });
  const debouncedDepartmentSearchValue = useDebounce(
    formData.departmentSearch || '',
    500,
  );
  const {
    data: departments,
    isLoading: departmentLoading,
    isFetchingNextPage: isFetchingNextDepartmentPage,
    fetchNextPage: fetchNextDepartmentPage,
    hasNextPage: hasNextDepartmentPage,
  } = useInfiniteDepartments({
    q: debouncedDepartmentSearchValue,
  });
  const departmentData = departments?.pages.flatMap((page) => {
    return (page as any)?.data?.result?.data.map((department: any) => {
      try {
        return department;
      } catch (e) {
        console.log('Error', { department });
      }
    });
  });

  const debouncedLocationSearchValue = useDebounce(
    formData.departmentSearch || '',
    500,
  );
  const {
    data: locations,
    isLoading: locationLoading,
    isFetchingNextPage: isFetchingNextLocationPage,
    fetchNextPage: fetchNextLocationPage,
    hasNextPage: hasNextLocationPage,
  } = useInfiniteLocations({
    q: debouncedLocationSearchValue,
  });
  const locationData = locations?.pages.flatMap((page) => {
    return (page as any)?.result?.data.map((location: any) => {
      try {
        return location;
      } catch (e) {
        console.log('Error', { location });
      }
    });
  });

  useEffect(() => {
    if (formData.selectAll) {
      selectAll();
    } else {
      deselectAll();
    }
  }, [formData.selectAll]);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (selectedMemberIds.length) {
      selectedMemberIds.forEach((id: string) => {
        setValue(`users.${id}`, true);
      });
    }
  }, []);

  const selectAll = () => {
    Object.keys(formData.users).forEach((key) => {
      setValue(`users.${key}`, true);
    });
  };

  const deselectAll = () => {
    Object.keys(formData.users).forEach((key) => {
      setValue(`users.${key}`, false);
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'memberSearch',
              label: 'Select member',
              placeholder: 'Add via name or email address',
              isClearable: true,
            },
          ]}
          className="pb-4"
        />
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center text-neutral-500 font-medium ${
              !!!usersData?.length && 'opacity-50 pointer-events-none'
            }`}
          >
            Quick filters:
            <div className="relative">
              <InfiniteSearch
                title="Department"
                control={control}
                options={
                  departmentData?.map((department) => ({
                    label: department.name,
                    value: department,
                    id: department.id,
                  })) || []
                }
                searchName={'departmentSearch'}
                optionsName={'departments'}
                isLoading={departmentLoading}
                isFetchingNextPage={isFetchingNextDepartmentPage}
                fetchNextPage={fetchNextDepartmentPage}
                hasNextPage={hasNextDepartmentPage}
                onApply={() =>
                  setSelectedDepartments([
                    ...Object.keys(formData.departments).filter(
                      (key: string) => !!formData.departments[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedDepartments([]);
                  if (formData?.departments) {
                    Object.keys(formData.departments).forEach((key: string) =>
                      setValue(`departments.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedDepartments.length}
              />
            </div>
            <div className="relative">
              <InfiniteSearch
                title="Location"
                control={control}
                options={
                  locationData?.map((location) => ({
                    label: location.name,
                    value: location,
                    id: location.id,
                  })) || []
                }
                searchName={'locationSearch'}
                optionsName={'locations'}
                isLoading={locationLoading}
                isFetchingNextPage={isFetchingNextLocationPage}
                fetchNextPage={fetchNextLocationPage}
                hasNextPage={hasNextLocationPage}
                onApply={() =>
                  setSelectedLocations([
                    ...Object.keys(formData.locations).filter(
                      (key: string) => !!formData.locations[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedLocations([]);
                  if (formData?.locations) {
                    Object.keys(formData.locations).forEach((key: string) =>
                      setValue(`locations.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedLocations.length}
              />
            </div>
          </div>
          <div
            className={`cursor-pointer text-neutral-500 font-medium hover:underline ${
              !!!usersData?.length && 'opacity-50 pointer-events-none'
            }`}
            onClick={() => {
              setSelectedDepartments([]);
              setSelectedLocations([]);
              Object.keys(formData.departments).forEach((key: string) =>
                setValue(`departments.${key}`, false),
              );
              Object.keys(formData.locations).forEach((key: string) =>
                setValue(`locations.${key}`, false),
              );
            }}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div
          className={`flex justify-between py-4 pr-6 ${
            !!!usersData?.length && 'opacity-50 pointer-events-none'
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
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: 'Show selected members',
                  className: 'flex item-center',
                },
              ]}
              className="ml-4"
            />
          </div>
          <div
            className="cursor-pointer text-neutral-500 font-semibold hover:underline"
            onClick={() => {
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
          ) : usersData?.length ? (
            usersData?.map((user, index) => (
              <>
                <div className="py-2 flex items-center" key={user.id}>
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `users.${user.id}`,
                        control,
                        className: 'flex item-center mr-4',
                        transform: {
                          input: (value: IGetUser | boolean) => !!value,
                          output: (e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) return user;
                            return false;
                          },
                        },
                      },
                    ]}
                  />
                  {(entityRenderer && entityRenderer(user)) || (
                    <UserRow user={user} />
                  )}
                </div>
                {index !== usersData.length - 1 && <Divider />}
              </>
            ))
          ) : (
            <div className="flex flex-col items-center w-full justify-center">
              <div className="mt-8 mb-4">
                <img src={require('images/noResult.png')} />
              </div>
              <div className="text-neutral-900 text-lg font-bold mb-4">
                No result found
                {formData.memberSearch != '' &&
                  `for ‘${formData.memberSearch}’`}
              </div>
              <div className="text-neutral-500 text-xs">
                Sorry we can’t find the member you are looking for.
              </div>
              <div className="text-neutral-500 text-xs">
                Please check the spelling or try again.
              </div>
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
};

export default MembersBody;
