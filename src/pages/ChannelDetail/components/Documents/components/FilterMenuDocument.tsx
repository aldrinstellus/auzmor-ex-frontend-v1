import FilterModal, { FilterModalVariant } from 'components/FilterModal';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import useModal from 'hooks/useModal';
import { FC, useEffect } from 'react';
import useURLParams from 'hooks/useURLParams';
import Sort from 'components/Sort';
import PopupMenu from 'components/PopupMenu';
import Layout, { FieldType } from 'components/Form';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import { useForm } from 'react-hook-form';
import Icon from 'components/Icon';
import { getIconFromMime } from './Doc';

export enum FilterKey {
  departments = 'departments',
  locations = 'locations',
  status = 'status',
}

interface IFilterMenu {
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
  view: 'LIST' | 'GRID';
  changeView: (view: 'LIST' | 'GRID') => void;
}

const FilterMenuDocument: FC<IFilterMenu> = ({
  dataTestIdSort,
  dataTestIdFilter,
  view,
  changeView,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters } = useAppliedFiltersStore();
  const { control } = useForm();

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

  const menuItems = [
    {
      icon: 'list',
      label: 'List',
      onClick: () => changeView('LIST'),
    },
    {
      icon: 'grid',
      label: 'Grid',
      onClick: () => changeView('GRID'),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center h-9">
          <div>
            <Layout
              fields={[
                {
                  type: FieldType.SingleSelect,
                  name: 'Type',
                  control,
                  options: [
                    {
                      value: 'file',
                      render: () => (
                        <div className="flex gap-2">
                          <Icon name={getIconFromMime()} /> File
                        </div>
                      ),
                    },
                    {
                      value: 'folder',
                      render: () => (
                        <div className="flex gap-2">
                          <Icon name="dir" /> Folder
                        </div>
                      ),
                    },
                  ],
                  placeholder: 'Type',
                  showSearch: false,
                  className: 'h-[36px]',
                },
              ]}
            />
          </div>
          <div className="flex space-x-2 justify-center items-center relative">
            <div className="flex relative">
              <PopupMenu
                triggerNode={
                  <IconButton
                    icon={view === 'GRID' ? 'grid' : 'list'}
                    variant={IconVariant.Secondary}
                    size={IconSize.Medium}
                    borderAround
                    className="bg-white !p-[10px]"
                  />
                }
                menuItems={menuItems}
                className="mt-1 top-full right-0 border-1 border-neutral-200 focus-visible:outline-none"
              />
            </div>
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
              {/* {isFilterApplied && (
                <div className="absolute w-2 h-2 rounded-full bg-red-500 top-0.5 right-0" />
              )} */}
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
          appliedFilters={{}}
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
