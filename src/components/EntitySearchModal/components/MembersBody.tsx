import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import { IDepartmentAPI, useInfiniteDepartments } from 'queries/department';
import { ILocationAPI, useInfiniteLocations } from 'queries/location';
import { IGetUser, useInfiniteUsers } from 'queries/users';
import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import UserRow from './UserRow';
import InfiniteSearch from 'components/InfiniteSearch';
import { useEntitySearchFormStore } from 'stores/entitySearchFormStore';
import useAuth from 'hooks/useAuth';
import { IDesignationAPI, useInfiniteDesignations } from 'queries/designation';

type ApiCallFunction = (queryParams: any) => any;
interface IMembersBodyProps {
  entityRenderer?: (data: IGetUser) => ReactNode;
  selectedMemberIds?: string[];
  dataTestId?: string;
  entitySearchLabel?: string;
  hideCurrentUser?: boolean;
  showJobTitleFilter?: boolean;
  disableKey?: string;
  fetchUsers?: ApiCallFunction;
  usersQueryParams?: Record<string, any>;
}

const MembersBody: FC<IMembersBodyProps> = ({
  entityRenderer,
  selectedMemberIds = [],
  dataTestId,
  entitySearchLabel,
  hideCurrentUser,
  showJobTitleFilter,
  disableKey,
  fetchUsers = useInfiniteUsers,
  usersQueryParams = {},
}) => {
  const { user: currentUser } = useAuth();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>(
    [],
  );
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control } = form!;
  const [
    memberSearch,
    showSelectedMembers,
    users,
    departmentSearch,
    departments,
    locationSearch,
    locations,
    designationSearch,
    designations,
  ] = watch([
    'memberSearch',
    'showSelectedMembers',
    'users',
    'departmentSearch',
    'departments',
    'locationSearch',
    'locations',
    'designationSearch',
    'designations',
  ]);

  // fetch users from search input
  const debouncedSearchValue = useDebounce(memberSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    fetchUsers({
      q: {
        q: debouncedSearchValue,
        departments:
          selectedDepartments.length > 0
            ? selectedDepartments.join(',')
            : undefined,
        locations:
          selectedLocations.length > 0
            ? selectedLocations.join(',')
            : undefined,
        designations:
          selectedDesignations.length > 0
            ? selectedDesignations.join(',')
            : undefined,
        ...usersQueryParams,
      },
    });

  const usersData = data?.pages
    .flatMap((page: any) => {
      return page?.data?.result?.data.map((user: IGetUser) => {
        try {
          return user;
        } catch (e) {
          console.log('Error', { user });
        }
      });
    })
    .filter((user: IGetUser) => {
      if (hideCurrentUser && user.id === currentUser!.id) {
        return false;
      }
      if (showSelectedMembers) {
        return !!users[user.id];
      }
      return true;
    });

  // fetch departments from search input
  const debouncedDepartmentSearchValue = useDebounce(
    departmentSearch || '',
    500,
  );
  const {
    data: fetchedDepartments,
    isLoading: departmentLoading,
    isFetchingNextPage: isFetchingNextDepartmentPage,
    fetchNextPage: fetchNextDepartmentPage,
    hasNextPage: hasNextDepartmentPage,
  } = useInfiniteDepartments({
    q: debouncedDepartmentSearchValue,
  });
  const departmentData = fetchedDepartments?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((department: IDepartmentAPI) => {
      try {
        return department;
      } catch (e) {
        console.log('Error', { department });
      }
    });
  });

  // fetch location from search input
  const debouncedLocationSearchValue = useDebounce(locationSearch || '', 500);
  const {
    data: fetchedLocations,
    isLoading: locationLoading,
    isFetchingNextPage: isFetchingNextLocationPage,
    fetchNextPage: fetchNextLocationPage,
    hasNextPage: hasNextLocationPage,
  } = useInfiniteLocations({
    q: debouncedLocationSearchValue,
  });
  const locationData = fetchedLocations?.pages.flatMap((page) => {
    return page.data.result.data.map((location: ILocationAPI) => {
      try {
        return location;
      } catch (e) {
        console.log('Error', { location });
      }
    });
  });

  // fetch designation from search input
  const debouncedDesignationSearchValue = useDebounce(
    designationSearch || '',
    500,
  );
  const {
    data: fetchedDesignations,
    isLoading: designationLoading,
    isFetchingNextPage: isFetchingNextDesignationPage,
    fetchNextPage: fetchNextDesignationPage,
    hasNextPage: hasNextDesignationPage,
  } = useInfiniteDesignations({
    q: {
      q: debouncedDesignationSearchValue,
    },
    startFetching: !!showJobTitleFilter,
  });
  const designationData = fetchedDesignations?.pages.flatMap((page) => {
    return page.data.result.data.map((designation: IDesignationAPI) => {
      try {
        return designation;
      } catch (e) {
        console.log('Error', { designation });
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
    usersData?.forEach((user: IGetUser) => setValue(`users.${user.id}`, user));
  };

  const deselectAll = () => {
    Object.keys(users).forEach((key) => {
      setValue(`users.${key}`, false);
    });
  };

  const updateSelectAll = () => {
    if (Object.keys(users).some((key: string) => !!!users[key])) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

  const isControlsDisabled =
    !!!usersData?.length && debouncedSearchValue !== '';

  return (
    <div className="flex flex-col min-h-[489px]">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'memberSearch',
              label: entitySearchLabel || 'Select member',
              placeholder: 'Add via name or email address',
              isClearable: true,
              dataTestId: `select-${dataTestId}-search`,
              inputClassName: 'text-sm py-[9px]',
            },
          ]}
          className="pb-4"
        />
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center text-neutral-500 font-medium text-sm ${
              isControlsDisabled && 'opacity-50 pointer-events-none'
            }`}
          >
            Quick filters:
            <div className="relative">
              <InfiniteSearch
                title="Department"
                control={control}
                options={
                  departmentData?.map((department: IDepartmentAPI) => ({
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
                    ...Object.keys(departments).filter(
                      (key: string) => !!departments[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedDepartments([]);
                  if (departments) {
                    Object.keys(departments).forEach((key: string) =>
                      setValue(`departments.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedDepartments.length}
                dataTestId={`departmentfilter`}
              />
            </div>
            <div className="relative">
              <InfiniteSearch
                title="Location"
                control={control}
                options={
                  locationData?.map((location: ILocationAPI) => ({
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
                    ...Object.keys(locations).filter(
                      (key: string) => !!locations[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedLocations([]);
                  if (locations) {
                    Object.keys(locations).forEach((key: string) =>
                      setValue(`locations.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedLocations.length}
                dataTestId={`locationfilter`}
              />
            </div>
            {showJobTitleFilter && (
              <div className="relative">
                <InfiniteSearch
                  title="Job Title"
                  control={control}
                  options={
                    designationData?.map((designation: IDesignationAPI) => ({
                      label: designation.name,
                      value: designation,
                      id: designation.id,
                    })) || []
                  }
                  searchName={'designationSearch'}
                  optionsName={'designations'}
                  isLoading={designationLoading}
                  isFetchingNextPage={isFetchingNextDesignationPage}
                  fetchNextPage={fetchNextDesignationPage}
                  hasNextPage={hasNextDesignationPage}
                  onApply={() =>
                    setSelectedDesignations([
                      ...Object.keys(designations).filter(
                        (key: string) => !!designations[key],
                      ),
                    ])
                  }
                  onReset={() => {
                    setSelectedDesignations([]);
                    if (designations) {
                      Object.keys(designations).forEach((key: string) =>
                        setValue(`designations.${key}`, false),
                      );
                    }
                  }}
                  selectionCount={selectedDesignations.length}
                  dataTestId={`jobTitlefilter`}
                />
              </div>
            )}
          </div>
          <div
            className={`cursor-pointer text-neutral-500 text-sm font-medium hover:underline ${
              isControlsDisabled && 'opacity-50 pointer-events-none'
            }`}
            onClick={() => {
              setSelectedDepartments([]);
              setSelectedLocations([]);
              setSelectedDesignations([]);
              Object.keys(departments || {}).forEach((key: string) =>
                setValue(`departments.${key}`, false),
              );
              Object.keys(locations || {}).forEach((key: string) =>
                setValue(`locations.${key}`, false),
              );
              Object.keys(designations || {}).forEach((key: string) =>
                setValue(`designations.${key}`, false),
              );
            }}
            data-testid={`select-${dataTestId}-clearfilter`}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div
          className={`flex justify-between py-4 pr-6 ${
            isControlsDisabled && 'opacity-50 pointer-events-none'
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
                  dataTestId: `select-${dataTestId}-selectall`,
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: `Show selected members (${
                    Object.keys(users).filter((key: string) => !!users[key])
                      .length
                  })`,
                  className: 'flex item-center',
                  dataTestId: `select-${dataTestId}-showselected`,
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
            data-testid={`select-${dataTestId}-clearall`}
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
            usersData?.map((user:any, index:any) => (
              <div
                key={user.id}
                className={`${
                  user[disableKey || ''] && 'opacity-50 pointer-events-none'
                }`}
              >
                <div className="py-2 flex items-center">
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `users.${user.id}`,
                        control,
                        className: 'flex item-center mr-4',
                        transform: {
                          input: (value: IGetUser | boolean) => {
                            updateSelectAll();
                            return !!value;
                          },
                          output: (e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) return user;
                            return false;
                          },
                        },
                        defaultChecked: selectedMemberIds.includes(user.id),
                      },
                    ]}
                  />
                  {(entityRenderer && entityRenderer(user)) || (
                    <UserRow user={user} />
                  )}
                </div>
                {index !== usersData.length - 1 && <Divider />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center w-full justify-center">
              <div className="mt-8 mb-4">
                <img src={require('images/noResult.png')} />
              </div>
              <div className="text-neutral-900 text-lg font-bold mb-4">
                No result found
                {!!memberSearch && ` for ‘${memberSearch}’`}
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
