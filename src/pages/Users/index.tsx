import React, { useRef, useState } from 'react';
import Button, { Variant } from 'components/Button';
import UserCard from './components/UserCard';
import TabSwitch from './components/TabSwitch';
import { useUsers } from 'queries/users';
import UserInvite from 'pages/Users/components/UserInvite';
import Modal from 'components/Modal';
import AddUsers from 'pages/Users/components/AddUsers';
import ConfirmationBox from 'components/ConfirmationBox';

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
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const { data, isLoading } = useUsers({});
  const usersData = data?.result.data;
  const [buttonState, setButtonState] = useState(true);

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
      disabled: buttonState,
      className: `!py-2 !px-4 !rounded-[24px] border ${
        buttonState
          ? 'bg-gray-200 !text-neutral-400'
          : '!bg-primary-500 !text-white '
      }`,
      onClick: () => {
        (formRef.current as any).submitForm();
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
            leftIcon="convertShape"
          />
          <Button
            className="flex"
            label="Add People"
            leftIcon="add"
            onClick={() => {
              setShowAddUserModal(true);
            }}
          />
        </div>
      </div>
      <Modal
        open={showAddUserModal}
        closeModal={() => setShowAddUserModal(false)}
      >
        {`Invite new people to your organization`}
        {
          <AddUsers
            reference={formRef}
            setOpenError={setOpenErrorModal}
            setOpen={setShowAddUserModal}
            setButtonState={setButtonState}
          />
        }
        {
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
      </Modal>

      <ConfirmationBox
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        title="Error!"
        description={
          <span>
            Failed to add participant. Email not recognised.
            <br /> Please enter valid details.
          </span>
        }
        success={{
          label: 'Try Again',
          className: 'bg-primary-500 text-white ',
          onSubmit: () => {
            setOpenErrorModal(false);
            setShowAddUserModal(true);
          },
        }}
        discard={{
          label: 'cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: () => {
            setOpenErrorModal(false);
          },
        }}
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

      <div className="mt-6 text-neutral-500">
        Showing {usersData.length} results
      </div>
      <div className="flex flex-wrap mt-6">
        {usersData.length > 0 &&
          usersData.map((user: any, index: number) => (
            <div key={user.id} className={index % 5 !== 0 ? 'ml-6' : ''}>
              <UserCard key={user.id} {...user} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Users;
