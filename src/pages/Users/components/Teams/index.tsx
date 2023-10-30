import { FC, useEffect, useState } from 'react';
import TeamsCard from './TeamsCard';
import Button, { Size, Variant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import { Variant as InputVariant, Size as InputSize } from 'components/Input';
import useModal from 'hooks/useModal';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'hooks/useDebounce';
import TeamModal from '../TeamModal';
import { useInfiniteTeams } from 'queries/teams';
import { getProfileImage, isFiltersEmpty, twConfig } from 'utils/misc';
import PageLoader from 'components/PageLoader';
import TeamNotFound from 'images/TeamNotFound.svg';
import TeamsSkeleton from '../Skeletons/TeamsSkeleton';
import Skeleton from 'react-loading-skeleton';
import Sort from 'components/Sort';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import { IGetUser } from 'queries/users';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import FilterModal, {
  FilterModalVariant,
  IAppliedFilters,
} from 'components/FilterModal';
import { ICategory } from 'queries/category';
import { addTeamMember } from 'queries/teams';

import useAuth from 'hooks/useAuth';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import { useMutation } from '@tanstack/react-query';
import useURLParams from 'hooks/useURLParams';
import useRole from 'hooks/useRole';
import queryClient from 'utils/queryClient';
import NoDataFound from 'components/NoDataFound';
interface IForm {
  search?: string;
}

export enum TeamFlow {
  CreateTeam = 'CREATE_TEAM',
  EditTeam = 'EDIT_TEAM',
}

export enum TeamTab {
  MyTeams = 'myTeams',
  AllTeams = 'allTeams',
}

export interface ITeamCategory {
  name: string;
  categoryId: string;
}

export interface ITeamDetails {
  id: string;
  name: string;
  category: ITeamCategory;
  createdAt: string;
  totalMembers: number;
  description: string;
}

export interface ITeamProps {
  // show add team modal
  showTeamModal: boolean;
  openTeamModal: () => void;
  closeTeamModal: () => void;
}

const Team: FC<ITeamProps> = ({
  showTeamModal,
  openTeamModal,
  closeTeamModal,
}) => {
  const {
    searchParams,
    updateParam,
    deleteParam,
    serializeFilter,
    parseParams,
  } = useURLParams();

  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [teamFlow, setTeamFlow] = useState<TeamFlow>(TeamFlow.CreateTeam); // to context
  const [showTeamDetail, setShowTeamDetail] = useState<Record<
    string,
    any
  > | null>({});
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [tab, setTab] = useState<TeamTab | string>(
    searchParams.get('tab') || (isAdmin ? TeamTab.AllTeams : TeamTab.MyTeams),
  );
  const [startFetching, setStartFetching] = useState(false);
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [appliedFilters, setAppliedFilters] = useState<IAppliedFilters>({
    categories: [],
  });

  const { ref, inView } = useInView();

  const {
    control,
    watch,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      search: searchParams.get('teamSearch'),
    },
  });

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams({
      startFetching,
      q: isFiltersEmpty({
        q: debouncedSearchValue,
        sort: sortByFilter,
        userId: tab === TeamTab.MyTeams ? user?.id : undefined,
        categoryIds:
          appliedFilters.categories && appliedFilters.categories.length > 0
            ? appliedFilters?.categories
                ?.map((category: ICategory) => category?.id)
                .join(',')
            : undefined,
      }),
    });

  const teamId = showTeamDetail?.id;

  const addTeamMemberMutation = useMutation({
    mutationKey: ['add-team-member', teamId],
    mutationFn: (payload: any) => {
      return addTeamMember(teamId || '', payload);
    },
    onError: () => {
      toast(
        <FailureToast
          content={`Error Adding Team Members`}
          dataTestId="team-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onSuccess: (data: any) => {
      const membersAddedCount =
        data?.result?.data?.length - (data.teamMembers || 0);
      const message =
        membersAddedCount > 1
          ? `${membersAddedCount} members have been added to the team`
          : membersAddedCount === 1
          ? `${membersAddedCount} member has been added to the team`
          : 'Members already exists in the team';
      toast(<SuccessToast content={message} />, {
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
      queryClient.invalidateQueries(['team-members']);
      queryClient.invalidateQueries(['team', teamId]);
      queryClient.invalidateQueries(['teams'], { exact: false });
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const teamsData = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((team: any) => {
      try {
        return team;
      } catch (e) {
        console.log('Error', { team });
      }
    });
  });

  const handleRemoveFilters = (key: string, id: any) => {
    const updatedFilter = (appliedFilters as any)[
      key as keyof IAppliedFilters
    ]!.filter((item: any) => item.id !== id);
    const serializedFilters = serializeFilter(updatedFilter);
    if (updatedFilter.length === 0) {
      deleteParam(key);
    } else {
      updateParam(key, serializedFilters);
    }
    setAppliedFilters({ ...appliedFilters, [key]: updatedFilter });
  };

  const onApplyFilter = (appliedFilters: IAppliedFilters) => {
    console.log;
    setAppliedFilters(appliedFilters);
    const serializedCategories = serializeFilter(appliedFilters.categories);
    updateParam('categories', serializedCategories);
    closeFilterModal();
  };

  const handleSetSortFilter = (sortValue: any) => {
    setSortByFilter(sortValue);
    if (sortValue) {
      const serializedSort = serializeFilter(sortValue);
      updateParam('sort', serializedSort);
    } else {
      deleteParam('sort');
    }
  };

  const clearFilters = () => {
    deleteParam('categories');
    setAppliedFilters({
      ...appliedFilters,
      categories: [],
    });
  };

  // parse the persisted filters from the URL on page load
  useEffect(() => {
    const parsedCategories = parseParams('categories');
    const parsedSort = parseParams('sort');
    if (parsedCategories) {
      setAppliedFilters({
        ...appliedFilters,
        categories: parsedCategories,
      });
    }
    if (parsedSort) {
      setSortByFilter(parsedSort);
    }
    setStartFetching(true);
  }, []);

  // Change URL params for search filters
  useEffect(() => {
    if (debouncedSearchValue) {
      updateParam('teamSearch', debouncedSearchValue);
    } else {
      deleteParam('teamSearch');
    }
  }, [debouncedSearchValue]);

  const showGrid = isLoading || teamsData?.length;
  const isDataFiltered =
    debouncedSearchValue || appliedFilters?.categories?.length;
  const showNoTeams = !showGrid && !isDataFiltered;
  const showNoDataFound = !showGrid && !showNoTeams;

  return (
    <div className="relative pb-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            label="My Teams"
            size={Size.Small}
            variant={Variant.Secondary}
            className={`h-9 grow-0 ${!isAdmin && 'pointer-events-none'}`}
            dataTestId="my-teams"
            active={tab === TeamTab.MyTeams && !searchValue}
            onClick={() => {
              updateParam('tab', TeamTab.MyTeams);
              setTab(TeamTab.MyTeams);
            }}
          />
          {isAdmin && (
            <Button
              label="All Teams"
              size={Size.Small}
              variant={Variant.Secondary}
              className="h-9 grow-0"
              dataTestId="all-teams"
              active={tab === TeamTab.AllTeams && !searchValue}
              onClick={() => {
                updateParam('tab', TeamTab.AllTeams);
                setTab(TeamTab.AllTeams);
              }}
            />
          )}
        </div>
        <div className="flex space-x-2 justify-center items-center">
          <IconButton
            icon="filterLinear"
            onClick={openFilterModal}
            variant={IconVariant.Secondary}
            size={IconSize.Medium}
            borderAround
            className="bg-white !p-[10px]"
            dataTestId="teams-filter"
          />
          <Sort
            setFilter={handleSetSortFilter}
            filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
            selectedValue={sortByFilter}
            filterValue={{ asc: 'ASC', desc: 'DESC' }}
            dataTestId="teams-sort"
            entity="TEAM"
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
                  placeholder: 'Search teams',
                  error: errors.search?.message,
                  dataTestId: 'teams-search',
                  inputClassName: 'py-[7px] !text-sm !h-9',
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {!isLoading ? (
        <div className="text-neutral-500 mt-6 mb-6">
          Showing {!isLoading && data?.pages[0]?.data?.result?.totalCount}{' '}
          results
        </div>
      ) : (
        <Skeleton
          className="!w-32 mt-6 mb-6"
          containerClassName="flex-1"
          borderRadius={100}
        />
      )}

      {/* CATEGORY FILTER */}

      {appliedFilters?.categories?.length ? (
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <div className="text-base text-neutral-500 whitespace-nowrap">
              Filter By
            </div>
            {appliedFilters?.categories?.map((category: ICategory) => (
              <div
                key={category.id}
                className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                data-testid={`teams-filterby`}
                onClick={() => handleRemoveFilters('categories', category.id)}
              >
                <div className="mr-1 text-neutral-500 whitespace-nowrap">
                  Category{' '}
                  <span className="text-primary-500">{category.name}</span>
                </div>
                <Icon
                  name="close"
                  size={16}
                  color="text-neutral-900"
                  className="cursor-pointer"
                  onClick={() => handleRemoveFilters('categories', category.id)}
                  dataTestId={`applied-filter-close`}
                />
              </div>
            ))}
          </div>
          <div
            className="text-neutral-500 border px-3 py-[3px] whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
            onClick={clearFilters}
            data-testid={`teams-clear-filters`}
          >
            Clear Filters
          </div>
        </div>
      ) : null}

      <div>
        {showGrid ? (
          <div className="grid grid-cols-6 gap-6 justify-items-center lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {isLoading
              ? [...Array(30)].map((element) => (
                  <div key={element}>
                    <TeamsSkeleton />
                  </div>
                ))
              : null}
            {teamsData?.length ? (
              <>
                {teamsData?.map((team: any) => (
                  <TeamsCard
                    key={team.id}
                    setTeamFlow={setTeamFlow}
                    openModal={openTeamModal}
                    setShowTeamDetail={setShowTeamDetail}
                    {...team}
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
        {showNoTeams ? (
          <div className="flex flex-col space-y-3 items-center w-full">
            <div className="flex flex-col space-y-6 items-center">
              <img
                src={TeamNotFound}
                alt="Team Not Found"
                height={140}
                width={162}
              />
              <div className="text-lg font-bold" data-testid="no-teams-found">
                No teams found
              </div>
            </div>
            <div className="flex space-x-1 text-xs font-normal">
              {isAdmin && tab === TeamTab.AllTeams ? (
                <>
                  <div className="text-neutral-500">
                    There are no teams found in your organization right now. Be
                    the first to
                  </div>
                  <div
                    className="text-blue-500 cursor-pointer font-bold"
                    onClick={() => openTeamModal()}
                    data-testid="create-one-team"
                  >
                    create one
                  </div>
                </>
              ) : (
                <div className="text-neutral-500">
                  You are not a part of any team. Join a team now
                </div>
              )}
            </div>
          </div>
        ) : null}
        {showNoDataFound ? (
          <NoDataFound
            className="py-4 w-full"
            searchString={searchValue}
            message={
              <p>
                Sorry we can&apos;t find the team you are looking for.
                <br /> Please try using different filters.
              </p>
            }
            onClearSearch={() => {
              resetField('search', { defaultValue: '' });
            }}
            dataTestId="team"
          />
        ) : null}
      </div>

      {showTeamModal && (
        <TeamModal
          open={showTeamModal}
          closeModal={closeTeamModal}
          teamFlowMode={teamFlow}
          setTeamFlow={setTeamFlow}
          team={teamFlow === TeamFlow.EditTeam ? showTeamDetail : undefined}
          openAddMemberModal={openAddMemberModal}
          setShowTeamDetail={setShowTeamDetail}
        />
      )}

      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          onBackPress={openTeamModal}
          entityType={EntitySearchModalType.User}
          dataTestId="add-members"
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full">
                <Avatar
                  name={data?.fullName || 'U'}
                  size={32}
                  image={getProfileImage(data)}
                  dataTestId="member-profile-pic"
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div
                        className="text-sm font-bold text-neutral-900"
                        data-testid="member-name"
                      >
                        {data?.fullName}
                      </div>
                      <div className="flex space-x-[14px] items-center">
                        {data?.department?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="briefcase" size={16} />
                            <div
                              className="text-xs font-normal text-neutral-500"
                              data-testid="member-department"
                            >
                              {data?.department?.name}
                            </div>
                          </div>
                        )}
                        {data?.department && data?.workLocation?.name && (
                          <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                        )}
                        {data?.workLocation?.name && (
                          <div className="flex space-x-1 items-start">
                            <Icon name="location" size={16} />
                            <div
                              className="text-xs font-normal text-neutral-500"
                              data-testid="member-location"
                            >
                              {data?.workLocation.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className="text-xs font-normal text-neutral-500"
                      data-testid="member-email"
                    >
                      {data?.primaryEmail}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          onSubmit={(userIds: string[]) => {
            addTeamMemberMutation.mutate({ userIds: userIds });
            closeAddMemberModal();
          }}
          onCancel={closeAddMemberModal}
          title="Add team members"
          submitButtonText="Add Members"
        />
      )}

      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={appliedFilters}
          variant={FilterModalVariant.Team}
          onApply={onApplyFilter}
          onClear={() => {
            deleteParam('categories');
            setAppliedFilters({ ...appliedFilters, categories: [] });
            closeFilterModal();
          }}
        />
      )}
    </div>
  );
};

export default Team;
