import Avatar from 'components/Avatar';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import FilterMenu from 'components/FilterMenu';
import Icon from 'components/Icon';
import InfiniteSearch from 'components/InfiniteSearch';
import useModal from 'hooks/useModal';
import { userData } from 'mocks/Channels';
import PeopleCard from 'pages/Users/components/People/PeopleCard';
import UsersSkeleton from 'pages/Users/components/Skeletons/UsersSkeleton';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getFullName, getProfileImage, isFiltersEmpty } from 'utils/misc';
import { useEffect, useState } from 'react';
import { useInfiniteChannelMembers } from 'queries/channel';
import { IDepartmentAPI, useInfiniteDepartments } from 'queries/department';
import { useDebounce } from 'hooks/useDebounce';
import { ILocationAPI, useInfiniteLocations } from 'queries/location';
import useURLParams from 'hooks/useURLParams';
import PopupMenu from 'components/PopupMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import MemberTable from './MemberTable';
import useRole from 'hooks/useRole';

const Members = () => {
  const { t } = useTranslation('channels');
  const { filters, setFilters, clearFilters, updateFilter } =
    useAppliedFiltersStore();
  const [isGrid, setGrid] = useState(true);
  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });
  const { control } = filterForm;
  const { searchParams } = useURLParams();
  const parsedTab = searchParams.get('type');
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);

  const { data, isLoading } = useInfiniteChannelMembers(
    isFiltersEmpty({
      role: filters?.type,
      departments: 'departmentDebounced',
      locations: 'locationDebounced',
      // rest payload
    }),
    'teamId_424242424242424242424242424242424',
  );

  const channelMembers = data?.pages; // need to fix data

  const departmentSearch = ''; // add the same debounced value of filters .
  const debouncedDepartmentSearchValue = useDebounce(
    departmentSearch || '',
    500,
  );
  // quick filters api call ..
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

  const locationSearch = ''; // add the same debounced value  of filters .
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

  // quick Filters options
  const { isAdmin } = useRole();
  const requestOptions = [
    {
      label: 'All members ',
      labelClassName: 'text-xs font-medium',
      stroke: 'text-neutral-900',
      onClick: () => {
        updateFilter('type', 'All_Members');
        setGrid(true);
      },
    },
    isAdmin && {
      label: 'Requests',
      labelClassName: 'text-xs font-medium',
      stroke: 'text-neutral-900',
      onClick: () => {
        updateFilter('type', 'requests');
        setGrid(false);
      },
    },
  ].filter(Boolean); // request options only for admin

  const selectAllEntity = () => {
    // channelMembers?.forEach((user: any) => setValue(`users.${user.id}`, user));
  };

  const deselectAll = () => {
    // Object.keys(users || {}).forEach((key) => {
    //   setValue(`users.${key}`, false);
    // });
  };

  useEffect(() => {
    setFilters({
      type: searchParams.get('type') || 'All_Members',
    });
    if (parsedTab !== 'All_Members') {
      setGrid(false);
    } else {
      setGrid(true);
    }
    return () => clearFilters();
  }, [parsedTab]);
  return (
    <>
      <Card className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-neutral-900">
            {t('members.title')}
          </p>
          <Button
            label={t('members.addMemberCTA')}
            leftIcon="add"
            leftIconClassName="text-white pointer-events-none group-hover:text-white"
            onClick={() => openAddMemberModal()}
          />
        </div>
        <FilterMenu
          filterForm={filterForm}
          searchPlaceholder={t('searchChannels')}
          dataTestIdFilter="channel-filter-icon"
          dataTestIdSort="channel-sort-icon"
          dataTestIdSearch="channel-search"
        >
          <div className="flex items-center gap-2">
            <div className="text-neutral-500">
              Showing {channelMembers?.length} results
              {/*  {!isLoading && data?.pages[0]?.data?.result?.totalCount}{' '} */}
            </div>
            <div className="relative">
              {isAdmin ? (
                <PopupMenu
                  triggerNode={
                    <Button
                      active={filters?.type}
                      variant={Variant.Secondary}
                      label={
                        filters?.type == 'All_Members'
                          ? 'All members'
                          : 'Requests'
                      }
                      rightIcon={'arrowDown'}
                    />
                  }
                  menuItems={requestOptions as any}
                  className=" w-full "
                />
              ) : (
                <Button
                  active={filters?.type}
                  variant={Variant.Secondary}
                  label={'All members'}
                /> // for end user its a button
              )}
            </div>
            <div className="relative">
              <InfiniteSearch
                triggerNodeClassName={'!py-2 !px-4'}
                title="Departments"
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
                onApply={() => {}}
                onReset={() => {}}
                // selectionCount={selectedDepartments.length}
              />
            </div>
            <div className="relative">
              <InfiniteSearch
                triggerNodeClassName={'!py-2 !px-4'}
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
                  // ...Object.keys(locations).filter(
                  //   (key: string) => !!locations[key],
                  // ),
                  {}
                }
                onReset={() => {
                  // if (locations) {
                  //   Object.keys(locations).forEach((key: string) =>
                  //     setValue(`locations.${key}`, false),
                  //   );
                  // }
                }}
                // selectionCount={selectedLocations.length} // will use the filter location global location state
              />
            </div>
          </div>
        </FilterMenu>
        {isGrid ? (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {isLoading
              ? [...Array(10)].map((element) => (
                  <div key={element}>
                    <UsersSkeleton />
                  </div>
                ))
              : null}
            {userData.map((user) => (
              <PeopleCard key={user.id} userData={user} />
            ))}
          </div>
        ) : (
          <MemberTable
            data={userData}
            selectAllEntity={selectAllEntity}
            deselectAll={deselectAll}
          />
        )}
      </Card>
      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          entityType={EntitySearchModalType.Channel}
          dataTestId="add-members"
          entityRenderer={(data: any) => {
            return (
              <div className="flex items-center space-x-4 w-full">
                <Avatar
                  name={getFullName(data) || 'U'}
                  size={32}
                  image={getProfileImage(data)}
                  dataTestId="member-profile-pic"
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div
                        className="text-sm font-bold text-neutral-900 whitespace-nowrap line-clamp-1"
                        data-testid="member-name"
                      >
                        {getFullName(data)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="text-xs font-normal text-neutral-500"
                        data-testid="member-email"
                      >
                        {data?.primaryEmail}
                      </div>
                      {data?.department && data?.workLocation?.name && (
                        <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                      )}
                      {data?.department?.name && (
                        <div className="flex space-x-1 items-start">
                          <Icon name="briefcase" size={16} />
                          <div
                            className="text-xs  font-normal text-neutral-500"
                            data-testid="member-department"
                          >
                            {data?.department.name?.substring(0, 22)}
                          </div>
                        </div>
                      )}

                      {data?.isPresent && (
                        <div className="text-xs font-semibold text-neutral-500">
                          Already a member
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          onSubmit={() => {}}
          disableKey="isPresent"
          title="Add  members @DummyChannel"
          submitButtonText="Enroll members"
          onCancel={closeAddMemberModal}
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};

export default Members;
