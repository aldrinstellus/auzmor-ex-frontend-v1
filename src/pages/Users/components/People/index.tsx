import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from 'hooks/useDebounce';
import useModal from 'hooks/useModal';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import MemberNotFound from 'images/MemberNotFound.svg';
import Icon from 'components/Icon';
import PageLoader from 'components/PageLoader';
import { Size as InputSize } from 'components/Input';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Variant } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import UsersSkeleton from '../Skeletons/UsersSkeleton';
import { UserRole, useInfiniteUsers } from 'queries/users';
import { isFiltersEmpty, titleCase } from 'utils/misc';

import PeopleCard from './PeopleCard';
import InviteUserModal from '../InviteUserModal';
import { useInfiniteTeamMembers } from 'queries/teams';
import { EntitySearchModalType } from 'components/EntitySearchModal';
import Sort from 'components/Sort';
import FilterModal, {
  IAppliedFilters,
  UserStatus,
} from 'components/FilterModal';
import useURLParams from 'hooks/useURLParams';

export interface IPeopleProps {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  isTeamPeople?: boolean;
  teamId?: string;
}

interface IForm {
  search?: string;
  role?: { value: string; label: string };
}

const People: FC<IPeopleProps> = ({
  showModal,
  openModal,
  closeModal,
  isTeamPeople,
  teamId,
}) => {
  const {
    searchParams,
    updateParam,
    deleteParam,
    serializeFilter,
    parseParams,
  } = useURLParams();
  const [startFetching, setStartFetching] = useState(false);
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [appliedFilters, setAppliedFilters] = useState<IAppliedFilters>({
    status: null,
  });
  const [filterSortBy, setFilterSortBy] = useState<string>('');
  const { ref, inView } = useInView();

  const parsedRole = parseParams('role');

  const {
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      role: parsedRole,
      search: searchParams.get('peopleSearch'),
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const searchValue = watch('search');
  const role = watch('role');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  // get the conditional data
  const getPeoplesData = () => {
    return useInfiniteUsers({
      startFetching,
      q: isFiltersEmpty({
        status:
          appliedFilters.status?.value === UserStatus.All
            ? undefined
            : appliedFilters.status?.value,
        role: role?.value,
        sort: filterSortBy,
        q: debouncedSearchValue,
      }),
    });
  };

  const getTeamMembersData = () => {
    return useInfiniteTeamMembers({
      startFetching,
      teamId: teamId || '',
      q: isFiltersEmpty({
        status:
          appliedFilters.status?.value === UserStatus.All
            ? undefined
            : appliedFilters.status?.value,
        role: role?.value,
        sort: filterSortBy,
        q: debouncedSearchValue,
      }),
    });
  };

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    isTeamPeople && teamId ? getTeamMembersData() : getPeoplesData();

  const roleSelectRef = useRef<any>();

  const customReset = () => {
    if (roleSelectRef && roleSelectRef.current) setValue('role', undefined);
  };

  const roleFields = [
    {
      type: FieldType.SingleSelect,
      control,
      height: 36,
      name: 'role',
      placeholder: 'Role',
      size: InputSize.Small,
      dataTestId: 'filterby-role',
      selectClassName: 'single-select-bold',
      ref: roleSelectRef,
      options: [
        {
          value: UserRole.Admin,
          label: 'Admin',
          dataTestId: 'filterby-role-admin',
        },
        {
          value: UserRole.Superadmin,
          label: 'Super Admin',
          dataTestId: 'filterby-role-superadmin',
        },
        {
          value: UserRole.Member,
          label: 'Member',
          dataTestId: 'filterby-role-member',
        },
      ],
    },
  ];

  const usersData = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return user;
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  const clearFilters = () => {
    deleteParam('status');
    setAppliedFilters({
      status: null,
    });
    closeFilterModal();
  };

  const onApplyFilter = (appliedFilters: IAppliedFilters) => {
    setAppliedFilters(appliedFilters);
    if (appliedFilters.status?.value !== UserStatus.All) {
      const serializedStatus = serializeFilter(appliedFilters.status?.label);
      updateParam('status', serializedStatus);
    }
    closeFilterModal();
  };

  const handleSetSortFilter = (sortValue: any) => {
    setFilterSortBy(sortValue);
    if (sortValue) {
      const serializedSort = serializeFilter(sortValue);
      updateParam('sort', serializedSort);
    } else {
      deleteParam('sort');
    }
  };

  // parse the persisted filters from the URL on page load
  useEffect(() => {
    const parsedStatus = parseParams('status');
    const parsedSort = parseParams('sort');
    if (parsedStatus) {
      setAppliedFilters({
        ...appliedFilters,
        status: { value: parsedStatus, label: titleCase(parsedStatus) },
      });
    }
    if (parsedSort) {
      setFilterSortBy(parsedSort);
    }
    setStartFetching(true);
  }, []);

  // Change URL params for search filters
  useEffect(() => {
    if (debouncedSearchValue) {
      updateParam('peopleSearch', debouncedSearchValue);
    } else {
      deleteParam('peopleSearch');
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (role) {
      const serializedRole = serializeFilter({
        value: role.value,
        label: role.label,
      });
      updateParam('role', serializedRole);
    } else {
      deleteParam('role');
    }
  }, [role]);

  return (
    <div className="relative pb-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {!isTeamPeople && (
              <>
                <Button
                  label="My Teams"
                  size={Size.Small}
                  disabled
                  variant={Variant.Secondary}
                  className="cursor-not-allowed h-9 grow-0"
                  dataTestId="people-view-my-teams"
                />
                <Button
                  label="All Members"
                  size={Size.Small}
                  variant={Variant.Secondary}
                  className="h-9 grow-0"
                  dataTestId="people-view-all-members"
                  onClick={() => customReset()}
                  active={!searchValue && !role}
                />
              </>
            )}
            <Layout fields={roleFields} />
          </div>
          <div className="flex space-x-2 justify-center items-center">
            <IconButton
              onClick={openFilterModal}
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white !p-[10px]"
              dataTestId="people-filter"
            />
            <Sort
              setFilter={handleSetSortFilter}
              filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
              selectedValue={filterSortBy}
              filterValue={{ asc: 'ASC', desc: 'DESC' }}
              entity={isTeamPeople ? EntitySearchModalType.Team : 'USER'}
            />
            <div>
              <Layout
                fields={[
                  {
                    type: FieldType.Input,
                    variant: InputVariant.Text,
                    size: InputSize.Small,
                    leftIcon: 'search',
                    control,
                    getValues,
                    name: 'search',
                    placeholder: 'Search members',
                    error: errors.search?.message,
                    dataTestId: 'people-search-members',
                    inputClassName: 'py-[7px] !text-sm !h-9',
                    isClearable: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="text-neutral-500">
          Showing {!isLoading && data?.pages[0]?.data?.result?.totalCount}{' '}
          results
        </div>

        {appliedFilters.status &&
          appliedFilters.status.value !== UserStatus.All && (
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-base text-neutral-500">Filter By</div>
                <div
                  className="text-neutral-500 border px-3 py-1 rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer flex items-center group"
                  onClick={() => {
                    deleteParam('status');
                    setAppliedFilters({ ...appliedFilters, status: null });
                  }}
                >
                  <div className="mr-1">
                    {titleCase(appliedFilters.status.label)}
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() => {
                      deleteParam('status');
                      setAppliedFilters({ ...appliedFilters, status: null });
                    }}
                    dataTestId={`people-filterby-close-${appliedFilters.status.label}`}
                  />
                </div>
              </div>
              <div
                className="text-neutral-500 border px-3 py-1 rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
                onClick={() => {
                  deleteParam('status');
                  setAppliedFilters({ ...appliedFilters, status: null });
                }}
              >
                Clear Filters
              </div>
            </div>
          )}

        <div className="flex flex-wrap gap-6">
          {(() => {
            if (isLoading) {
              const loaders = [...Array(30)].map((element) => (
                <div key={element}>
                  <UsersSkeleton />
                </div>
              ));
              return loaders;
            }
            if (usersData && usersData?.length > 0) {
              return (
                <>
                  {usersData.map((user: any) => (
                    <PeopleCard
                      key={user.id}
                      teamId={teamId}
                      isTeamPeople={isTeamPeople}
                      teamMemberId={user.id}
                      {...{
                        userData: isTeamPeople
                          ? {
                              ...user.member,
                              id: user.member.userId,
                              workEmail: user.member.email,
                            }
                          : user,
                      }}
                    />
                  ))}
                  <div className="h-12 w-12">
                    {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                  </div>
                  {isFetchingNextPage && <PageLoader />}
                </>
              );
            }
            return isTeamPeople ? (
              <div className="flex flex-col w-full items-center space-y-4">
                <img
                  src={MemberNotFound}
                  width={220}
                  height={144}
                  alt="No Member Found"
                />
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center flex-col space-y-1">
                    <div
                      className="text-lg font-bold text-neutral-900"
                      data-testid="teams-no-members-yet"
                    >
                      No members yet
                    </div>
                    <div className="text-base font-medium text-neutral-500">
                      {"Let's get started by adding some members!"}
                    </div>
                  </div>
                </div>
                <Button
                  label={'Add members'}
                  variant={Variant.Secondary}
                  className="space-x-1 rounded-[24px]"
                  size={Size.Large}
                  dataTestId="team-add-members-cta"
                  leftIcon={'addCircle'}
                  leftIconClassName="text-neutral-900"
                  leftIconSize={20}
                  onClick={openModal}
                />
              </div>
            ) : (
              <div className="py-16 w-full">
                <div className="flex w-full justify-center">
                  <img src={require('images/noResult.png')} />
                </div>
                <div className="text-center">
                  <div
                    className="mt-8 text-lg font-bold"
                    data-testid="no-result-found"
                  >
                    {`No result found`}
                    {!!searchValue && ` for '${searchValue}'`}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Sorry we can&apos;t find the profile you are looking for.
                    <br /> Please check the spelling or try again.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <InviteUserModal
        open={showModal}
        openModal={openModal}
        closeModal={closeModal}
      />

      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={appliedFilters}
          onApply={onApplyFilter}
          onClear={clearFilters}
        />
      )}
    </div>
  );
};

export default People;
