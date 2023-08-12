import React, { ReactNode, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize } from 'components/Input';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import clsx from 'clsx';

export interface IPeopleFilterModalProps {
  open: boolean;
  setUserStatus?: (status: string) => void;
  openModal: () => void;
  closeModal: () => void;
  userStatus?: string;
}

interface IFilters {
  label: string;
  icon: string;
  key: string;
  component: ReactNode;
  disabled: boolean;
  hidden: boolean;
  search: boolean;
}

const PeopleFilterModal: React.FC<IPeopleFilterModalProps> = ({
  open,
  openModal,
  closeModal,
  setUserStatus,
  userStatus,
}) => {
  const { control, handleSubmit, getValues } = useForm({
    mode: 'onChange',
  });

  const onSubmit = () => {
    if (!!!getValues().status) {
      closeModal();
      return;
    }
    const status = getValues().status;
    setUserStatus && setUserStatus(status);
    closeModal();
  };

  const fields = [
    {
      type: FieldType.Radio,
      control,
      name: 'status',
      radioList: [
        {
          options: { value: 'INVITED', label: 'Invited' },
          name: 'invited',
          isChecked: userStatus === 'INVITED',
        },
        {
          options: { value: 'ACTIVE', label: 'Active' },
          name: 'active',
          isChecked: userStatus === 'ACTIVE',
        },
        {
          options: { value: 'ALL', label: 'All' },
          name: 'all',
          isChecked: userStatus === 'ALL',
        },
      ],
    },
  ];

  const filterNavigation = [
    // {
    //   label: 'Location',
    //   icon: '',
    //   key: 'location-filters',
    //   component: <div>General Settings Page</div>,
    //   disabled: true,
    //   hidden: false,
    //   search: true,
    //   dataTestId: 'people-filterby-location',
    // },
    // {
    //   label: 'Departments',
    //   icon: '',
    //   key: 'departments-filters',
    //   component: <div>User Management Settings Page</div>,
    //   disabled: true,
    //   hidden: false,
    //   search: true,
    //   dataTestId: 'people-filterby-department',
    // },
    {
      label: 'Status',
      icon: '',
      key: 'status-filters',
      component: <Layout fields={fields} />,
      disabled: false,
      hidden: false,
      search: false,
      dataTestId: 'people-filterby-status',
    },
    // {
    //   label: 'Reports to me',
    //   icon: '',
    //   key: 'reporting-filters',
    //   component: <div>Hello</div>,
    //   disabled: true,
    //   hidden: false,
    //   search: true,
    //   dataTestId: 'people-filterby-reportstome',
    // },
  ];

  const [activeFilter, setActiveFilter] = useState<IFilters>(
    filterNavigation[0],
  );

  return (
    <div>
      <Modal open={open} closeModal={close} className="max-w-[665px]">
        <Header
          title="Filter By"
          onClose={() => closeModal()}
          closeBtnDataTestId="close-filters"
        />

        <form>
          <div className="flex w-full">
            <div className="flex flex-col w-1/3 pb-64 border-r-2 border-r-neutral-200">
              <div className="border-b-2 border-b-bg-neutral-200">
                {filterNavigation.map((item, index) => (
                  <div
                    key={item.key}
                    onClick={() => setActiveFilter(item)}
                    data-testid={item?.dataTestId}
                  >
                    <div className="text-primary-500 bg-primary-50 text-sm font-medium p-4">
                      {item.label}
                    </div>
                    {index !== filterNavigation.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-2/3">{activeFilter.component}</div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Clear Filters"
            variant={ButtonVariant.Secondary}
            onClick={() => {
              setUserStatus && setUserStatus('');
              closeModal();
            }}
            className="mr-4"
            dataTestId="clear-filters"
          />
          <Button
            label="Apply"
            variant={ButtonVariant.Primary}
            onClick={handleSubmit(onSubmit)}
            className="mr-4"
            dataTestId="apply-filter"
          />
        </div>
      </Modal>
    </div>
  );
};

export default PeopleFilterModal;
