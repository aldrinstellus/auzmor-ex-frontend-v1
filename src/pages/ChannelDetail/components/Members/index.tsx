import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import AddChannelMembersModal from '../AddChannelMembersModal';
import FilterMenu from 'components/FilterMenu';
import useModal from 'hooks/useModal';
import PeopleCard from 'pages/Users/components/People/PeopleCard';
import UsersSkeleton from 'pages/Users/components/Skeletons/UsersSkeleton';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isFiltersEmpty } from 'utils/misc';
import { ReactNode, useEffect, useState } from 'react';
import {
  bulkChannelRequestUpdate,
  useInfiniteChannelMembers,
  useInfiniteChannelsRequest,
} from 'queries/channel';

import useURLParams from 'hooks/useURLParams';
import PopupMenu from 'components/PopupMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { FilterModalVariant } from 'components/FilterModal';
import {
  CHANNEL_MEMBER_STATUS,
  IChannel,
  IChannelRequest,
} from '../../../../stores/channelStore';
import NoDataFound from 'components/NoDataFound';
import EntitySelector from 'components/EntitySelector';
import RequestRow from './RequestRow';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import { useChannelRole } from 'hooks/useChannelRole';
import { ShowingCount } from 'pages/Users/components/Teams';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';

type AppProps = {
  channelData: IChannel;
};

const Members: React.FC<AppProps> = ({ channelData }) => {
  const { t } = useTranslation('channels');
  const { isUserAdminOrChannelAdmin } = useChannelRole(channelData.id);
  const { filters, clearFilters, updateFilter } = useAppliedFiltersStore();
  useEffect(() => {
    clearFilters();
  }, []);
  const [isGrid, setGrid] = useState(true);
  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });
  const { watch, resetField } = filterForm;
  const searchValue = watch('search');

  const { searchParams } = useURLParams();
  const parsedTab = searchParams.get('type');
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const { data, isLoading } = useInfiniteChannelMembers({
    channelId: channelData?.id,
    q: isFiltersEmpty({
      q: searchValue,
      sort: filters?.sort,
      userStatus: filters?.status?.length
        ? filters?.status?.map((eachStatus: any) => eachStatus.id).join(',')
        : undefined,
      userRole: filters?.roles?.length
        ? filters?.roles?.map((role: any) => role.id).join(',')
        : undefined,
      userTeam: filters?.teams?.length
        ? filters?.teams?.map((eachStatus: any) => eachStatus.id).join(',')
        : undefined,
      byPeople: filters?.byPeople?.length
        ? filters?.byPeople?.map((eachStatus: any) => eachStatus.id).join(',')
        : undefined,
    }),
  });
  const users = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return { id: user.id, role: user.role, ...user.user };
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  // Fetch channel requests
  const {
    data: channelRequestData,
    isLoading: isChannelRequestLoading,
    hasNextPage: hasChannelRequestNextPage,
    isFetchingNextPage: isChannelRequestFetchingNextPage,
    fetchNextPage: fetchChannelRequestNextPage,
  } = useInfiniteChannelsRequest(
    channelData?.id,
    isFiltersEmpty({
      limit: 30,
      status: CHANNEL_MEMBER_STATUS.PENDING,
      sort: filters?.sort,
    }),
  );

  const channelRequests =
    channelRequestData?.pages?.flatMap((page) => {
      return page?.data?.result?.data.map((request: IChannelRequest) => {
        try {
          return request;
        } catch (e) {
          console.log('Error', { request });
        }
      });
    }) || [];

  // Bulk accept channel request
  const bulkRequestAcceptMutation = useMutation({
    mutationKey: ['bulk-channel-request-accept'],
    mutationFn: (payload: { approve?: string[] }) =>
      bulkChannelRequestUpdate(channelData!.id, payload),
    onSuccess: () =>
      successToastConfig({
        content: 'Successfully accepted all selected requests',
      }),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSettled: async () => {
      await queryClient.invalidateQueries(['channel-requests'], {
        exact: false,
      });
      await queryClient.invalidateQueries(['channel-members'], {
        exact: false,
      });
    },
  });

  // Bulk reject channel request
  const bulkRequestRejectMutation = useMutation({
    mutationKey: ['bulk-channel-request-reject'],
    mutationFn: (payload: { reject?: Record<string, any>[] }) =>
      bulkChannelRequestUpdate(channelData!.id, payload),
    onSuccess: () =>
      successToastConfig({
        content: 'Successfully declined all selected requests',
      }),
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSettled: async () => {
      await queryClient.invalidateQueries(['channel-requests'], {
        exact: false,
      });
      await queryClient.invalidateQueries(['channel-members'], {
        exact: false,
      });
    },
  });

  // quick Filters options
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
    isUserAdminOrChannelAdmin && {
      label: 'Requests',
      labelClassName: 'text-xs font-medium',
      stroke: 'text-neutral-900',
      onClick: () => {
        updateFilter('type', 'requests');
        setGrid(false);
      },
    },
  ].filter(Boolean); // request options only for admin

  useEffect(() => {
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
          {isUserAdminOrChannelAdmin && (
            <Button
              label={t('members.addMemberCTA')}
              leftIcon="add"
              leftIconClassName="text-white pointer-events-none group-hover:text-white"
              onClick={() => openAddMemberModal()}
            />
          )}
        </div>
        <FilterMenu
          filterForm={filterForm}
          searchPlaceholder={t('members.searchMembers')}
          dataTestIdFilter="channel-filter-icon"
          dataTestIdSort="channel-sort-icon"
          dataTestIdSearch="channel-search"
          variant={FilterModalVariant.ChannelMember}
        >
          <div className="flex items-center gap-2">
            <div className="text-neutral-500">
              <ShowingCount
                isLoading={isLoading}
                count={
                  isGrid
                    ? users?.length
                    : channelRequestData?.pages[0]?.data?.result?.totalCount
                }
              />
            </div>
            <div className="relative">
              {isUserAdminOrChannelAdmin ? (
                <PopupMenu
                  triggerNode={
                    <Button
                      active={parsedTab == 'All_Members' || filters?.type}
                      variant={Variant.Secondary}
                      label={
                        parsedTab == 'All_Members' ||
                        filters?.type == 'All_Members'
                          ? 'All members'
                          : 'Requests'
                      }
                      rightIcon={`${
                        isUserAdminOrChannelAdmin ? 'arrowDown' : ''
                      }`}
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
          </div>
        </FilterMenu>
        <div className="flex items-center gap-2">
          {isGrid && users?.length == 0 && (
            <NoDataFound
              className="py-4 w-full"
              searchString={searchValue}
              illustration="noResult"
              message={
                <p>
                  Sorry we can&apos;t find the Member you are looking for.
                  <br /> Please check the spelling or try again.
                </p>
              }
              clearBtnLabel={searchValue ? 'Clear Search' : 'Clear Filters'}
              onClearSearch={() => {
                searchValue && resetField
                  ? resetField('search', { defaultValue: '' })
                  : clearFilters();
              }}
              dataTestId="people"
            />
          )}
        </div>
        {isGrid ? (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 xl:grid-cols-4 1.5xl:grid-cols-5">
            {isLoading
              ? [...Array(10)].map((element) => (
                  <div key={element}>
                    <UsersSkeleton />
                  </div>
                ))
              : null}

            {users?.map((user) => (
              <PeopleCard
                isUserAdminOrChannelAdmin={isUserAdminOrChannelAdmin}
                isChannelPeople={true}
                key={user.id}
                userData={user}
                channelId={channelData?.id}
              />
            ))}
          </div>
        ) : (
          <EntitySelector
            isLoading={isChannelRequestLoading}
            entityHeaderRenderer={() =>
              (
                <div className="flex items-center gap-4 py-3">
                  <p className="text-base font-bold text-neutral-500 flex w-[43%] mr-[48px]">
                    Member requests
                  </p>

                  <p className="text-base font-bold text-neutral-500 flex w-[30%]">
                    Role
                  </p>
                  <p className="text-base font-bold text-neutral-500 w-[20%]">
                    Location
                  </p>
                </div>
              ) as ReactNode
            }
            entityRenderer={(entity) =>
              (<RequestRow request={entity as IChannelRequest} />) as ReactNode
            }
            entityData={channelRequests}
            menuItems={[
              {
                key: 'accept',
                component: (selectedEntities: IChannelRequest[], reset) =>
                  (
                    <Button
                      label="Accept"
                      leftIcon="tickCircle"
                      leftIconSize={16}
                      leftIconClassName="!text-neutral-500 group-hover:!text-primary-600"
                      labelClassName="!font-semibold !text-neutral-700 group-hover:!text-primary-600 group-active:text-primary-700"
                      variant={Variant.Tertiary}
                      onClick={() => {
                        bulkRequestAcceptMutation.mutate(
                          {
                            approve: selectedEntities.map(
                              (entity) => entity.id,
                            ),
                          },
                          {
                            onSettled: () => reset(),
                          },
                        );
                      }}
                      loading={bulkRequestAcceptMutation.isLoading}
                    />
                  ) as ReactNode,
              },
              {
                key: 'decline',
                component: (selectedEntities: IChannelRequest[], reset) => (
                  <Button
                    label="Decline"
                    leftIcon="delete"
                    leftIconSize={16}
                    leftIconClassName="!text-neutral-500 group-hover:!text-primary-600"
                    labelClassName="!font-semibold !text-neutral-700 group-hover:!text-primary-600 group-active:text-primary-700"
                    variant={Variant.Tertiary}
                    onClick={() =>
                      bulkRequestRejectMutation.mutate(
                        {
                          reject: selectedEntities.map((entity) => ({
                            id: entity.id,
                            reason: 'Not eligible',
                          })),
                        },
                        {
                          onSettled: () => reset(),
                        },
                      )
                    }
                    loading={bulkRequestRejectMutation.isLoading}
                  />
                ),
              },
            ]}
            hasNextPage={hasChannelRequestNextPage}
            isFetchingNextPage={isChannelRequestFetchingNextPage}
            fetchNextPage={fetchChannelRequestNextPage}
            dataTestId="join-requests"
          />
        )}
      </Card>
      {isUserAdminOrChannelAdmin && showAddMemberModal && channelData && (
        <AddChannelMembersModal
          open={showAddMemberModal}
          closeModal={closeAddMemberModal}
          channelData={channelData}
        />
      )}
    </>
  );
};

export default Members;
