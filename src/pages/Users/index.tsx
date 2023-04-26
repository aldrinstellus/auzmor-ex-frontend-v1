import React, { useRef, useState } from 'react';
import {
  Button,
  Variant,
  Type,
} from '@auzmorui/component-library.components.button';
import * as yup from 'yup';
import UserCard from '../../components/UserCard';
import TabSwitch from '../../components/TabSwitch';
import { userList } from '../../components/mockUtils';
import { useUsers } from 'queries/users';
import UserInvite from 'components/UserInvite';
import Modal from 'components/Modal';
import AddUsers from 'components/AddUsers';
import Filter from '../../images/filter.svg';
import ArrowSwap from '../../images/arrow-swap.svg';

interface IUsersProps {}

const tabs = [
  {
    label: 'People',
  },
  {
    label: 'Teams',
  },
];

const footerMapDeleteButtons = [
  {
    id: 1,
    label: 'Cancel',
    disabled: false,
    className: '!py-2 !px-4 !text-neutral-900 !bg-white !rounded-[24px] border',
    onClick: () => {},
  },
  {
    id: 2,
    label: 'Delete',
    disabled: true,
    className: '!py-2 !px-4 !bg-red-500 !text-white !rounded-[24px] border',
  },
];

const Users: React.FC<IUsersProps> = () => {
  const { data, isLoading } = useUsers({});
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const footerMapButtons = [
    {
      id: 1,
      label: 'Cancel',
      disabled: false,
      className:
        '!py-2 !px-4 !text-neutral-900 !bg-white !rounded-[24px] border',
      onClick: () => {},
    },
    {
      id: 2,
      label: 'Send Invite',
      disabled: false,
      className:
        '!py-2 !px-4 !bg-primary-500 !text-white !rounded-[24px] border',
      onClick: () => {},
    },
  ];

  if (isLoading) {
    return <div>Loader...</div>;
  }

  return (
    <div className="bg-white px-8 py-9 rounded-9xl">
      <div className="flex justify-between">
        <span className="text-2xl font-bold">People Hub</span>
        <div className="flex">
          <UserInvite />
          <Button
            className="flex mr-2"
            label="View Organization Chart"
            variant={Variant.Secondary}
            leftIcon="people"
          />
          <Button
            className="flex"
            label="Add People"
            leftIcon="people"
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>
      </div>
      <Modal
        className="w-[50%]"
        open={open}
        setOpen={setOpen}
        title="Invite new people to your organization"
        body={<AddUsers />}
        footer={
          <div className="flex justify-end items-center h-16 p-6">
            {footerMapButtons.map((type) => (
              <div className="mr-4" key={type.id}>
                <Button
                  label={type.label}
                  variant={Variant.Secondary}
                  disabled={type.disabled}
                  className={type.className}
                  type={Type.Submit}
                />
              </div>
            ))}
          </div>
        }
      />

      <Modal
        className="w-[364px] h-[226x] flex items-center justify-center"
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete User?"
        body={
          <div className="font-medium text-sm text-neutral-500 not-italic mx-6 my-6">
            Are you sure you want to delete this member? This cannot be undone.
          </div>
        }
        footer={
          <div className="flex justify-end items-center mr-6 py-4">
            {footerMapDeleteButtons.map((type) => (
              <div className="ml-3" key={type.id}>
                <Button
                  label={type.label}
                  variant={Variant.Secondary}
                  disabled={type.disabled}
                  className={type.className}
                />
              </div>
            ))}
          </div>
        }
      />

      <div className="mt-6">
        <TabSwitch tabs={tabs} />
      </div>
      <div className="flex justify-between mt-6 ">
        <div className="flex-none">
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
        <div className="order-last flex flex-row ">
          <div className="flex p-2.5   border border-solid rounded-[24px] border-neutral-200 items-center justify-center">
            <img width={16} height={16} src={Filter} />
          </div>
          <div className="flex ml-2 p-2.5  border border-solid rounded-[24px] border-neutral-200 items-center justify-center">
            <img width={16} height={16} src={ArrowSwap} />
          </div>
          <input
            type="text"
            className="rounded-[32px] border border-neutral-200 border-solid ml-2"
          />
        </div>
      </div>
      <div className="mt-6 text-neutral-500">Showing 200 results</div>
      <div className="flex flex-wrap mt-6">
        {userList.results.map((user, index) => (
          <div key={user.id} className={index % 5 !== 0 ? 'ml-6' : ''}>
            <UserCard
              key={user.id}
              name={user.name}
              image={user.image}
              designation={user.designation}
              department={user.department}
              location={user.location}
              status={user.status}
              isActive={user.active}
              setOpen={setOpenDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
