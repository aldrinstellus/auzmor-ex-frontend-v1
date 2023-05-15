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

const Users: React.FC<IUsersProps> = () => {
  const [page, setPage] = useState(1);
  const { data: users, isLoading } = useUsers({ limit: 30, next: page });
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
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
                  height: '36px',
                  className: 'p-0 w-44',
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
              size={IconSize.Medium}
              borderAround
              className="bg-white"
            />
            <IconButton
              icon="arrowSwap"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
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

        <div className=" text-neutral-500 mt-6 mb-3">
          Showing {!isLoading && users.result.data.length} results
        </div>
      </div>

      <div className="">
        <div className="flex flex-wrap gap-6">
          {users?.result?.data?.length > 0 &&
            users?.result?.data?.map((user: any) => (
              <UserCard
                key={user.id}
                {...user}
                image={user?.profileImage?.originalUrl}
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
        />
      </div>

      <InviteUserModal
        showModal={showAddUserModal}
        setShowAddUserModal={setShowAddUserModal}
        closeModal={() => setShowAddUserModal(false)}
      />
    </div>
  );

  const tabs = [
    { id: 1, title: 'People', content: peopleHubNode },
    { id: 2, title: 'Teams', content: <div>Teams</div> },
  ];

  return (
    <Card className="p-8 w-full h-full">
      {/* Top People Directory Section */}
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">People Hub</div>
          <div className="flex space-x-2">
            <Button
              className="flex space-x-[6px]"
              label="View Organization Chart"
              variant={Variant.Secondary}
              leftIcon="convertShape"
              leftIconSize={20}
            />
            <Button
              className="flex space-x-1"
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
      </div>
    </Card>
  );
};

export default Users;
