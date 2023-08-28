import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import { CategoryType, useInfiniteCategories } from 'queries/apps';
import find from 'lodash/find';
import Icon from 'components/Icon';
import InfiniteFilterList from 'components/InfiniteFilterList';
import { useInfiniteTeams } from 'queries/teams';
import AvatarList from 'components/AvatarList';

export interface ITeamFilterModalProps {
  open: boolean;
  closeModal: () => void;
  setFilters: (param: any) => void;
  filters: any;
}

const AppFilterModal: React.FC<ITeamFilterModalProps> = ({
  open,
  closeModal,
  setFilters,
  filters,
}) => {
  const { handleSubmit } = useForm({
    mode: 'onChange',
  });
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [selectedTeams, setSelectedTeams] = useState<any>([]);

  const onSubmit = (value: any) => {
    closeModal();
    setFilters({
      categories: selectedCategories,
      teams: selectedTeams,
    });
  };

  useEffect(() => {
    setSelectedCategories(filters.categories);
    setSelectedTeams(filters.teams);
  }, [filters]);

  const CategoryFilterComponent = () => (
    <InfiniteFilterList
      apiCall={useInfiniteCategories} // Provide the API call function
      apiCallParams={{
        type: CategoryType.APP,
        limit: 10,
      }} // Provide the API call parameters
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
            data-testid="app-filter-category-checkbox"
            className="h-4 w-4 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600 outline-neutral-500"
            checked={find(selectedCategories, item)}
          ></input>
          <span className="ml-3 text-xs font-medium">{item?.name}</span>
        </>
      )}
    />
  );

  const TeamFilterComponent = () => (
    <InfiniteFilterList
      apiCall={useInfiniteTeams} // Provide the API call function
      apiCallParams={{
        limit: 10,
      }} // Provide the API call parameters
      searchProps={{
        placeholder: 'Search',
        dataTestId: 'app-filter-team-search',
        isClearable: true,
      }}
      setSelectedItems={setSelectedTeams}
      selectedItems={selectedTeams}
      renderItem={(item) => (
        <>
          <input
            type="checkbox"
            data-testid="app-filter-team-checkbox"
            className="h-4 w-4 rounded-xl flex-shrink-0 cursor-pointer accent-primary-600 border-2 border-b-bg-neutral-200"
            checked={find(selectedTeams, item)}
          ></input>
          <div className="ml-3 w-full text-xs flex justify-between items-center">
            <div className="flex gap-2 items-center">
              {item.recentMembers?.length !== 0 && (
                <AvatarList
                  size={24}
                  users={item.recentMembers.map((member: any) => ({
                    ...member,
                    image: member.profileImage?.medium,
                  }))}
                  moreCount={item.totalMembers}
                  className=""
                  dataTestId="teams-people-icon"
                />
              )}
              <span className="font-bold text-sm line-clamp-1">
                {item?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-neutral-500">
              <div>{item.category?.name}</div>
              <div className="bg-neutral-500 rounded-full w-1 h-1" />
              <div className="flex items-center justify-center space-x-1">
                <Icon name="profileUserOutline" hover={false} size={16} />
                <div
                  className="text-xs font-normal whitespace-nowrap"
                  data-testid={`team-no-of-members-${item.totalMembers}`}
                >
                  {item.totalMembers} members
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      noResultsMessage="No Teams Found"
    />
  );

  const filterNavigation = [
    {
      label: 'Categories',
      icon: '',
      key: 'category-filters',
      disabled: false,
      hidden: false,
      search: true,
      dataTestId: 'app-filter-category',
    },
    {
      label: 'Team',
      icon: '',
      key: 'team-filters',
      disabled: false,
      hidden: false,
      search: true,
      dataTestId: 'app-filter-teams',
    },
  ];

  const [activeFilter, setActiveFilter] = useState(filterNavigation[0]);

  return (
    <div>
      <Modal open={open} closeModal={close} className="max-w-[665px]">
        <Header
          title="Filter By"
          onClose={() => closeModal()}
          closeBtnDataTestId="app-filter-close"
        />
        <div className="flex w-full">
          <div className="flex flex-col w-1/3 pb-64 border-r-2 border-r-neutral-200">
            {filterNavigation.map((item, index) => (
              <div
                key={item.key}
                onClick={() => setActiveFilter(item)}
                data-testid={item?.dataTestId}
                className="cursor-pointer border-b-1 border-b-bg-neutral-200"
              >
                <div
                  className={`${
                    activeFilter.key === item.key &&
                    'text-primary-500 bg-primary-50'
                  } text-sm font-medium p-4`}
                >
                  {item.label}
                </div>
                {index !== filterNavigation.length - 1 && <Divider />}
              </div>
            ))}
          </div>
          <div className="w-2/3 py-4 px-2">
            {activeFilter.key === 'category-filters' ? (
              <CategoryFilterComponent />
            ) : (
              <TeamFilterComponent />
            )}
          </div>
        </div>
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Clear Filters"
            variant={ButtonVariant.Secondary}
            onClick={() => {
              setSelectedCategories([]);
              setSelectedTeams([]);
              setFilters({ categories: [], teams: [] });
              closeModal();
            }}
            className="mr-4"
            dataTestId="app-filter-clear-filter"
          />
          <Button
            label="Apply"
            variant={ButtonVariant.Primary}
            type={Type.Submit}
            onClick={handleSubmit(onSubmit)}
            className="mr-4"
            dataTestId="app-filter-apply"
          />
        </div>
      </Modal>
    </div>
  );
};

export default AppFilterModal;
