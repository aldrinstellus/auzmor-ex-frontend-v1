import React, { useEffect, useRef, useState } from 'react';
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
import { IGetUser, UserRole, useInfiniteUsers } from 'queries/users';
import {
  getProfileImage,
  isFiltersEmpty,
  titleCase,
  twConfig,
} from 'utils/misc';

import PeopleCard from './PeopleCard';
import InviteUserModal from '../InviteUserModal';
import PeopleFilterModal from '../FilterModals/PeopleFilterModal';
import { useInfiniteTeamMembers } from 'queries/teams';
import { EntitySearchModalType } from 'components/EntitySearchModal';
import Sort from 'components/Sort';

export interface IPeopleProps {
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  teamTab?: string;
  teamId?: string;
}

interface IForm {
  search?: string;
  role?: { value: string; label: string };
}

const People: React.FC<IPeopleProps> = ({
  showModal,
  openModal,
  closeModal,
  teamTab,
  teamId,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [userStatus, setUserStatus] = useState<string>('');
  const [filterSortBy, setFilterSortBy] = useState<string>('');
  const { ref, inView } = useInView();

  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
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
    return useInfiniteUsers(
      isFiltersEmpty({
        status: userStatus,
        role: role?.value,
        sort: filterSortBy,
        q: debouncedSearchValue,
      }),
    );
  };

  const getTeamMembersData = () => {
    return useInfiniteTeamMembers(
      teamId || '',
      isFiltersEmpty({
        status: userStatus,
        role: role?.value,
        sort: filterSortBy,
        q: debouncedSearchValue,
      }),
    );
  };

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    teamTab === EntitySearchModalType.Team && teamId
      ? getTeamMembersData()
      : getPeoplesData();

  const roleSelectRef = useRef<any>();

  console.log('data coming from User or Members....', data);

  const customReset = () => {
    if (roleSelectRef && roleSelectRef.current)
      roleSelectRef.current.setValue('');
  };

  const roleFields = [
    {
      type: FieldType.SingleSelect,
      control,
      height: '36px',
      className: 'p-0 w-44',
      name: 'role',
      placeholder: 'Role',
      size: InputSize.Small,
      dataTestId: 'filterby-role',
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

  return (
    <div className="relative pb-8">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {teamTab !== 'TEAM' && (
              <>
                <Button
                  label="My Teams"
                  size={Size.Small}
                  variant={Variant.Secondary}
                  className="cursor-not-allowed h-9 grow-0"
                  dataTestId="people-view-my-teams"
                />
                <Button
                  label="All Members"
                  size={Size.Small}
                  variant={Variant.Secondary}
                  className="!py-2 grow-0"
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
              className="bg-white"
              dataTestId="people-filter"
            />
            <Sort
              setFilter={setFilterSortBy}
              filterKey="createdAt"
              filterValue={{ asc: 'ASC', desc: 'DESC' }}
              title={
                <div className="bg-blue-50 flex px-6 py-2 font-xs font-medium text-neutral-500">
                  Sort by
                </div>
              }
              entity={
                teamTab === EntitySearchModalType.Team
                  ? EntitySearchModalType.Team
                  : 'USER'
              }
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
                    isClearable: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="text-neutral-500 mt-6 mb-6">
          Showing {!isLoading && data?.pages[0]?.data?.result?.totalCount}{' '}
          results
        </div>

        {userStatus && (
          <div className="flex justify-between  mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-base text-neutral-500">Filter By</div>
              <div
                className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1"
                data-testid={`people-filterby-${userStatus}`}
              >
                <div className="mr-1">{titleCase(userStatus)}</div>
                <Icon
                  name="close"
                  size={16}
                  stroke={twConfig.theme.colors.neutral['900']}
                  className="cursor-pointer"
                  onClick={() => setUserStatus('')}
                  dataTestId={`people-filterby-close-${userStatus}`}
                />
              </div>
            </div>
            <div
              className="text-neutral-500 border px-3 py-1 rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
              onClick={() => setUserStatus('')}
            >
              Clear Filters
            </div>
          </div>
        )}
      </div>

      <div>
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
                  {usersData
                    ?.filter((userCard: IGetUser) => {
                      if (role) {
                        return role?.value === userCard.role;
                      } else return true;
                    })
                    .map((user: any) => (
                      <PeopleCard
                        key={user.id}
                        {...user}
                        image={getProfileImage(user)}
                      />
                    ))}
                  <div className="h-12 w-12">
                    {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                  </div>
                  {isFetchingNextPage && <PageLoader />}
                </>
              );
            }
            return teamTab === EntitySearchModalType.Team ? (
              <div className="flex flex-col w-full items-center space-y-4">
                <img
                  src={MemberNotFound}
                  width={176}
                  height={144}
                  alt="No Member Found"
                />
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center flex-col space-y-1">
                    <div className="text-lg font-bold text-neutral-900">
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
                  className="space-x-1"
                  size={Size.Large}
                  dataTestId="no-result-add-team-cta"
                  leftIcon={'addCircle'}
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
                    No result found for &apos;{searchValue}&apos;
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

      <PeopleFilterModal
        setUserStatus={setUserStatus}
        userStatus={userStatus}
        open={showFilterModal}
        openModal={openFilterModal}
        closeModal={closeFilterModal}
      />
    </div>
  );
};

export default People;
