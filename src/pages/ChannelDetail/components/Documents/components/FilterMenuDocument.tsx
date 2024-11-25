import FilterModal, { FilterModalVariant } from 'components/FilterModal';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import useModal from 'hooks/useModal';
import { FC, ReactNode, useEffect } from 'react';
import useURLParams from 'hooks/useURLParams';
import { useAppliedFiltersForDoc } from 'stores/appliedFiltersForDoc';
import Sort from 'components/Sort';
import PopupMenu from 'components/PopupMenu';

export enum FilterKey {
  departments = 'departments',
  locations = 'locations',
  status = 'status',
}

interface IFilterMenu {
  children?: ReactNode;
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
}

const FilterMenuDocument: FC<IFilterMenu> = ({
  children,
  dataTestIdSort,
  dataTestIdFilter,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters } = useAppliedFiltersForDoc();

  const { updateParam, serializeFilter, deleteParam } = useURLParams();

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

  // const handleRemoveFilters = (key: FilterKey, id: any) => {
  //   if (filters) {
  //     const updatedFilter = filters[key]!.filter((item: any) => item.id !== id);
  //     const serializedFilters = serializeFilter(updatedFilter);
  //     if (updatedFilter.length === 0) {
  //       deleteParam(key);
  //     } else {
  //       updateParam(key, serializedFilters);
  //     }
  //     setFilters({ ...filters, [key]: updatedFilter });
  //   }
  // };

  // const clearFilters = () => {
  //   deleteParam('documentTypeCheckbox');
  //   deleteParam('documentPeopleCheckbox');
  //   deleteParam('documentModifiedCheckbox');
  //   setFilters({
  //     ...filters,
  //     documentTypeCheckbox: [],
  //     documentPeopleCheckbox: [],
  //     documentModifiedCheckbox: [],
  //   });
  // };

  const isFilterApplied =
    !!filters?.docTypeCheckbox?.length ||
    !!filters?.docPeopleCheckbox?.length ||
    !!filters?.docModifiedRadio;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>{children}</div>
          <div className="flex space-x-2 justify-center items-center relative">
            <PopupMenu
              triggerNode={
                <IconButton
                  icon="grid"
                  variant={IconVariant.Secondary}
                  size={IconSize.Medium}
                  borderAround
                  className="bg-white !p-[10px]"
                  dataTestId={dataTestIdFilter}
                />
              }
              menuItems={[]}
            />
            <div className="relative flex">
              <IconButton
                onClick={openFilterModal}
                icon="filterLinear"
                variant={IconVariant.Secondary}
                size={IconSize.Medium}
                borderAround
                className="bg-white !p-[10px]"
                dataTestId={dataTestIdFilter}
              />
              {isFilterApplied && (
                <div className="absolute w-2 h-2 rounded-full bg-red-500 top-0.5 right-0" />
              )}
            </div>
            <Sort
              setFilter={(sortValue) => {
                setFilters({ sort: sortValue });
              }}
              selectedValue={filters ? filters.sort : ''}
              entity={'CHANNEL'}
              dataTestId={dataTestIdSort}
            />
          </div>
        </div>
      </div>
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={{
            docTypeCheckbox: filters?.docTypeCheckbox || [],
            docPeopleCheckbox: filters?.docPeopleCheckbox || [],
            docModifiedRadio: filters?.docModifiedRadio || [],
          }}
          onApply={(appliedFilters) => {
            setFilters(appliedFilters);
            closeFilterModal();
          }}
          onClear={() => {
            setFilters({
              docPeopleCheckbox: [],
              docTypeCheckbox: [],
              docModifiedRadio: [],
            });
            closeFilterModal();
          }}
          variant={FilterModalVariant.Document}
        />
      )}
    </>
  );
};

export default FilterMenuDocument;
