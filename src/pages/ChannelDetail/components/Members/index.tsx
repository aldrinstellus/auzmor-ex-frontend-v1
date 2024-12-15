import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import AddChannelMembersModal from '../AddChannelMembersModal';
import FilterMenu from 'components/FilterMenu';
import useModal from 'hooks/useModal';
import PeopleCard, {
  PeopleCardPermissionEnum,
} from 'pages/Users/components/People/PeopleCard';
import UsersSkeleton from 'pages/Users/components/Skeletons/UsersSkeleton';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isFiltersEmpty, isNewEntity } from 'utils/misc';
import { ReactNode, useEffect, useState } from 'react';

import useURLParams from 'hooks/useURLParams';
import PopupMenu from 'components/PopupMenu';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { FilterModalVariant } from 'components/FilterModal';
import {
  CHANNEL_MEMBER_STATUS,
  CHANNEL_ROLE,
  IChannel,
  IChannelRequest,
} from '../../../../stores/channelStore';
import NoDataFound from 'components/NoDataFound';
import EntitySelector from 'components/EntitySelector';
import RequestRow from './RequestRow';
import { useMutation } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import { ShowingCount } from 'pages/Users/components/Teams';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useInView } from 'react-intersection-observer';
import PageLoader from 'components/PageLoader';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import useAuth from 'hooks/useAuth';
import { ChannelPermissionEnum } from '../utils/channelPermission';

type MembersProp = {
  channelData: IChannel;
  permissions: ChannelPermissionEnum[];
};

const Members: React.FC<MembersProp> = ({ channelData, permissions }) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('channelDetail', { keyPrefix: 'memberTab' });
  const [isGrid, setGrid] = useState(true);
  const { searchParams } = useURLParams();
  const parsedTab = searchParams.get('type');
  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);
  const { user: loggedInUser } = useAuth();

  const filterForm = useForm<{
    search: string;
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });
  const { watch, resetField } = filterForm;
  const searchValue = watch('search');

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const { filters, clearFilters, updateFilter } = useAppliedFiltersStore();
  const channelRequestStatus = filters?.channelRequestStatus?.length
    ? filters?.channelRequestStatus
        ?.map((eachStatus: any) => eachStatus.id)
        .join(',')
    : CHANNEL_MEMBER_STATUS.PENDING;

  const useInfiniteChannelMembers = getApi(ApiEnum.GetChannelMembers);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteChannelMembers({
      channelId: channelData?.id,
      q: isFiltersEmpty({
        limit: 30,
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
  const users = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return {
          id: user.id,
          role: user.role,
          ...user.user,
          createdAt: user.createdAt,
        };
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

  // Fetch channel requests
  const useInfiniteChannelsRequest = getApi(ApiEnum.GetJoinChannelRequests);
  const {
    data: channelRequestData,
    isLoading: isChannelRequestLoading,
    hasNextPage: hasChannelRequestNextPage,
    isFetchingNextPage: isChannelRequestFetchingNextPage,
    fetchNextPage: fetchChannelRequestNextPage,
  } = useInfiniteChannelsRequest(
    channelData?.id,
    isFiltersEmpty({
      q: searchValue,
      limit: 30,
      status: channelRequestStatus,
      sort: filters?.sort,
      userTeam: filters?.teams?.length
        ? filters?.teams?.map((eachStatus: any) => eachStatus.id).join(',')
        : undefined,
      byPeople: filters?.byPeople?.length
        ? filters?.byPeople?.map((eachStatus: any) => eachStatus.id).join(',')
        : undefined,
    }),
    filters?.type === 'Requests' || parsedTab === 'requests',
  );

  const channelRequests =
    channelRequestData?.pages?.flatMap((page: any) => {
      return page?.data?.result?.data.map(
        (request: IChannelRequest) => request,
      );
    }) || [];

  // Bulk accept channel request
  const bulkChannelRequestUpdate = getApi(ApiEnum.UpdateChannelJoinRequests);
  const bulkRequestAcceptMutation = useMutation({
    mutationKey: ['bulk-channel-request-accept'],
    mutationFn: (payload: { approve?: string[] }) =>
      bulkChannelRequestUpdate(channelData!.id, payload),
    onSuccess: () => {
      successToastConfig({
        content: 'Successfully accepted all selected requests',
      });
    },
    onError: () =>
      failureToastConfig({
        content: 'Something went wrong...! Please try again',
      }),
    onSettled: async () => {
      await queryClient.invalidateQueries(['channel-requests'], {
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['channel-members'] });
      queryClient.invalidateQueries({ queryKey: ['channel'] });
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
      queryClient.invalidateQueries({ queryKey: ['channel-members'] });
      queryClient.invalidateQueries({ queryKey: ['channel'] });
    },
  });

  // quick Filters options
  const requestOptions = [
    {
      label: t('allMembers'),
      labelClassName: 'text-xs font-medium',
      stroke: 'text-neutral-900',
      onClick: () => {
        updateFilter('type', 'All_Members');
        setGrid(true);
      },
    },
    permissions.includes(ChannelPermissionEnum.CanManageChannelRequests) && {
      label: t('requests'),
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

  const getCardPermissions = (user: any) => {
    const peopleCardPermissions: PeopleCardPermissionEnum[] = [];
    if (
      permissions.includes(ChannelPermissionEnum.CanPromoteMember) &&
      loggedInUser?.id != user.userId &&
      user.role !== CHANNEL_ROLE.Admin
    ) {
      peopleCardPermissions.push(PeopleCardPermissionEnum.CanPromote);
    }
    if (
      permissions.includes(ChannelPermissionEnum.CanRemoveMember) &&
      loggedInUser?.id != user.userId
    ) {
      peopleCardPermissions.push(PeopleCardPermissionEnum.CanRemoveFromChannel);
    }
    return peopleCardPermissions;
  };

  return (
    <>
      <Card className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-neutral-900">{t('title')}</p>
          {permissions.includes(ChannelPermissionEnum.CanAddMember) && (
            <Button
              label={t('addMemberCTA')}
              leftIcon="add"
              leftIconClassName="text-white pointer-events-none group-hover:text-white"
              onClick={() => openAddMemberModal()}
            />
          )}
        </div>
        <FilterMenu
          filterForm={filterForm}
          searchPlaceholder={t('searchMembers')}
          dataTestIdFilter="channel-filter-icon"
          dataTestIdSort="channel-sort-icon"
          dataTestIdSearch="channel-search"
          variant={
            filters?.type === 'Requests' || parsedTab === 'requests'
              ? FilterModalVariant.ChannelRequest
              : FilterModalVariant.ChannelMember
          }
        >
          <div className="flex items-center gap-2">
            <div className="text-neutral-500">
              <ShowingCount
                isLoading={isLoading}
                count={
                  isGrid
                    ? data?.pages[0]?.data?.result?.totalCount
                    : channelRequestData?.pages[0]?.data?.result?.totalCount
                }
              />
            </div>
            <div className="relative">
              {permissions.includes(
                ChannelPermissionEnum.CanManageChannelRequests,
              ) ? (
                <PopupMenu
                  triggerNode={
                    <Button
                      active={parsedTab == 'All_Members' || filters?.type}
                      variant={Variant.Secondary}
                      label={
                        parsedTab == 'All_Members' ||
                        filters?.type == 'All_Members'
                          ? t('allMembers')
                          : t('requests')
                      }
                      rightIcon="arrowDown"
                      rightIconSize={24}
                    />
                  }
                  menuItems={requestOptions as any}
                  className=" w-full "
                />
              ) : (
                <Button
                  active={true}
                  variant={Variant.Secondary}
                  label={t('allMembers')}
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
                  {t('noDataFound')}
                  <br /> {t('noDataFoundLine2')}
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
          )}
        </div>
        {isGrid ? (
          <div className="flex gap-6 flex-wrap">
            {isLoading
              ? [...Array(10)].map((_ele, index) => (
                  <div key={`${index}-card-loading`}>
                    <UsersSkeleton />
                  </div>
                ))
              : null}

            {users?.map((user: any) => (
              <PeopleCard
                isChannelPeople
                key={user.id}
                userData={user}
                channelId={channelData?.id}
                showNewJoineeBadge={!isNewEntity(channelData.createdAt)}
                permissions={getCardPermissions(user)}
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
                    {t('memberRequests')}
                  </p>

                  <p className="text-base font-bold text-neutral-500 flex w-[30%]">
                    {t('role')}
                  </p>
                  <p className="text-base font-bold text-neutral-500 w-[20%]">
                    {t('location')}
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
                      label={t('accept')}
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
                    label={t('decline')}
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
            readonly={channelRequestStatus !== CHANNEL_MEMBER_STATUS.PENDING}
          />
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        {isFetchingNextPage && (
          <div className="h-12 w-full flex items-center justify-center">
            <PageLoader />
          </div>
        )}
      </Card>
      {permissions.includes(ChannelPermissionEnum.CanAddMember) &&
        showAddMemberModal && (
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
