import FilterModal from 'components/FilterModal';
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

interface IFilterMenu {
  children: ReactNode;
  filterForm: UseFormReturn<
    {
      search: string;
    },
    any
  >;
}

const FilterMenu: FC<IFilterMenu> = ({ children, filterForm }) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters } = useAppliedFiltersStore();
  const { control, getValues, formState } = filterForm;
  const { updateParam, serializeFilter } = useURLParams();

  useEffect(() => {
    if (filters) {
      Object.keys(filters).forEach((key: string) => {
        const serializedFilters = serializeFilter(filters[key]);
        updateParam(key, serializedFilters.replaceAll('%22', ''));
      });
    }
  }, [filters]);

  return (
    <>
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
            dataTestId="people-filter"
          />
          <Sort
            setFilter={(sortValue) => {
              setFilters({ sort: sortValue });
            }}
            filterKey={{ createdAt: 'createdAt', aToZ: 'name' }}
            selectedValue={filters ? filters.sort : ''}
            filterValue={{ asc: 'ASC', desc: 'DESC' }}
            entity={'CHANNEL'}
            dataTestId="channel-sort"
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
                  dataTestId: 'people-search-members',
                  inputClassName: 'py-[7px] !text-sm !h-9',
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
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
