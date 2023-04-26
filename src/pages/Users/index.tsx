import React, { useRef, useState } from 'react';
import Button, { Variant } from 'components/Button';
import UserCard from '../../components/peopleHub/UserCard';
import TabSwitch from '../../components/peopleHub/TabSwitch';
import { deleteUser, useUsers } from 'queries/users';
import UserInvite from 'components/peopleHub/UserInvite';
import Modal from 'components/Modal';
import AddUsers from 'components/peopleHub/AddUsers';

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
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const [id, setId] = useState<string | null>(null);
  const { data, isLoading } = useUsers({});
  const usersData = data?.result.data;

  const formRef = useRef();

  const footerMapButtons = [
    {
      id: 1,
      label: 'Cancel',
      disabled: false,
      className:
        '!py-2 !px-4 !text-neutral-900 !bg-white !rounded-[24px] border',
      onClick: () => {
        setShowAddUserModal(false);
      },
    },
    {
      id: 2,
      label: 'Send Invite',
      disabled: false,
      className:
        '!py-2 !px-4 !bg-primary-500 !text-white !rounded-[24px] border',
      onClick: () => {
        (formRef.current as any).submitForm();
      },
    },
  ];

  const footerMapErrorModalButtons = [
    {
      id: 1,
      label: 'Cancel',
      disabled: false,
      className:
        '!py-2 !px-4 !text-neutral-900 !bg-white !rounded-[24px] border',
      onClick: () => {
        setOpenErrorModal(false);
      },
    },
    {
      id: 2,
      label: 'Try Again',
      disabled: false,
      className:
        '!py-2 !px-4 !bg-primary-500 !text-white !rounded-[24px] border',
      onClick: () => {
        setOpenErrorModal(false);
        setShowAddUserModal(true);
      },
    },
  ];

  const footerMapDeleteModalButtons = [
    {
      id: 1,
      label: 'Cancel',
      disabled: false,
      className:
        '!py-2 !px-4 !text-neutral-900 !bg-white !rounded-[24px] border',
      onClick: () => {
        setShowDeleteModal(false);
        setId(null);
      },
    },
    {
      id: 2,
      label: 'Delete',
      disabled: false,
      className: '!py-2 !px-4 !bg-red-500 !text-white !rounded-[24px] border',
      onClick: () => {
        if (id) {
          deleteUser(id).then((res: any) => {
            if (!(res.result.data[0].status === 'Success')) {
              alert('error in deleting user');
            }
          });
        }

        setShowDeleteModal(false);
        setId(null);
      },
    },
  ];
  if (isLoading) {
    return <div>Loader...</div>;
  }

  return (
    <div className="bg-white px-8 py-9 rounded-9xl w-[100%] h-[100%]">
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
              setShowAddUserModal(true);
            }}
          />
        </div>
      </div>
      <Modal
        className="max-w-[648px] w-[648px]"
        open={showAddUserModal}
        closeModal={() => setShowAddUserModal(false)}
        title="Invite new people to your organization"
        body={
          <AddUsers
            reference={formRef}
            setOpenError={setOpenErrorModal}
            setOpen={setShowAddUserModal}
          />
        }
        footer={
          <div className="flex justify-end items-center h-16 p-6">
            {footerMapButtons.map((type) => (
              <div className="mr-4" key={type.id}>
                <Button
                  label={type.label}
                  variant={Variant.Secondary}
                  disabled={type.disabled}
                  className={type.className}
                  onClick={type.onClick}
                />
              </div>
            ))}
          </div>
        }
      />

      <Modal
        className="max-w-[364px] max-h-[226x] "
        open={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        title="Delete User?"
        body={
          <div className="font-medium text-sm text-neutral-500 not-italic mx-6 my-6">
            Are you sure you want to delete this member? This cannot be undone.
          </div>
        }
        footer={
          <div className="flex justify-end items-center mr-6 py-4">
            {footerMapDeleteModalButtons.map((type) => (
              <div className="ml-3" key={type.id}>
                <Button
                  label={type.label}
                  variant={Variant.Secondary}
                  disabled={type.disabled}
                  className={type.className}
                  onClick={type.onClick}
                />
              </div>
            ))}
          </div>
        }
      />

      <Modal
        className=" max-h-[226x]  max-w-[364px]"
        open={openErrorModal}
        closeModal={() => setOpenErrorModal(false)}
        title="Error!"
        body={
          <div className="font-medium text-sm text-neutral-500 not-italic mx-6 my-6">
            Failed to add participant. Email not recognised. Please enter valid
            details.
          </div>
        }
        footer={
          <div className="flex justify-end items-center mr-6 py-4">
            {footerMapErrorModalButtons.map((type) => (
              <div className="ml-3" key={type.id}>
                <Button
                  label={type.label}
                  variant={Variant.Secondary}
                  disabled={type.disabled}
                  className={type.className}
                  onClick={type.onClick}
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
      </div>

      <div className="mt-6 text-neutral-500">Showing 200 results</div>
      <div className="flex flex-wrap mt-6">
        {usersData.length > 0 &&
          usersData.map((user: any, index: number) => (
            <div key={user.id} className={index % 5 !== 0 ? 'ml-6' : ''}>
              <UserCard
                key={user.id}
                userId={user.id}
                name={user.fullName}
                image={''}
                designation={user.designation}
                department={user.department}
                location={user.location}
                status={user.role}
                isActive={user.active}
                setOpen={setShowDeleteModal}
                setId={setId}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Users;
