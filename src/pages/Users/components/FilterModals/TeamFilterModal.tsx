import React, { ReactNode, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import { Size as InputSize, Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Popover from 'components/Popover';
import Divider from 'components/Divider';
import { CategoryType, useInfiniteCategories } from 'queries/apps';
import { isFiltersEmpty } from 'utils/misc';
import { useDebounce } from 'hooks/useDebounce';

export interface ITeamFilterModalProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const TeamFilterModal: React.FC<ITeamFilterModalProps> = ({
  open,
  openModal,
  closeModal,
}) => {
  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange',
  });
  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data, isLoading, isError } = useInfiniteCategories(
    isFiltersEmpty({
      q: debouncedSearchValue.toLowerCase().trim(),
      type: CategoryType.TEAM,
      limit: 10,
    }),
  );

  const categoriesData = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((category: any) => {
      try {
        return category;
      } catch (e) {
        console.log('Error', { category });
      }
    });
  });

  const onSubmit = (value: any) => {
    closeModal();
  };

  // const categoryData = [
  //   {
  //     label: 'DEPARTMENT',
  //     id: '64d4a97b629f3f97e9625b63',
  //   },
  //   {
  //     label: 'LOCATION',
  //     id: '64d4a773155d56c3df2c9c3f',
  //   },
  // ];

  const filterNavigation = [
    {
      label: 'Category',
      icon: '',
      key: 'category-filters',
      component: (
        <>
          <Layout
            fields={[
              {
                type: FieldType.Input,
                variant: InputVariant.Text,
                size: InputSize.Small,
                leftIcon: 'search',
                control,
                name: 'search',
                placeholder: 'Search Category',
                dataTestId: 'teams-category-search',
                isClearable: true,
              },
            ]}
          />
          {/* {categoriesData?.length === 0 && <div>No category Found</div>} */}
        </>
      ),
      disabled: false,
      hidden: false,
      search: true,
      dataTestId: 'teams-filterby-category',
    },
  ];

  const [activeFilter, setActiveFilter] = useState(filterNavigation[0]);

  return (
    <div>
      <Modal open={open} closeModal={close} className="max-w-[665px]">
        <Header
          title="Filter By"
          onClose={() => closeModal()}
          closeBtnDataTestId="close-filters"
        />
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
          <div className="w-2/3 py-4 px-2">{activeFilter.component}</div>
        </div>
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Clear Filters"
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
            type={Type.Submit}
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
