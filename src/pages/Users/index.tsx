import React, { useEffect, useRef, useState } from 'react';
import Button, { Size, Variant } from 'components/Button';
import UserCard from './components/UserCard';
import TabSwitch from './components/TabSwitch';
import { useUsers } from 'queries/users';
import UserInvite from 'pages/Users/components/UserInvite';
import Modal from 'components/Modal';
import AddUsers from 'pages/Users/components/AddUsers';
import ConfirmationBox from 'components/ConfirmationBox';
import Card from 'components/Card';
// import Layout, { FieldType } from 'components/Form';
// import { useForm } from 'react-hook-form';
import Filter from 'images/filter.svg';
import Spinner from 'components/Spinner';
import TablePagination from 'components/TablePagination';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(10);
  const { data, isLoading, isError } = useUsers({
    limit: 30,
    // prev: currentPage - 1,
    // next: currentPage + 1,
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const usersData = data?.result.data;
  const [buttonState, setButtonState] = useState(true);

  const formRef = useRef();

  // const {
  //   control,
  //   formState: { errors, isValid },
  // } = useForm({
  //   mode: 'onChange',
  // });

  const handlePageClick = (event: any) => {
    setCurrentPage(event?.selected + 1);
  };

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

  // ! Re redering issue
  useEffect(() => {
    setLimitPerPage(data?.result?.paging?.limit);
  }, [data]);

  return (
    <>
      <Card className="px-8 py-9 w-full h-fit">
        {/* Top People Directory Section */}
        <div className="space-y-7">
          <div className="flex justify-between">
            <div className="text-2xl font-bold">People Hub</div>
            <div className="flex space-x-2">
              <UserInvite />
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
                <img src={Filter} alt="filter" width={11.47} height={13.2} />
              </div>
              <div className="border border-solid border-neutral-200 p-[10px] rounded-17xl">
                <img src={Filter} alt="filter" width={11.47} height={13.2} />
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
            Showing {usersData?.length} results
          </div>
          <div className="flex flex-wrap gap-6">
            {usersData?.length > 0 &&
              usersData?.map((user: any) => (
                <UserCard key={user.id} {...user} />
              ))}
            {isLoading && <Spinner />}
          </div>
          <TablePagination
            onPageChange={handlePageClick}
            total={data?.result?.totalCount}
            limit={limitPerPage}
          />
        </div>
      </Card>
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
    </>
  );
};

export default Users;
