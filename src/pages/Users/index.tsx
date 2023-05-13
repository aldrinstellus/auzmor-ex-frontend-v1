import React, { useState } from 'react';
import Button, { Size, Variant } from 'components/Button';
import UserCard from './components/UserCard';
import TabSwitch from './components/TabSwitch';
import { IPostUsersResponse, useUsers } from 'queries/users';
import InviteUserModal from './components/InviteUserModal';
import TablePagination from 'components/TablePagination';
import Icon from 'components/Icon';
import Card from 'components/Card';
import Spinner from 'components/Spinner';

interface IUsersProps {}

const tabs = [
  {
    label: 'People',
  },
  {
    label: 'Teams',
  },
];

const Users: React.FC<IUsersProps> = () => {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useUsers({ next: page });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  return (
    <Card className="px-8 py-9 w-full h-fit">
      {/* Top People Directory Section */}
      <div className="space-y-7">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">People Hub</div>
          <div className="flex space-x-2">
            <Button
              className="flex space-x-[6px]"
              label="View Organization Chart"
              variant={Variant.Secondary}
              leftIcon="convertShape"
            />
            <Button
              className="flex space-x-2"
              label="Add People"
              leftIcon="add"
              onClick={() => {
                setShowAddUserModal(true);
              }}
            />
          </div>
        </div>
        {/* Tab Switcher */}
        <TabSwitch tabs={tabs} />

        {/* People Directory Filter */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button
              label="My Teams"
              size={Size.Small}
              variant={Variant.Secondary}
              disabled
              className="cursor-not-allowed"
            />
            <Button
              label="All Members"
              size={Size.Small}
              variant={Variant.Secondary}
            />
            {/* <Layout
                fields={[
                  {
                    type: FieldType.SingleSelect,
                    control,
                    name: 'role',
                    defaultValue: 'Role',
                    options: [
                      {
                        id: 1,
                        label: 'ADMIN',
                      },
                      {
                        id: 2,
                        label: 'SUPER ADMIN',
                      },
                    ],
                  },
                ]}
              /> */}
          </div>
          <div className="flex space-x-2">
            <div className="border border-solid border-neutral-200 p-[10px] rounded-17xl">
              <Icon name="filter" />
            </div>
            <div className="border border-solid border-neutral-200 p-[10px] rounded-17xl">
              <Icon name="filter" />
            </div>
            {/* <div>
                <Layout
                  fields={[
                    {
                      type: FieldType.Input,
                      control,
                      name: 'search',
                      placeholder: 'Search members',
                    },
                  ]}
                />
              </div> */}
          </div>
        </div>
        <div className=" text-neutral-500">
          Showing {!isLoading && users.result.data.length} results
        </div>
        <div className="flex flex-wrap gap-6">
          {users?.result?.data?.length > 0 &&
            users?.result?.data?.map((user: any) => (
              <UserCard key={user.id} {...user} />
            ))}
          {isLoading && <Spinner />}
        </div>
        <div className="absolute right-6 bottom-6">
          <TablePagination
            total={users?.result?.totalCount}
            page={page}
            onPageChange={setPage}
          />
        </div>
      </div>

      {showAddUserModal && (
        <InviteUserModal
          showModal={showAddUserModal}
          setShowAddUserModal={setShowAddUserModal}
          closeModal={() => setShowAddUserModal(false)}
        />
      )}
    </Card>
  );
};

export default Users;
