import React, { useEffect, useState } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import { CategoryType, useInfiniteCategories } from 'queries/apps';
import { useDebounce } from 'hooks/useDebounce';
import InfiniteFilterList from 'components/InfiniteFilterList';
import { find } from 'lodash';

export interface ITeamFilterModalProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  filters: { categories: [] };
  setFilters: (param: any) => void;
}

const TeamFilterModal: React.FC<ITeamFilterModalProps> = ({
  open,
  openModal,
  closeModal,
  filters,
  setFilters,
}) => {
  const { handleSubmit } = useForm({
    mode: 'onChange',
  });
  const [selectedCategories, setSelectedCategories] = useState<any>([]);

  const onSubmit = () => {
    setFilters({
      categories: selectedCategories,
    });
    closeModal();
  };

  useEffect(() => {
    setSelectedCategories(filters.categories);
  }, [filters]);

  const CategoryFilter = () => (
    <InfiniteFilterList
      apiCall={useInfiniteCategories}
      apiCallParams={{
        type: CategoryType.TEAM,
        limit: 10,
      }}
      searchProps={{
        placeholder: 'Search',
        dataTestId: 'teams-category-search',
        isClearable: true,
      }}
      setSelectedItems={setSelectedCategories}
      selectedItems={selectedCategories}
      showSelectedFilterPill
      renderItem={(item) => (
        <>
          <input
            type="checkbox"
            data-testid={`select-'${item.name}'`}
            className="h-4 w-4 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600 outline-neutral-500"
            checked={find(selectedCategories, item)}
          ></input>
          <span className="ml-3 text-xs font-medium">{item?.name}</span>
        </>
      )}
    />
  );

  const filterNavigation = [
    {
      label: 'Category',
      icon: '',
      key: 'category-filters',
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
          closeBtnDataTestId="close-filter"
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
          <div className="w-2/3 py-4 px-2">
            {activeFilter.key === 'category-filters' && <CategoryFilter />}
          </div>
        </div>
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Clear Filters"
            variant={ButtonVariant.Secondary}
            onClick={() => {
              setSelectedCategories([]);
              setFilters({ categories: [] });
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
