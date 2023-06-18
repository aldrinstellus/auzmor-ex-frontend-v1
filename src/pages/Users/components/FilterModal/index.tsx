import React, { ReactNode, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize } from 'components/Input';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import clsx from 'clsx';

export interface IFilterModalProps {
  showModal: boolean;
  setUserStatus: (status: string) => void;
  closeModal: () => void;
  setShowFilterModal: (flag: boolean) => void;
  setPeopleFilters?: any; // for future filters
  page?: number;
  userStatus: string;
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

const FilterModal: React.FC<IFilterModalProps> = ({
  page = 1,
  showModal,
  closeModal,
  setShowFilterModal,
  setUserStatus,
  setPeopleFilters,
  userStatus,
}) => {
  const { control, handleSubmit, getValues } = useForm({
    mode: 'onChange',
  });

  const close = () => {
    closeModal();
    setUserStatus('');
  };

  const onSubmit = () => {
    const status = getValues().status;
    setUserStatus(status);
    closeModal();
  };

  const radioDivStyles = useMemo(
    () =>
      clsx({
        'hover:bg-green-50 cursor-pointer': true,
      }),
    [],
  );

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

  const statusFiltersListNode = <Layout fields={fields} />;

  const filterNavigation = [
    {
      label: 'Location',
      icon: '',
      key: 'location-filters',
      component: <div>General Settings Page</div>,
      disabled: true,
      hidden: false,
      search: true,
      dataTestId: 'people-filterby-location',
    },
    {
      label: 'Departments',
      icon: '',
      key: 'departments-filters',
      component: <div>User Management Settings Page</div>,
      disabled: true,
      hidden: false,
      search: true,
      dataTestId: 'people-filterby-department',
    },
    {
      label: 'Status',
      icon: '',
      key: 'status-filters',
      component: statusFiltersListNode,
      disabled: false,
      hidden: false,
      search: false,
      dataTestId: 'people-filterby-status',
    },
    {
      label: 'Reports to me',
      icon: '',
      key: 'reporting-filters',
      component: <div>Hello</div>,
      disabled: true,
      hidden: false,
      search: true,
      dataTestId: 'people-filterby-reportstome',
    },
  ];

  const [activeFilter, setActiveFilter] = useState<IFilters>(
    filterNavigation[2], // change this to 0 when other fields are ready
  );
  return (
    <div>
      <Modal open={showModal} closeModal={close} className="max-w-3xl">
        {/* Body */}
        <Header
          title="Filter by"
          onClose={close}
          closeBtnDataTestId="close-filters"
        />

        {/* Body */}
        <form>
          <div className="flex w-full">
            <div className="flex flex-col w-1/3 pb-64 border-r-2 border-r-neutral-200">
              <div className="border-b-2 border-b-bg-neutral-200">
                {filterNavigation.map((item, index) => (
                  <div
                    key={item.key}
                    className={
                      item.disabled
                        ? 'hover:cursor-not-allowed bg-neutral-100'
                        : 'hover:bg-green-50 cursor-pointer'
                    }
                    onClick={() => setActiveFilter(item)}
                    data-testid={item?.dataTestId}
                  >
                    <div className="text-neutral-500 text-sm font-medium p-4 flex items-center gap-x-3">
                      {item.label}
                    </div>
                    {index !== filterNavigation.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3">
              {activeFilter.search && (
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
              )}
              {activeFilter.component}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Clear Fiters"
            variant={ButtonVariant.Secondary}
            onClick={close}
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

export default FilterModal;
