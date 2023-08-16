import React, { useEffect, useState } from 'react';
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
import TeamFilterModal from '../FilterModals/TeamFilterModal';
import AddTeamModal from '../TeamModal';
import { useInfiniteTeams } from 'queries/teams';
import { isFiltersEmpty } from 'utils/misc';
import PageLoader from 'components/PageLoader';
import TeamNotFound from 'images/TeamNotFound.svg';
import TeamsSkeleton from '../Skeletons/TeamsSkeleton';
import Skeleton from 'react-loading-skeleton';
import { ITeamDetailState } from 'pages/Users';
import Sort from 'components/Sort';
interface IForm {
  search?: string;
}

export enum TeamFlow {
  CreateTeam = 'CREATE_TEAM',
  EditTeam = 'EDIT_TEAM',
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
  showTeamModal: boolean;
  openTeamModal: () => void;
  closeTeamModal: () => void;
  showTeamDetail: ITeamDetailState;
  setShowTeamDetail: (detail: ITeamDetailState) => void;
  setTeamFlow: any;
  teamFlow: string;
  showDeleteModal: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  teamId: string;
  setTeamId: (teamId: string) => void;
}

const Team: React.FC<ITeamProps> = ({
  showTeamModal,
  openTeamModal,
  closeTeamModal,
  showTeamDetail,
  setShowTeamDetail,
  setTeamFlow,
  teamFlow,
  showDeleteModal,
  openDeleteModal,
  closeDeleteModal,
  setTeamId,
  teamId,
}) => {
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { ref, inView } = useInView();

  const {
    control,
    watch,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams(
      isFiltersEmpty({
        q: debouncedSearchValue,
        sort: sortByFilter,
      }),
    );

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

  const editSelectedTeam = teamsData?.find((team) => team.id === teamId);

  return (
    <div className="relative pb-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            label="My Teams"
            size={Size.Small}
            variant={Variant.Secondary}
            className="cursor-not-allowed h-9 grow-0"
            dataTestId="my-teams"
            disabled
          />
          <Button
            label="All Teams"
            size={Size.Small}
            variant={Variant.Secondary}
            className="!py-2 grow-0"
            dataTestId="all-teams"
            active={!searchValue}
          />
        </div>
        <div className="flex space-x-2 justify-center items-center">
          <IconButton
            icon="filterLinear"
            onClick={openFilterModal}
            variant={IconVariant.Secondary}
            size={IconSize.Medium}
            borderAround
            className="bg-white"
            dataTestId="teams-filter"
          />
          <Sort
            setFilter={setSortByFilter}
            filterKey="createdAt"
            filterValue={{ asc: 'ASC', desc: 'DESC' }}
            title={
              <div className="bg-blue-50 flex px-6 py-2 font-xs font-medium text-neutral-500">
                Sort by
              </div>
            }
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
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {!isLoading ? (
        <div className="text-neutral-500 mt-6 mb-6">
          Showing{' '}
          {!isLoading && data?.pages[0]?.data?.result?.paging?.totalCount}{' '}
          results
        </div>
      ) : (
        <Skeleton
          className="!w-32 mt-6 mb-6"
          containerClassName="flex-1"
          borderRadius={100}
        />
      )}

      {/* <div className="flex justify-between  mb-6">
    <div className="flex items-center space-x-2">
      <div className="text-base font-medium text-neutral-500">
        Filter by
      </div>
      <div
        className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center space-x-1"
        data-testid={``}
      >
        <div className="text-base font-bold flex space-x-1">
          <div className="text-neutral-500 >Category</div>
          <div className="text-primary-500" data-testid="applied-filterby-category">Something</div>
        </div>
        <Icon
          name="close"
          size={16}
          stroke={twConfig.theme.colors.neutral['900']}
          className="cursor-pointer"
          onClick={() => {}}
          dataTestId={`applied-filter-close`}
        />
      </div>
    </div>
    <div
      className="text-neutral-500 border px-3 py-1 rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
      onClick={() => {}}
      data-testid="teams-clear-filters"
    >
      Clear Filters
    </div>
  </div> */}

      <div className="flex flex-wrap gap-6">
        {(() => {
          if (isLoading) {
            const loaders = [...Array(30)].map((element) => (
              <div key={element}>
                <TeamsSkeleton />
              </div>
            ));
            return loaders;
          }
          if (teamsData && teamsData?.length > 0) {
            return (
              <>
                {teamsData?.map((team: any) => (
                  <TeamsCard
                    key={team.id}
                    setTeamFlow={setTeamFlow}
                    openModal={openTeamModal}
                    setTeamId={setTeamId}
                    setShowTeamDetail={setShowTeamDetail}
                    showDeleteModal={showDeleteModal}
                    openDeleteModal={openDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                    {...team}
                  />
                ))}
                <div className="h-12 w-12">
                  {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                </div>
                {isFetchingNextPage && <PageLoader />}
              </>
            );
          }
          return (
            <>
              {(debouncedSearchValue === undefined ||
                debouncedSearchValue === '') &&
              teamsData?.length === 0 ? (
                <div className="flex flex-col space-y-3 items-center w-full">
                  <div className="flex flex-col space-y-6 items-center">
                    <img
                      src={TeamNotFound}
                      alt="Team Not Found"
                      height={140}
                      width={165}
                    />
                    <div
                      className="text-lg font-bold"
                      data-testid="no-teams-found"
                    >
                      No teams found
                    </div>
                  </div>
                  <div className="flex space-x-1 text-xs font-normal">
                    <div className="text-neutral-500">
                      There are no teams found in your organization right now.
                      Be the first to
                    </div>
                    <div
                      className="text-blue-500 cursor-pointer"
                      onClick={() => openTeamModal()}
                      data-testid="create-one-team"
                    >
                      create one
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 w-full">
                  <div className="flex w-full justify-center">
                    <img src={require('images/noResult.png')} />
                  </div>
                  <div className="text-center">
                    <div
                      className="mt-8 text-lg font-bold"
                      data-testid="teams-noresult-found"
                    >
                      No result found for &apos;{searchValue}&apos;
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Sorry we can&apos;t find the team you are looking for.
                      <br /> Please try using different filters.
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button
                      label={'Clear search'}
                      variant={Variant.Secondary}
                      onClick={() => {
                        resetField('search', { defaultValue: '' });
                      }}
                      dataTestId="teams-clear-applied-filter"
                    />
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {showTeamModal && (
        <AddTeamModal
          open={showTeamModal}
          openModal={openTeamModal}
          closeModal={closeTeamModal}
          teamFlowMode={teamFlow}
          setTeamFlow={setTeamFlow}
          team={teamFlow === TeamFlow.EditTeam ? editSelectedTeam : undefined} // Default value doesn't clear
        />
      )}

      <TeamFilterModal
        open={showFilterModal}
        openModal={openFilterModal}
        closeModal={closeFilterModal}
      />
    </div>
  );
};

export default Team;
