import FilterModal, { IStatus } from 'components/FilterModal';
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
import { IDepartmentAPI } from 'queries/department';
import { ILocationAPI } from 'queries/location';

export enum FilterKey {
  departments = 'departments',
  locations = 'locations',
  status = 'status',
}

interface IFilterMenu {
  children: ReactNode;
  filterForm: UseFormReturn<
    {
      search: string;
    },
    any
  >;
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
  dataTestIdSearch?: string;
}

const FilterMenu: FC<IFilterMenu> = ({
  children,
  filterForm,
  dataTestIdSort,
  dataTestIdFilter,
  dataTestIdSearch,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters } = useAppliedFiltersStore();
  const { control, getValues, formState } = filterForm;
  const { parseParams, updateParam, serializeFilter, deleteParam } =
    useURLParams();

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

  useEffect(() => {
    setFilters({
      categories: parseParams('categories') || [],
      departments: parseParams('departments') || [],
      locations: parseParams('locations') || [],
      status: parseParams('status') || [],
      teams: parseParams('teams') || [],
    });
  }, []);

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
    deleteParam('status');
    deleteParam('departments');
    deleteParam('locations');
    deleteParam('teams');
    deleteParam('categories');
    setFilters({
      ...filters,
      categories: [],
      status: [],
      departments: [],
      locations: [],
      teams: [],
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <div>{children}</div>
          <div className="flex space-x-2 justify-center items-center relative">
            <IconButton
              onClick={openFilterModal}
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white !p-[10px]"
              dataTestId={dataTestIdFilter}
            />
            <Sort
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
                    placeholder: 'Search members',
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
        filters?.departments?.length ||
        filters?.locations?.length ? (
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <div className="text-base text-neutral-500 whitespace-nowrap">
                Filter By
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
                    Status{' '}
                    <span className="text-primary-500">{status.name}</span>
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
                    Department{' '}
                    <span className="text-primary-500">{department.name}</span>
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
                    Location{' '}
                    <span className="text-primary-500">{location.name}</span>
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
              Clear Filters
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
            });
            closeFilterModal();
          }}
        />
      )}
    </>
  );
};

export default FilterMenu;
