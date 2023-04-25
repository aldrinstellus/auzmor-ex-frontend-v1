import React, { useState } from 'react';
import Button, { Variant } from 'components/Button';
import UserCard from '../../components/UserCard';
import TabSwitch from '../../components/TabSwitch';
import { userList } from '../../components/mockUtils';
import { useUsers } from 'queries/users';

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
  const { data, isLoading } = useUsers({});

  if (isLoading) {
    return <div>Loader...</div>;
  }

  console.log(data?.results);

  return (
    <div className="bg-white px-8 py-9 rounded-9xl">
      <div className="flex justify-between">
        <span className="text-2xl font-bold">People Hub</span>
        <div className="flex">
          <Button
            className="flex mr-2"
            label="View Organization Chart"
            variant={Variant.Secondary}
            leftIcon="people"
          />
          <Button className="flex" label="Add People" leftIcon="people" />
        </div>
      </div>
      <div className="mt-6">
        <TabSwitch tabs={tabs} />
      </div>
      <div className="flex mt-6">
        <Button label="My Teams" variant={Variant.Secondary} className="mr-4" />
        <Button
          label="All Members"
          variant={Variant.Secondary}
          className="mr-4"
        />
      </div>
      <div className="mt-6 text-neutral-500">Showing 200 results</div>
      <div className="flex flex-wrap mt-6">
        {userList.results.map((user) => (
          <div key={user.id} className="mr-6">
            <UserCard
              key={user.id}
              name={user.name}
              image={user.image}
              designation={user.designation}
              department={user.department}
              location={user.location}
              status={user.status}
              isActive={user.active}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
