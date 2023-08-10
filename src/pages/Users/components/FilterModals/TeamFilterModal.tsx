import React, { ReactNode, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize } from 'components/Input';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import clsx from 'clsx';

export interface ITeamFilterModalProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
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

const TeamFilterModal: React.FC<ITeamFilterModalProps> = ({
  open,
  openModal,
  closeModal,
}) => {
  const { control, handleSubmit, getValues } = useForm({
    mode: 'onChange',
  });

  const onSubmit = () => {
    // logic to send the value to react query
    closeModal();
  };

  const filterNavigation = [
    {
      label: 'Category',
      icon: '',
      key: 'category-filters',
      component: (
        <div>Categories in checkbox with the filters label and search bar</div>
      ),
      disabled: false,
      hidden: false,
      search: true,
      dataTestId: 'people-filterby-location',
    },
  ];

  const [activeFilter, setActiveFilter] = useState<IFilters>(
    filterNavigation[0], // change this to 0 when other fields are ready
  );

  return (
    <div>
      <Modal open={open} closeModal={close} className="max-w-3xl">
        {/* Body */}
        <Header
          title="Filter by"
          onClose={() => closeModal()}
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
                    <div className="text-primary-500 text-sm font-medium p-4 flex items-center gap-x-3">
                      {item.label}
                    </div>
                    {index !== filterNavigation.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3 py-4 px-2">
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
                        placeholder: 'Search catagories',
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
            onClick={() => {
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

export default TeamFilterModal;
