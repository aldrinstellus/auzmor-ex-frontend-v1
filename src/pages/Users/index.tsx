import React, { useState } from 'react';
import Button, { Size, Variant } from 'components/Button';
import UserCard from './components/UserCard';
import TabSwitch from './components/TabSwitch';
import { IPostUsersResponse, useUsers } from 'queries/users';
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

interface IUsersProps {}

const tabs = [
  { id: 1, title: 'People', content: <div>Content for Tab 1</div> },
  { id: 2, title: 'Teams', content: <div>Content for Tab 2</div> },
];

const Users: React.FC<IUsersProps> = () => {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useUsers({ next: page });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  return (
    <Card className="px-8 pt-9 pb-8 w-full h-[1109px] space-y-6">
      {/* Top People Directory Section */}
      <div className="space-y-7 h-[25%]">
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
              className="cursor-not-allowed h-9 grow-0"
            />
            <Button
              label="All Members"
              size={Size.Small}
              variant={Variant.Secondary}
              className="h-9 grow-0"
            />
            <Layout
              fields={[
                {
                  type: FieldType.SingleSelect,
                  control,
                  className: 'h-9 w-44',
                  name: 'role',
                  placeholder: 'Role',
                  size: InputSize.Small,
                  defaultValue: 'ADMIN',
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
            />
          </div>
          <div className="flex space-x-2 justify-center items-center">
            <IconButton
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Small}
              borderAround
              className="bg-white"
            />
            <IconButton
              icon="filter"
              variant={IconVariant.Secondary}
              size={IconSize.Small}
              borderAround
              className="bg-white"
            />
            <div>
              <Layout
                fields={[
                  {
                    type: FieldType.Input,
                    size: InputSize.Small,
                    leftIcon: 'search',
                    control,
                    name: 'search',
                    placeholder: 'Search members',
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className=" text-neutral-500">
          Showing {!isLoading && users.result.data.length} results
        </div>
      </div>

      <div className="overflow-y-auto h-[65%]">
        <div className="flex flex-wrap gap-6">
          {users?.result?.data?.length > 0 &&
            users?.result?.data?.map((user: any) => (
              <UserCard key={user.id} {...user} />
            ))}
          {isLoading && <Spinner color="#000" />}
        </div>
      </div>

      <div className="float-right h-[10%]">
        <TablePagination
          total={users?.result?.totalCount}
          page={page}
          onPageChange={setPage}
        />
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
