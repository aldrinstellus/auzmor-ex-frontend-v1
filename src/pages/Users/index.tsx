import React, { useEffect, useState } from 'react';
import Button, { Size, Variant } from 'components/Button';
import UserCard from './components/UserCard';
import TabSwitch from './components/TabSwitch';
import {
  PeopleFilterKeys,
  IPeopleFilters,
  useUsers,
  FilterType,
} from 'queries/users';
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
import { twConfig } from 'utils/misc';
import useAuth from 'hooks/useAuth';
import { Role } from 'utils/enum';

interface IForm {
  search?: string;
  role?: { value: string; label: string };
}
interface IUsersProps {}

const Users: React.FC<IUsersProps> = () => {
  const [page, setPage] = useState(1);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [userStatus, setUserStatus] = useState<string>('');
  const [peopleFilters, setPeopleFilters] = useState<IPeopleFilters>({
    [PeopleFilterKeys.PeopleFilterType]: [],
  }); // for future filters
  const { user } = useAuth();

  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const clearAppliedFilters = () => {
    setUserStatus('');
  };

  const getAppliedFiltersCount = () => {
    return userStatus?.length || 0;
  };

  const removePostTypeFilter = (filter: FilterType) => {
    if (userStatus) {
      setUserStatus('');
    }
  };

  const searchValue = watch('search');
  const role = watch('role');

  const debouncedSearchValue = useDebounce(searchValue || '', 500);
  const { isLoading, data: users } = useUsers({
    q: debouncedSearchValue,
    limit: 30,
    next: page,
    status: userStatus,
  });

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
            />
            <Layout
              fields={[
                {
                  type: FieldType.SingleSelect,
                  control,
                  height: '36px',
                  className: 'p-0 w-44',
                  name: 'role',
                  placeholder: 'Role',
                  size: InputSize.Small,
                  disabled: true,
                  dataTestid: 'people-role',
                  options: [
                    {
                      value: 'ADMIN',
                      label: 'Admin',
                    },
                    {
                      id: 'SUPER ADMIN',
                      label: 'Super Admin',
                    },
                  ],
                },
              ]}
            />
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
          Showing {!isLoading && users.result.data.length} results
        </div>

        <div className="mb-4 flex">
          {userStatus && (
            <div className="border border-neutral-200 rounded-17xl px-3 py-2 flex bg-white capitalize text-sm font-medium items-center mr-1">
              <div className="mr-1">{userStatus}</div>
              <Icon
                name="closeCircleOutline"
                stroke={twConfig.theme.colors.neutral['900']}
                className="cursor-pointer"
                onClick={() => setUserStatus('')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="">
        <div className="flex flex-wrap gap-6">
          {users?.result?.data?.length > 0 &&
            users?.result?.data?.map((user: any) => (
              <UserCard
                key={user.id}
                {...user}
                image={user?.profileImage?.original}
              />
            ))}
          {isLoading && <Spinner color="#000" />}
        </div>
      </div>

      <div className="absolute right-0">
        <TablePagination
          total={users?.result?.totalCount}
          page={page}
          onPageChange={setPage}
          dataTestIdPrefix="people-pagination"
        />
      </div>

      <InviteUserModal
        showModal={showAddUserModal}
        setShowAddUserModal={setShowAddUserModal}
        closeModal={() => setShowAddUserModal(false)}
      />

      {showFilterModal && (
        <FilterModal
          setUserStatus={setUserStatus}
          userStatus={userStatus}
          page={page}
          showModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
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
    },
  ];

  return (
    <Card className="p-8 w-full h-full">
      {/* Top People Directory Section */}
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
        <TabSwitch tabs={tabs} />
      </div>
    </Card>
  );
};

export default Users;
