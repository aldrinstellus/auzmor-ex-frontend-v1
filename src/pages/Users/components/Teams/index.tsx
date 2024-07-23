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
import { isFiltersEmpty } from 'utils/misc';
import PageLoader from 'components/PageLoader';
import TeamNotFound from 'images/TeamNotFound.svg';
import TeamsSkeleton from '../Skeletons/TeamsSkeleton';
import Skeleton from 'react-loading-skeleton';
import Sort from 'components/Sort';
import Icon from 'components/Icon';
import FilterModal, {
  FilterModalVariant,
  IAppliedFilters,
} from 'components/FilterModal';
import { ICategory } from 'queries/category';

import useAuth from 'hooks/useAuth';
import useURLParams from 'hooks/useURLParams';
import useRole from 'hooks/useRole';
import NoDataFound from 'components/NoDataFound';
import useProduct from 'hooks/useProduct';
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

export const ShowingCount: FC<{
  isLoading: boolean;
  count: number;
  className?: string;
}> = ({ isLoading, count, className = '' }) => {
  return (
    <div
      className={className}
      tabIndex={0}
      role="contentinfo"
      title={`Showing ${count} results`}
    >
      {!isLoading ? (
        <p className="text-neutral-500">Showing {count} results</p>
      ) : (
        <Skeleton
          className="!w-32"
          containerClassName="flex-1"
          borderRadius={100}
        />
      )}
    </div>
  );
};

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
  const { isLxp } = useProduct();
  const [teamFlow, setTeamFlow] = useState<TeamFlow>(TeamFlow.CreateTeam); // to context
  const [teamDetails, setTeamDetails] = useState<Record<string, any> | null>(
    {},
  );
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [tab, setTab] = useState<TeamTab | string>(
    searchParams.get('tab') ||
      (isAdmin && !isLxp ? TeamTab.AllTeams : TeamTab.MyTeams),
  );
  const [startFetching, setStartFetching] = useState(false);
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
      search: searchParams.get('teamSearch') || '',
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
      <div className="flex items-center justify-between mb-4">
        {isLxp && (
          <ShowingCount
            isLoading={isLoading}
            count={data?.pages[0]?.data?.result?.totalCount}
          />
        )}
        {!isLxp && (
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
        )}
        <div className="flex items-center justify-center space-x-2">
          {!isLxp ? (
            <IconButton
              icon="filterLinear"
              onClick={openFilterModal}
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white !p-[10px]"
              dataTestId="teams-filter"
              ariaLabel="teams-filter"
            />
          ) : null}
          <Sort
            controlled
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

      {!isLxp && (
        <ShowingCount
          isLoading={isLoading}
          count={data?.pages[0]?.data?.result?.totalCount}
          className="mb-4"
        />
      )}

      {/* CATEGORY FILTER */}

      {appliedFilters?.categories?.length ? (
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-wrap items-center space-x-2 gap-y-2">
            <div className="text-base text-neutral-500 whitespace-nowrap">
              Filter By
            </div>
            {appliedFilters?.categories?.map((category: ICategory) => (
              <div
                key={category.id}
                className="flex items-center px-3 py-1 mr-1 text-sm font-medium capitalize bg-white border cursor-pointer border-neutral-200 rounded-7xl hover:text-primary-600 hover:border-primary-600 group"
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
              ? [...Array(30)].map((_value, i) => (
                  <div key={`${i}-teams-skeleton`}>
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
                    setTeamDetails={setTeamDetails}
                    {...team}
                  />
                ))}
                <div className="w-12 h-12">
                  {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                </div>
                {isFetchingNextPage && <PageLoader />}
              </>
            ) : null}
          </div>
        ) : null}
        {showNoTeams ? (
          <div className="flex flex-col items-center w-full space-y-3">
            <div className="flex flex-col items-center space-y-6">
              <img src={TeamNotFound} alt="Team Not Found" width={148} />
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
                    className="font-bold text-blue-500 cursor-pointer"
                    onClick={() => openTeamModal()}
                    data-testid="create-one-team"
                  >
                    create one
                  </div>
                </>
              ) : (
                <div className="text-neutral-500">
                  You&apos;re not part of any team yet
                </div>
              )}
            </div>
          </div>
        ) : null}
        {showNoDataFound ? (
          <NoDataFound
            hideClearBtn={debouncedSearchValue ? false : true}
            className="w-full py-4"
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
          team={teamFlow === TeamFlow.EditTeam ? teamDetails : undefined}
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
