import FilterModal, {
  FilterModalVariant,
  IBypeople,
  IRole,
  IStatus,
} from 'components/FilterModal';
import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import Sort from 'components/Sort';
import useModal from 'hooks/useModal';
import { FC, ReactNode, useEffect } from 'react';
import { Variant as InputVariant, Size as InputSize } from 'components/Input';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { UseFormReturn } from 'react-hook-form';
import useURLParams from 'hooks/useURLParams';
import Icon from 'components/Icon';
import { ICategory, ITeam, IDepartmentAPI, ILocationAPI } from 'interfaces';
import { useTranslation } from 'react-i18next';
import { channelRequestStatusData } from 'components/FilterModal/ChannelRequestStatus';

export enum FilterKey {
  departments = 'departments',
  locations = 'locations',
  status = 'status',
  roles = 'roles',
  categories = 'categories',
  teams = 'teams',
  byPeople = 'byPeople',
}

interface IFilterMenu {
  children: ReactNode;
  filterForm: UseFormReturn<
    {
      search: string;
      [key: string]: any;
    },
    any
  >;
  searchPlaceholder?: string;
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
  dataTestIdSearch?: string;
  variant?: FilterModalVariant;
}

const FilterMenu: FC<IFilterMenu> = ({
  children,
  filterForm,
  searchPlaceholder,
  dataTestIdSort,
  dataTestIdFilter,
  dataTestIdSearch,
  variant,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const {
    filters,
    setFilters,
    clearFilters: clearAppliedFilters,
  } = useAppliedFiltersStore();
  const { control, getValues, formState } = filterForm;
  const { parseParams, updateParam, serializeFilter, deleteParam } =
    useURLParams();
  const { t } = useTranslation('common');
  const { t: tf } = useTranslation('filterModal');
  const defaultChannelRequestStatus =
    variant === FilterModalVariant.ChannelRequest
      ? [channelRequestStatusData[1]]
      : [];
  useEffect(() => {
    setFilters({
      categories: parseParams('categories') || [],
      channels: parseParams('channels') || [],
      departments: parseParams('departments') || [],
      locations: parseParams('locations') || [],
      status: parseParams('status') || [],
      teams: parseParams('teams') || [],
      visibility: parseParams('visibility') || [],
      channelType: parseParams('channelType') || [],
      byPeople: parseParams('byPeople') || [],
      roles: parseParams('roles') || [],
      channelRequestStatus:
        parseParams('channelRequestStatus') || defaultChannelRequestStatus,
    });
    return () => {
      // Clear URL parameters on unmount
      clearAppliedFilters();
    };
  }, []);

  useEffect(() => {
    if (filters) {
      Object.keys(filters).forEach((key: string) => {
        if (!!filters[key] && filters[key].length === 0) {
          deleteParam(key);
        } else {
          if (typeof filters[key] === 'object') {
            const serializedFilters = serializeFilter(filters[key]);
            updateParam(key, serializedFilters);
          } else {
            updateParam(key, filters[key]);
          }
        }
      });
    }
  }, [filters]);

  const handleRemoveFilters = (key: FilterKey, id: any) => {
    if (filters) {
      const updatedFilter = filters[key]!.filter((item: any) => item.id !== id);
      const serializedFilters = serializeFilter(updatedFilter);
      if (updatedFilter.length === 0) {
        deleteParam(key);
      } else {
        updateParam(key, serializedFilters);
      }
      setFilters({ ...filters, [key]: updatedFilter });
    }
  };
  const clearFilters = () => {
    deleteParam('channelRequestStatus');
    deleteParam('status');
    deleteParam('roles');
    deleteParam('departments');
    deleteParam('locations');
    deleteParam('teams');
    deleteParam('categories');
    deleteParam('channelType');
    deleteParam('byPeople');
    deleteParam('channels');
    setFilters({
      ...filters,
      categories: [],
      channelRequestStatus: defaultChannelRequestStatus,
      status: [],
      roles: [],
      departments: [],
      locations: [],
      teams: [],
      byPeople: [],
      visibility: [],
      channeType: [],
      channels: [],
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>{children}</div>
          <div className="flex space-x-2 justify-center items-center relative">
            <IconButton
              onClick={openFilterModal}
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white !p-[10px] !outline-none"
              dataTestId={dataTestIdFilter}
            />
            <Sort
              controlled
              setFilter={(sortValue) => {
                setFilters({ sort: sortValue });
              }}
              filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
              selectedValue={filters ? filters.sort : ''}
              filterValue={{ asc: 'ASC', desc: 'DESC' }}
              entity={'CHANNEL'}
              dataTestId={dataTestIdSort}
            />
            <div>
              <Layout
                fields={[
                  {
                    type: FieldType.Input,
                    variant: InputVariant.Text,
                    size: InputSize.Small,
                    leftIcon: 'search',
                    control,
                    getValues,
                    name: 'search',
                    placeholder: searchPlaceholder || t('search'),
                    error: formState.errors.search?.message,
                    dataTestId: dataTestIdSearch,
                    inputClassName: 'py-[7px] !text-sm !h-9',
                    isClearable: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        {filters?.status?.length ||
        filters?.roles?.length ||
        filters?.departments?.length ||
        filters?.categories?.length ||
        filters?.locations?.length ||
        filters?.byPeople?.length ||
        filters?.teams?.length ? (
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <div className="text-base text-neutral-500 whitespace-nowrap">
                {tf('title')}
              </div>
              {filters?.status?.map((status: IStatus) => (
                <div
                  key={status.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`status-filterby-${status.name}`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.status, status.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('status')}
                    <span className=" ml-1 text-primary-500">
                      {status.name}
                    </span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.status, status.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
              {filters?.byPeople?.map((people: IBypeople) => (
                <div
                  key={people.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`status-filterby-${people.name}`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.byPeople, people.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('byPeople')}

                    <span className="  ml-1 text-primary-500">
                      {people.name}
                    </span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.byPeople, people.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}

              {filters?.teams?.map((team: ITeam) => (
                <div
                  key={team.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`status-filterby-${team.name}`}
                  onClick={() => handleRemoveFilters(FilterKey.teams, team.id)}
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('team')}

                    <span className=" ml-1 text-primary-500">{team.name}</span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.teams, team.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
              {filters?.roles?.map((role: IRole) => (
                <div
                  key={role.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`role-filterby-${role.name}`}
                  onClick={() => handleRemoveFilters(FilterKey.roles, role.id)}
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('role')}
                    <span className=" ml-1 text-primary-500">{role.name}</span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.roles, role.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
              {filters?.departments?.map((department: IDepartmentAPI) => (
                <div
                  key={department.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`department-filterby-${department.name}`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.departments, department.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('department')}

                    <span className="ml-1 text-primary-500">
                      {department.name}
                    </span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.departments, department.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
              {filters?.categories?.map((categories: ICategory) => (
                <div
                  key={categories.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`department-filterby-${categories.name}`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.categories, categories.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('category')}

                    <span className="ml-1 text-primary-500">
                      {categories.name}
                    </span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.categories, categories.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
              {filters?.locations?.map((location: ILocationAPI) => (
                <div
                  key={location.id}
                  className="border border-neutral-200 rounded-7xl px-3 py-1 flex bg-white capitalize text-sm font-medium items-center mr-1 hover:text-primary-600 hover:border-primary-600 cursor-pointer group"
                  data-testid={`location-filterby-${location.name}`}
                  onClick={() =>
                    handleRemoveFilters(FilterKey.locations, location.id)
                  }
                >
                  <div className="mr-1 text-neutral-500 whitespace-nowrap">
                    {tf('location')}
                    <span className="ml-1 text-primary-500">
                      {location.name}
                    </span>
                  </div>
                  <Icon
                    name="close"
                    size={16}
                    color="text-neutral-900"
                    className="cursor-pointer"
                    onClick={() =>
                      handleRemoveFilters(FilterKey.locations, location.id)
                    }
                    dataTestId={`applied-filter-close`}
                  />
                </div>
              ))}
            </div>
            <div
              className="text-neutral-500 border px-3 py-[3px] whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
              onClick={clearFilters}
              data-testid={`people-clear-filters`}
            >
              {tf('clearFilters')}
            </div>
          </div>
        ) : null}
      </div>
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={{
            categories: filters?.categories || [],
            departments: filters?.departments || [],
            locations: filters?.locations || [],
            status: filters?.status || [],
            teams: filters?.teams || [],
            roles: filters?.roles || [],
            visibility: filters?.visibility || [],
            channelType: filters?.channelType || [],
            byPeople: filters?.byPeople || [],
            channels: filters?.channels || [],
            channelRequestStatus:
              filters?.channelRequestStatus || defaultChannelRequestStatus,
          }}
          onApply={(appliedFilters) => {
            setFilters(appliedFilters);
            closeFilterModal();
          }}
          onClear={() => {
            setFilters({
              categories: [],
              departments: [],
              locations: [],
              status: [],
              teams: [],
              roles: [],
              visibility: [],
              channelType: [],
              byPeople: [],
              channels: [],
              channelRequestStatus: defaultChannelRequestStatus,
            });
            closeFilterModal();
          }}
          variant={variant || FilterModalVariant.ChannelsListing}
        />
      )}
    </>
  );
};

export default FilterMenu;
