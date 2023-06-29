import React, { useEffect, useState } from 'react';
import Button, { Size, Variant } from 'components/Button';
import UserCard from './components/UserCard';
import TabSwitch from './components/TabSwitch';
import { IGetUser, UserRole, useInfiniteUsers } from 'queries/users';
import { Variant as InputVariant } from 'components/Input';
import InviteUserModal from './components/InviteUserModal';
import TablePagination from 'components/TablePagination';
import Card from 'components/Card';
import Spinner from 'components/Spinner';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize } from 'components/Input';
import { useForm } from 'react-hook-form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import FilterModal from './components/FilterModal';
import { useDebounce } from 'hooks/useDebounce';
import Icon from 'components/Icon';
import { isFiltersEmpty, twConfig } from 'utils/misc';
import useAuth from 'hooks/useAuth';
import { Role } from 'utils/enum';
import { useInView } from 'react-intersection-observer';
import PageLoader from 'components/PageLoader';
import clsx from 'clsx';
import Tabs from 'components/Tabs';
import UsersSkeleton from './components/UsersSkeleton';

interface IForm {
  search?: string;
  role?: { value: string; label: string };
}
interface IUsersProps {}

const Users: React.FC<IUsersProps> = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [userStatus, setUserStatus] = useState<string>('');
  const { user } = useAuth();

  const {
    control,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const { ref, inView } = useInView();

  const searchValue = watch('search');
  const role = watch('role');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteUsers(
      isFiltersEmpty({
        status: userStatus,
        role: role?.value,
        q: debouncedSearchValue,
      }),
    );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const usersData = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((user: any) => {
      try {
        return user;
      } catch (e) {
        console.log('Error', { user });
      }
    });
  });

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

  const peopleHubNode = (
    <div className="relative pb-8">
      <div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button
              label="My Teams"
              size={Size.Small}
              variant={Variant.Secondary}
              disabled
              className="cursor-not-allowed h-9 grow-0"
              dataTestId="people-view-my-teams"
            />
            <Button
              label="All Members"
              size={Size.Small}
              variant={Variant.Secondary}
              className="!py-2 grow-0"
              dataTestId="people-view-all-members"
              onClick={() => reset()}
            />
            <Layout fields={roleFields} />
          </div>
          <div className="flex space-x-2 justify-center items-center">
            <IconButton
              onClick={() => {
                setShowFilterModal(true);
              }}
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white"
              dataTestId="people-filter"
            />
            <IconButton
              icon="arrowSwap"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              disabled
              className="bg-white"
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
                    placeholder: 'Search members',
                    error: errors.search?.message,
                    dataTestId: 'people-search-members',
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="text-neutral-500 mt-6 mb-3">
          Showing {!isLoading && usersData?.length} results
        </div>

        <div className="mb-4 flex">
          {userStatus && (
            <div
              className="border border-neutral-200 rounded-17xl px-3 py-2 flex bg-white capitalize text-sm font-medium items-center mr-1"
              data-testid={`people-filterby-${userStatus}`}
            >
              <div className="mr-1">{userStatus}</div>
              <Icon
                name="closeCircleOutline"
                stroke={twConfig.theme.colors.neutral['900']}
                className="cursor-pointer"
                onClick={() => setUserStatus('')}
                dataTestId={`people-filterby-close-${userStatus}`}
              />
            </div>
          )}
        </div>
      </div>

      <div className="">
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
                      <UserCard
                        key={user.id}
                        {...user}
                        image={user?.profileImage?.original}
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

      {/* {users?.result?.data?.length > 0 && (
        <div className="absolute right-0">
          <TablePagination
            total={users?.result?.totalCount}
            page={page}
            onPageChange={setPage}
            dataTestIdPrefix="people-pagination"
          />
        </div>
      )} */}
      <InviteUserModal
        showModal={showAddUserModal}
        setShowAddUserModal={setShowAddUserModal}
        closeModal={() => setShowAddUserModal(false)}
      />

      {showFilterModal && (
        <FilterModal
          setUserStatus={setUserStatus}
          userStatus={userStatus}
          showModal={showFilterModal}
          closeModal={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );

  const tabs = [
    {
      id: 1,
      title: 'People',
      dataTestId: 'people-view-people',
      content: peopleHubNode,
    },
    {
      id: 2,
      title: 'Teams',
      dataTestId: 'people-view-teams',
      content: <div>Teams</div>,
      disable: true,
    },
  ];

  const tabStyles = (active: boolean, disabled = false) =>
    clsx(
      {
        'font-bold px-4 cursor-pointer py-1': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
      {
        'bg-opacity-50 text-gray-400': disabled,
      },
    );

  const tabs2 = [
    {
      id: 1,
      tabLable: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>People</div>
      ),
      dataTestId: 'people-view-people',
      tabContent: peopleHubNode,
    },
    {
      id: 2,
      tabLable: (isActive: boolean) => (
        <div className={tabStyles(isActive, true)}>Teams</div>
      ),
      dataTestId: 'people-view-teams',
      tabContent: <div>Teams</div>,
      disabled: true,
    },
  ];
  return (
    <Card className="p-8 w-full h-full">
      <div className="space-y-6">
        <div className="flex justify-between">
          <div
            className="text-2xl font-bold"
            data-testid="people-hub-page-title"
          >
            People Hub
          </div>
          <div className="flex space-x-2">
            <Button
              className="flex space-x-[6px]"
              label="View Organization Chart"
              variant={Variant.Secondary}
              leftIcon="convertShape"
              leftIconSize={20}
              disabled
              dataTestId="people-org-chart"
            />
            {user?.role !== Role.Member && (
              <Button
                className="flex space-x-1"
                label="Add Members"
                leftIcon="add"
                onClick={() => {
                  setShowAddUserModal(true);
                }}
                dataTestId="add-members-btn"
              />
            )}
          </div>
        </div>
        {/* Tab Switcher */}
        {/* <TabSwitch tabs={tabs} /> */}
        <Tabs
          tabs={tabs2}
          className="w-fit flex justify-start bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200"
          tabSwitcherClassName="!p-1"
          showUnderline={false}
          itemSpacing={1}
          tabContentClassName="mt-8"
        />
      </div>
    </Card>
  );
};

export default Users;
