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
import PageLoader from 'components/PageLoader';
import { Size as InputSize } from 'components/Input';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Variant } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import UsersSkeleton from '../Skeletons/UsersSkeleton';
import { isFiltersEmpty, titleCase } from 'utils/misc';

import PeopleCard from './PeopleCard';
import InviteUserModal from '../InviteUserModal';
import { EntitySearchModalType } from 'components/EntitySearchModal';
import Sort from 'components/Sort';
import FilterModal, { IAppliedFilters, IStatus } from 'components/FilterModal';
import useURLParams from 'hooks/useURLParams';
import NoDataFound from 'components/NoDataFound';
import useRole from 'hooks/useRole';
import Icon from 'components/Icon';
import { IDepartmentAPI, ILocationAPI, UserRole } from 'interfaces';
import ImportUsers from '../ImportUsers';
import { FilterKey } from 'components/FilterMenu';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IPeopleProps {
  showModal: boolean;
  showImport?: boolean;
  openModal: () => void;
  closeModal: () => void;
  closeImport?: () => any;
  isTeamPeople?: boolean;
  teamId?: string;
}

interface IRole {
  value: UserRole;
  label: string;
}

interface IForm {
  search?: string;
  role?: IRole | null;
}

const defaultFilters: IAppliedFilters = {
  status: [],
  departments: [],
  locations: [],
};

const People: FC<IPeopleProps> = ({
  showModal,
  showImport = false,
  openModal,
  closeModal,
  closeImport,
  isTeamPeople,
  teamId,
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'people' });
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
    ...defaultFilters,
  });
  const [filterSortBy, setFilterSortBy] = useState<string>('');
  const { ref, inView } = useInView();
  const { isAdmin } = useRole();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();

  const parsedRole = parseParams('role');

  const {
    control,
    watch,
    getValues,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      role: parsedRole,
      search: searchParams.get('peopleSearch') || '',
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
  const useInfiniteUsers = getApi(ApiEnum.GetUsers);
  const getPeoplesData = () => {
    return useInfiniteUsers({
      startFetching,
      q: isFiltersEmpty({
        status: appliedFilters.status?.length
          ? appliedFilters?.status?.map((eachStatus) => eachStatus.id).join(',')
          : undefined,
        departments: appliedFilters.departments?.length
          ? appliedFilters.departments
              ?.map((eachDepartment) => eachDepartment.id)
              .join(',')
          : undefined,
        locations: appliedFilters.locations?.length
          ? appliedFilters.locations
              ?.map((eachLocation) => eachLocation.id)
              .join(',')
          : undefined,
        role: role?.value,
        sort: filterSortBy,
        q: debouncedSearchValue,
      }),
    });
  };

  const useInfiniteTeamMembers = getApi(ApiEnum.GetTeamMembers);
  const getTeamMembersData = () => {
    return useInfiniteTeamMembers({
      startFetching,
      teamId: teamId || '',
      q: isFiltersEmpty({
        status: appliedFilters.status?.length
          ? appliedFilters?.status?.map((eachStatus) => eachStatus.id).join(',')
          : undefined,
        departments: appliedFilters.departments?.length
          ? appliedFilters.departments
              ?.map((eachDepartment) => eachDepartment.id)
              .join(',')
          : undefined,
        locations: appliedFilters.locations?.length
          ? appliedFilters.locations
              ?.map((eachLocation) => eachLocation.id)
              .join(',')
          : undefined,
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
    if (roleSelectRef && roleSelectRef.current) setValue('role', null);
  };

  const roleFields = [
    {
      type: FieldType.SingleSelect,
      control,
      height: 36,
      name: 'role',
      placeholder: t('rolePlaceholder'),
      size: InputSize.Small,
      dataTestId: 'filterby-role',
      selectClassName: 'single-select-bold',
      ref: roleSelectRef,
      showSearch: false,
      options: [
        {
          value: UserRole.Admin,
          label: t('roleAdmin'),
          dataTestId: 'filterby-role-admin',
        },
        {
          value: UserRole.Superadmin,
          label: t('roleSuperAdmin'),
          dataTestId: 'filterby-role-superadmin',
        },
        {
          value: UserRole.Member,
          label: t('roleMember'),
          dataTestId: 'filterby-role-member',
        },
      ],
    },
  ];

  const usersData = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((user: any) => user);
  });

  const clearFilters = () => {
    deleteParam('status');
    deleteParam('departments');
    deleteParam('locations');
    setAppliedFilters({
      ...appliedFilters,
      status: [],
      departments: [],
      locations: [],
    });
  };

  const handleRemoveFilters = (key: FilterKey, id: any) => {
    const updatedFilter = appliedFilters[key]!.filter(
      (item: any) => item.id !== id,
    );
    const serializedFilters = serializeFilter(updatedFilter);
    if (updatedFilter.length === 0) {
      deleteParam(key);
    } else {
      updateParam(key, serializedFilters);
    }
    setAppliedFilters({ ...appliedFilters, [key]: updatedFilter });
  };

  const onApplyFilter = (appliedFilters: IAppliedFilters) => {
    setAppliedFilters(appliedFilters);
    if (appliedFilters.status?.length) {
      const serializedStatus = serializeFilter(appliedFilters.status);
      updateParam('status', serializedStatus);
    } else deleteParam('status');
    if (appliedFilters.locations?.length) {
      const serializedLocations = serializeFilter(appliedFilters.locations);
      updateParam('locations', serializedLocations);
    } else deleteParam('locations');
    if (appliedFilters.departments?.length) {
      const serializedDepartments = serializeFilter(appliedFilters.departments);
      updateParam('departments', serializedDepartments);
    } else deleteParam('departments');
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
    const parsedDepartments = parseParams('departments');
    const parsedLocations = parseParams('locations');
    const parsedSort = parseParams('sort');
    onApplyFilter({
      ...defaultFilters,
      ...(parsedStatus && {
        status: parsedStatus.map((eachStatus: IStatus) => ({
          id: eachStatus.id,
          name: titleCase(eachStatus.name),
        })),
      }),
      ...(parsedDepartments && {
        departments: parsedDepartments.map(
          (eachDepartment: IDepartmentAPI) => ({
            id: eachDepartment.id,
            name: titleCase(eachDepartment.name),
          }),
        ),
      }),
      ...(parsedLocations && {
        locations: parsedLocations.map((eachLocation: ILocationAPI) => ({
          id: eachLocation.id,
          name: titleCase(eachLocation.name),
        })),
      }),
    });
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
        label: role.label,
        value: role.value,
      });
      updateParam('role', serializedRole);
    } else deleteParam('role');
  }, [role]);

  const showGrid = isLoading || usersData?.length;
  const isDataFiltered =
    debouncedSearchValue ||
    role?.value ||
    appliedFilters.status?.length ||
    appliedFilters.departments?.length ||
    appliedFilters.locations?.length;
  const showNoMembers = isTeamPeople && !showGrid && !isDataFiltered;
  const showNoDataFound = !showGrid && !showNoMembers;

  const ShowResultCount = () => {
    return (
      <div className="text-neutral-500" role="contentinfo" tabIndex={0}>
        {t('showingResults', {
          count: !isLoading && data?.pages[0]?.data?.result?.totalCount,
        })}
      </div>
    );
  };

  return (
    <div className="relative pb-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {!isTeamPeople && (
              <Button
                label={t('allMembers')}
                size={Size.Small}
                variant={Variant.Secondary}
                className="h-9 grow-0"
                dataTestId="people-view-all-members"
                onClick={() => customReset()}
                active={!searchValue && !role}
              />
            )}
            {!isLxp ? <Layout fields={roleFields} /> : <ShowResultCount />}
          </div>
          <div className="flex space-x-2 justify-center items-center">
            {!isLxp ? (
              <IconButton
                onClick={openFilterModal}
                icon="filterLinear"
                variant={IconVariant.Secondary}
                size={IconSize.Medium}
                borderAround
                className="bg-white !p-[10px]"
                dataTestId="people-filter"
              />
            ) : null}
            <Sort
              controlled
              setFilter={handleSetSortFilter}
              filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
              selectedValue={filterSortBy}
              filterValue={{ asc: 'ASC', desc: 'DESC' }}
              entity={isTeamPeople ? EntitySearchModalType.Team : 'USER'}
              dataTestId="people-sort"
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
                    placeholder: t('searchMembersPlaceholder'),
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

        {!isLxp && <ShowResultCount />}
        {appliedFilters?.status?.length ||
        appliedFilters?.departments?.length ||
        appliedFilters?.locations?.length ? (
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <div className="text-base text-neutral-500 whitespace-nowrap">
                {t('filterBy')}
              </div>
              {appliedFilters?.status?.map((status: IStatus) => (
                <div
                  key={status.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`teams-filterby`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.status, status.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {t('status')}{' '}
                    <span className="text-primary-500">{status.name}</span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.status, status.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
              {appliedFilters?.departments?.map(
                (department: IDepartmentAPI) => (
                  <div
                    key={department.id}
                    className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                    data-testid={`teams-filterby`}
                    onClick={() =>
                      handleRemoveFilters(FilterKey.departments, department.id)
                    }
                  >
                    <div className="mr-1 text-neutral-500 whitespace-nowrap">
                      {t('department')}{' '}
                      <span className="text-primary-500">
                        {department.name}
                      </span>
                    </div>
                    <Icon
                      name="close"
                      size={16}
                      color="text-neutral-900"
                      className="cursor-pointer"
                      onClick={() =>
                        handleRemoveFilters(
                          FilterKey.departments,
                          department.id,
                        )
                      }
                      dataTestId={`applied-filter-close`}
                    />
                  </div>
                ),
              )}
              {appliedFilters?.locations?.map((location: ILocationAPI) => (
                <div
                  key={location.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`teams-filterby`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.locations, location.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {t('location')}{' '}
                    <span className="text-primary-500">{location.name}</span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.locations, location.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
            </div>
            <div
              className="text-neutral-500 border px-3 py-[3px] whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
              onClick={clearFilters}
              data-testid={`people-clear-filters`}
            >
              {t('clearFilters')}
            </div>
          </div>
        ) : null}

        <div>
          {showGrid ? (
            <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 xl:grid-cols-4 1.5xl:grid-cols-5  ">
              {isLoading
                ? [...Array(30)].map((_value, i) => (
                    <div key={`${i}-user-card-skeleton`}>
                      <UsersSkeleton />
                    </div>
                  ))
                : null}

              {usersData?.length ? (
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
                              createdAt: user.createdAt,
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
              ) : null}
            </div>
          ) : null}

          {showNoMembers ? (
            <div className="flex flex-col w-full items-center space-y-4">
              <img
                src={MemberNotFound}
                width={220}
                height={144}
                alt={t('noMemberFoundAlt')}
              />
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center flex-col space-y-1">
                  <div
                    className="text-lg font-bold text-neutral-900"
                    data-testid="teams-no-members-yet"
                  >
                    {t('noMembersYet')}
                  </div>
                  {isAdmin && !isLxp ? (
                    <div className="text-base font-medium text-neutral-500">
                      {t('letsGetStarted')}
                    </div>
                  ) : null}
                </div>
              </div>
              {isAdmin && !isLxp ? (
                <Button
                  label={t('addMembers')}
                  variant={Variant.Secondary}
                  className="space-x-1 rounded-[24px]"
                  size={Size.Large}
                  dataTestId="team-add-members-cta"
                  leftIcon={'addCircle'}
                  leftIconClassName="text-neutral-900"
                  leftIconSize={20}
                  onClick={openModal}
                />
              ) : null}
            </div>
          ) : null}

          {showNoDataFound ? (
            <NoDataFound
              className="py-4 w-full"
              searchString={searchValue}
              illustration="noResultAlt"
              message={
                <p>
                  {t('noResultsMessage')}
                  <br /> {t('noResultsMessage2')}{' '}
                </p>
              }
              clearBtnLabel={searchValue ? t('clearSearch') : t('clearFilters')}
              onClearSearch={() => {
                searchValue && resetField
                  ? resetField('search', { defaultValue: '' })
                  : clearFilters();
              }}
              dataTestId="people"
            />
          ) : null}
        </div>
      </div>

      <InviteUserModal
        open={showModal}
        openModal={openModal}
        closeModal={closeModal}
      />

      {showImport && <ImportUsers open={showImport} closeModal={closeImport} />}

      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={appliedFilters}
          onApply={(filters) => {
            onApplyFilter({ ...appliedFilters, ...filters });
            closeFilterModal();
          }}
          onClear={() => {
            clearFilters();
            closeFilterModal();
          }}
        />
      )}
    </div>
  );
};

export default People;
