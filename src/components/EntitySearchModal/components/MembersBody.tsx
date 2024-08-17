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
import NoDataFound from 'components/NoDataFound';
import useProduct from 'hooks/useProduct';
import { isFiltersEmpty } from 'utils/misc';

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
  const { isOffice } = useProduct();
  const { user: currentUser } = useAuth();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>(
    [],
  );
  const { form } = useEntitySearchFormStore();
  const { watch, setValue, control, unregister } = form!;
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
      q: isFiltersEmpty({
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
      }),
    });

  let usersData = data?.pages
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
        return !!users?.[user.id];
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

  const { ref, inView } = useInView({
    root: document.getElementById('entity-search-members-body'),
    rootMargin: '20%',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const selectAllEntity = () => {
    usersData?.forEach((user: IGetUser) => setValue(`users.${user.id}`, user));
  };

  const deselectAll = () => {
    Object.keys(users || {}).forEach((key) => {
      setValue(`users.${key}`, false);
    });
  };

  const userKeys = Object.keys(users || {});

  useEffect(() => {
    if (!showSelectedMembers) {
      unregisterUsers();
    }
    updateSelectAll();
  }, [userKeys, usersData, showSelectedMembers]);

  const unregisterUsers = () => {
    userKeys.forEach((key) => {
      if (!usersData?.find((user: IGetUser) => user.id === key) && !users[key])
        unregister(`users.${key}`);
    });
  };

  const selectedMembers = userKeys.map((key) => users[key]).filter(Boolean);
  const selectedCount = selectedMembers.length;

  const updateSelectAll = () => {
    if (
      usersData?.length === 0 ||
      usersData?.some((user: IGetUser) => !users?.[user.id]) ||
      showSelectedMembers
    ) {
      setValue('selectAll', false);
    } else {
      setValue('selectAll', true);
    }
  };

  if (showSelectedMembers) usersData = selectedMembers as IGetUser[];

  usersData?.sort((a: IGetUser, b: IGetUser) => {
    if (a.fullName! > b.fullName!) return 1;
    else if (a.fullName! < b.fullName!) return -1;
    else return 0;
  });

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
              dataTestId: `${dataTestId}-search`,
              inputClassName: 'text-sm py-[9px]',
              autofocus: true,
            },
          ]}
          className={`${isOffice ? 'pb-4' : ''}`}
        />
        {isOffice && (
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
                  dataTestId={`${dataTestId}-filter-department`}
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
                  dataTestId={`${dataTestId}-filter-location`}
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
                    dataTestId={`${dataTestId}-filter-jobtitle`}
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
              data-testid={`${dataTestId}-clearfilter`}
            >
              Clear filters
            </div>
          </div>
        )}
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
                  label: `Show selected members (${selectedCount})`,
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
          id="entity-search-members-body"
          data-testid={`${dataTestId}-list`}
          tabIndex={0}
        >
          {isLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : usersData?.length ? (
            <ul>
              {usersData?.map((user: any, index: any) => (
                <li
                  key={user.id}
                  className={
                    user[disableKey || '']
                      ? 'opacity-50 pointer-events-none'
                      : undefined
                  }
                >
                  <div className="py-2 flex items-center w-full">
                    <Layout
                      fields={[
                        {
                          type: FieldType.Checkbox,
                          name: `users.${user.id}`,
                          control,
                          className: 'flex item-center mr-4 w-full',
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
                          dataTestId: `${dataTestId}-select-${user.id}`,
                          label: (entityRenderer && entityRenderer(user)) || (
                            <UserRow user={user} />
                          ),
                          labelContainerClassName: 'w-full',
                        },
                      ]}
                      className="w-full"
                    />
                  </div>
                  {index !== usersData.length - 1 && <Divider />}
                </li>
              ))}
            </ul>
          ) : (
            <NoDataFound
              className="py-4 w-full"
              searchString={memberSearch}
              message={
                <p>
                  Sorry we can&apos;t find the member you are looking for.
                  <br /> Please check the spelling or try again.
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

export default MembersBody;
