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
import TeamModal from '../TeamModal';
import { addTeamMember, useInfiniteTeams } from 'queries/teams';
import { isFiltersEmpty, twConfig } from 'utils/misc';
import PageLoader from 'components/PageLoader';
import TeamNotFound from 'images/TeamNotFound.svg';
import TeamsSkeleton from '../Skeletons/TeamsSkeleton';
import Skeleton from 'react-loading-skeleton';
import { ITeamDetailState } from 'pages/Users';
import Sort from 'components/Sort';
import EntitySearchModal, {
  EntitySearchModalType,
} from 'components/EntitySearchModal';
import { IGetUser } from 'queries/users';
import Avatar from 'components/Avatar';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import Icon from 'components/Icon';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import queryClient from 'utils/queryClient';
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
  // show add team modal
  showTeamModal: boolean;
  openTeamModal: () => void;
  closeTeamModal: () => void;
  // stored one team detail
  showTeamDetail: ITeamDetailState;
  setShowTeamDetail: (detail: ITeamDetailState) => void;
  // set team flow
  setTeamFlow: any;
  teamFlow: string;
  // show add members modal
  showAddMemberModal: boolean;
  openAddMemberModal: () => void;
  closeAddMemberModal: () => void;
}

const Team: React.FC<ITeamProps> = ({
  showTeamModal,
  openTeamModal,
  closeTeamModal,
  showTeamDetail,
  setShowTeamDetail,
  setTeamFlow,
  teamFlow,
  showAddMemberModal,
  openAddMemberModal,
  closeAddMemberModal,
}) => {
  const [sortByFilter, setSortByFilter] = useState<string>('');
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  useModal();

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
  const [filters, setFilters] = useState<any>({
    categories: [],
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams(
      isFiltersEmpty({
        q: debouncedSearchValue,
        sort: sortByFilter,
        category:
          filters.categories.length > 0
            ? filters.categories
                .map((category: any) => category?.name?.toUpperCase())
                .join(', ')
            : undefined,
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

  const handleRemoveFilters = (key: any, id: any) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [key]: prevFilters[key].filter((item: any) => item.id !== id),
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
    });
  };

  // const teamId = showTeamDetail?.teamDetail?.id;

  // const addTeamMemberMutation = useMutation({
  //   mutationKey: ['add-team-member', teamId],
  //   mutationFn: (payload: any) => {
  //     return addTeamMember(teamId || '', payload);
  //   },
  //   onError: (error: any) => {
  //     toast(
  //       <FailureToast
  //         content={`Error Adding Team Members`}
  //         dataTestId="team-create-error-toaster"
  //       />,
  //       {
  //         closeButton: (
  //           <Icon
  //             name="closeCircleOutline"
  //             color="text-red-500"
  //             size={20}
  //           />
  //         ),
  //         style: {
  //           border: `1px solid ${twConfig.theme.colors.red['300']}`,
  //           borderRadius: '6px',
  //           display: 'flex',
  //           alignItems: 'center',
  //         },
  //         autoClose: TOAST_AUTOCLOSE_TIME,
  //         transition: slideInAndOutTop,
  //         theme: 'dark',
  //       },
  //     );
  //   },
  //   onSuccess: (data: any) => {
  //     toast(<SuccessToast content={'Members has been added to team'} />, {
  //       style: {
  //         border: `1px solid ${twConfig.theme.colors.primary['300']}`,
  //         borderRadius: '6px',
  //         display: 'flex',
  //         alignItems: 'center',
  //       },
  //       autoClose: TOAST_AUTOCLOSE_TIME,
  //       transition: slideInAndOutTop,
  //       theme: 'dark',
  //     });
  //     queryClient.invalidateQueries(['categories']);
  //     queryClient.invalidateQueries(['team-members']);
  //   },
  // });

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

      {/* CATEGORY FILTER */}

      {filters.categories.length > 0 && (
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <div className="text-base text-neutral-500 whitespace-nowrap">
              Filter By
            </div>
            {filters.categories.map((category: any) => (
              <div
                key={category.id}
                className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1"
                data-testid={`people-filterby`}
              >
                <div className="mr-1 text-neutral-500 whitespace-nowrap">
                  Category{' '}
                  <span className="text-primary-500">L{category.name}</span>
                </div>
                <Icon
                  name="close"
                  size={16}
                  color="text-neutral-900"
                  className="cursor-pointer"
                  onClick={() => handleRemoveFilters('categories', category.id)}
                  dataTestId={`people-filterby-close`}
                />
              </div>
            ))}
          </div>
          <div
            className="text-neutral-500 border px-3 py-1  mt-2 whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
            onClick={clearFilters}
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
                    setShowTeamDetail={setShowTeamDetail}
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
        <TeamModal
          open={showTeamModal}
          openModal={openTeamModal}
          closeModal={closeTeamModal}
          teamFlowMode={teamFlow}
          setTeamFlow={setTeamFlow}
          team={
            teamFlow === TeamFlow.EditTeam
              ? showTeamDetail.teamDetail
              : undefined
          }
          openAddMemberModal={openAddMemberModal}
        />
      )}

      {showAddMemberModal && (
        <EntitySearchModal
          open={showAddMemberModal}
          openModal={openAddMemberModal}
          closeModal={closeAddMemberModal}
          onBackPress={openTeamModal}
          entityType={EntitySearchModalType.Team}
          entityRenderer={(data: IGetUser) => {
            return (
              <div className="flex space-x-4 w-full">
                <Avatar
                  name={data?.fullName || 'U'}
                  size={32}
                  image={data?.profileImage?.original}
                />
                <div className="flex space-x-6 w-full">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-bold text-neutral-900">
                        {data?.fullName}
                      </div>
                      {/* <div className="flex space-x-[14px] items-center">
                        <div className="flex space-x-1 items-start">
                          <Icon name="briefcase" size={16} />
                          <div className="text-xs font-normal text-neutral-500">
                            {'Chief Financial officer'}
                          </div>
                        </div>

                        <div className="w-1 h-1 bg-neutral-500 rounded-full" />

                        <div className="flex space-x-1 items-start">
                          <Icon name="location" size={16} />
                          <div className="text-xs font-normal text-neutral-500">
                            {'New York, US.'}
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="text-xs font-normal text-neutral-500">
                      {data?.primaryEmail}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
          onSubmit={(userIds: string[]) => {
            closeAddMemberModal();
          }}
          onCancel={closeAddMemberModal}
          title="Add Members"
          submitButtonText="Add Members"
        />
      )}

      <TeamFilterModal
        open={showFilterModal}
        openModal={openFilterModal}
        closeModal={closeFilterModal}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default Team;
