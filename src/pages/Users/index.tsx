import React, { useState } from 'react';
import { Button, Variant } from '@auzmorui/component-library.components.button';
import UserCard from '../../components/UserCard';
import TabSwitch from '../../components/TabSwitch';
import { userList, tabs } from '../../components/mockUtils';
interface IUsersProps { }

const Users: React.FC<IUsersProps> = () => {
  return (
    <div className="bg-white pt-8 pl-20 pr-8">
      <div className="pb-8">
        <div className="flex mb-9 justify-between">
          <h3 className="text-2xl">People Hub</h3>
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
        <div>
          <TabSwitch tabs={tabs} />
        </div>
        <div className="flex mb-6">
          <Button
            label="My Teams"
            variant={Variant.Secondary}
            className="mr-4"
          />
          <Button
            label="All Members"
            variant={Variant.Secondary}
            className="mr-4"
          />
        </div>
        <div className="mb-6">Showing 200 results</div>
        <div className="flex flex-wrap">
          {userList.results.map((user) => (
            <UserCard key={user.id} name={user.name} image={user.image} designation={user.designation} department={user.department} location={user.location} status={user.status} isActive={user.active} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
