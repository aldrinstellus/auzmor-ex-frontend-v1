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
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import Icon from 'components/Icon';
import { getIconFromMime } from './Doc';
import { IForm } from '..';
import moment from 'moment';
import { parseNumber } from 'react-advanced-cropper';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { isTrim } from '../../utils';

export enum FilterKey {
  departments = 'departments',
  locations = 'locations',
  status = 'status',
}

interface IFilterMenu {
  control: Control<IForm, any>;
  watch: UseFormWatch<IForm>;
  setValue: UseFormSetValue<IForm>;
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
  view: 'LIST' | 'GRID';
  hideFilter?: boolean;
  hideSort?: boolean;
  showTitleFilter?: boolean;
  changeView: (view: 'LIST' | 'GRID') => void;
}

const FilterMenuDocument: FC<IFilterMenu> = ({
  control,
  watch,
  setValue,
  dataTestIdSort,
  dataTestIdFilter,
  view,
  hideFilter = false,
  hideSort = false,
  showTitleFilter = true,
  changeView,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters, updateFilter, clearFilters } =
    useAppliedFiltersStore();
  const {
    searchParams,
    updateParam,
    serializeFilter,
    deleteParam,
    parseParams,
  } = useURLParams();
  const [docType, recentlyModified, byTitle] = watch([
    'docType',
    'recentlyModified',
    'byTitle',
  ]);
  const selectedButtonClassName = '!bg-primary-50 text-primary-500 text-sm';
  const regularButtonClassName =
    '!text-neutral-500 text-sm hover:border hover:border-primary-500 focus:border focus:border-primary-500';

  const isFilterApplied =
    !!filters?.docTypeCheckbox?.length ||
    !!filters?.docOwnerCheckbox?.length ||
    !!filters?.docModifiedRadio;

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
            if (filters[key] === undefined) {
              deleteParam(key);
            } else {
              updateParam(key, filters[key]);
            }
          }
        }
      });
    }
  }, [filters]);

  useEffect(() => {
    const sort = searchParams.get('sort') || undefined;
    const docOwnerCheckbox = parseParams('docOwnerCheckbox') || [];
    const docTypeCheckbox = parseParams('docTypeCheckbox') || [];
    const docModifiedRadio = searchParams.get('docModifiedRadio') || undefined;
    const validSortValues = [
      'name:asc',
      'name:desc',
      'external_updated_at',
      'size:desc',
    ];

    const docFilters = {
      docOwnerCheckbox,
      docTypeCheckbox,
      docModifiedRadio,
      sort,
    };

    if (!sort || !validSortValues.includes(sort)) {
      deleteParam('sort');
    }

    if (!!!docOwnerCheckbox.length) {
      deleteParam('docOwnerCheckbox');
    }

    if (!!!docTypeCheckbox.length) {
      deleteParam('docTypeCheckbox');
    }

    if (!!!docModifiedRadio) {
      deleteParam('docModifiedRadio');
    }

    setFilters(docFilters);

    return clearFilters;
  }, []);

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

  const sortOptions = [
    {
      icon: 'sortByAcs',
      label: 'A to Z',
      key: 'name:asc',
      dataTestId: 'sortBy-asc',
    },
    {
      icon: 'sortByDesc',
      label: 'Z to A',
      key: 'name:desc',
      dataTestId: 'sortBy-desc',
    },
    {
      icon: 'calendar',
      label: 'Date modified',
      key: 'external_updated_at',
      dataTestId: 'sortby-dateadded',
    },
    {
      icon: 'vuesax',
      label: 'Size',
      key: 'size:asc',
      dataTestId: 'sortBy-size',
    },
  ];

  const parseModifiedOn = (value: string) => {
    if (value.includes('custom')) {
      const [start, end] = value.replace('custom:', '').split('-');
      return `${moment(parseNumber(start)).format('DD MMM YYYY')} - ${moment(
        parseNumber(end),
      ).format('DD MMM YYYY')}`;
    } else {
      return value;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center h-9">
          <div className="flex gap-4 items-center">
            <Layout
              fields={[
                {
                  type: FieldType.SingleSelect,
                  name: 'docType',
                  control,
                  options: [
                    {
                      value: 'file',
                      render: () => (
                        <div className="flex gap-2 font-medium text-xs">
                          <Icon name={getIconFromMime()} size={16} /> File
                        </div>
                      ),
                    },
                    {
                      value: 'folder',
                      render: () => (
                        <div className="flex gap-2 font-medium text-xs op">
                          <Icon name="folder" size={16} /> Folder
                        </div>
                      ),
                    },
                  ],
                  disabled: hideFilter,
                  suffixIcon: !!docType && <></>,
                  isClearable: !!docType,
                  clearIcon: <Icon name="close" size={16} />,
                  placeholder: 'Type',
                  showSearch: false,
                  selectClassName:
                    '[&>span.ant-select-clear]:!opacity-100 [&>span.ant-select-clear]:!w-4 [&>span.ant-select-clear]:!h-4 [&>span.ant-select-clear]:!-mt-2 [&>div.ant-select-selector]:!h-9 [&>div.ant-select-selection-placeholder]:!h-9 [&_input]:!h-9 [&_input]:!p-0 [&_span.ant-select-selection-placeholder]:!pl-0',
                },
              ]}
            />
            {false && (
              <Button
                variant={ButtonVariant.Secondary}
                label={isTrim('Recently modified')}
                className={`capitalize ${
                  !!recentlyModified
                    ? selectedButtonClassName
                    : regularButtonClassName
                }`}
                onClick={() => setValue('recentlyModified', !recentlyModified)}
              />
            )}
            {showTitleFilter && !hideFilter && (
              <Button
                variant={ButtonVariant.Secondary}
                label={isTrim('Title only')}
                className={`capitalize ${
                  !!byTitle ? selectedButtonClassName : regularButtonClassName
                }`}
                onClick={() => setValue('byTitle', !byTitle)}
              />
            )}
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
            {!hideFilter && (
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
            )}
            {!hideSort && (
              <Sort
                controlled
                setFilter={(sortValue) => {
                  setFilters({ sort: sortValue });
                }}
                selectedValue={filters ? filters.sort : ''}
                entity={'channel-document'}
                dataTestId={dataTestIdSort}
                sortOptions={sortOptions}
              />
            )}
          </div>
        </div>
        {(filters?.sort || isFilterApplied) && (
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {isFilterApplied && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Filter by</span>
                  {!!(filters.docOwnerCheckbox || []).length && (
                    <div
                      onClick={() => updateFilter('docOwnerCheckbox', [])}
                      className="flex items-center px-3 py-1 border border-neutral-200 rounded-7xl gap-1 cursor-pointer hover:border-primary-600 group h-8"
                    >
                      <span className="text-neutral-500 font-medium">
                        Owner{' '}
                        {filters.docOwnerCheckbox.length === 1 && (
                          <span className="text-primary-500 font-bold">
                            {filters.docOwnerCheckbox[0].name}
                          </span>
                        )}
                        {filters.docOwnerCheckbox.length === 2 && (
                          <span>
                            <span className="text-primary-500 font-bold">
                              {filters.docOwnerCheckbox[0].name}
                            </span>{' '}
                            and{' '}
                            <span className="text-primary-500 font-bold">
                              {filters.docOwnerCheckbox[1].name}
                            </span>
                          </span>
                        )}
                        {filters.docOwnerCheckbox.length > 2 && (
                          <span>
                            <span className="text-primary-500 font-bold">
                              {filters.docOwnerCheckbox[0].name},
                              {filters.docOwnerCheckbox[1].name}
                            </span>
                            and{' '}
                            <span className="text-primary-500 font-bold">
                              + {filters.docOwnerCheckbox.length - 2} others
                            </span>
                          </span>
                        )}
                      </span>
                      <Icon name="close" size={16} />
                    </div>
                  )}
                  {!!(filters.docTypeCheckbox || []).length && (
                    <div
                      onClick={() => updateFilter('docTypeCheckbox', [])}
                      className="flex items-center px-3 py-1 border border-neutral-200 rounded-7xl gap-1 cursor-pointer hover:border-primary-600 group h-8"
                    >
                      <span className="text-neutral-500 font-medium">
                        Type{' '}
                        {filters.docTypeCheckbox.length === 1 && (
                          <span className="text-primary-500 font-bold">
                            {filters.docTypeCheckbox[0].label}
                          </span>
                        )}
                        {filters.docTypeCheckbox.length === 2 && (
                          <span>
                            <span className="text-primary-500 font-bold">
                              {filters.docTypeCheckbox[0].label}
                            </span>{' '}
                            and{' '}
                            <span className="text-primary-500 font-bold">
                              {filters.docTypeCheckbox[1].label}
                            </span>
                          </span>
                        )}
                        {filters.docTypeCheckbox.length > 2 && (
                          <span>
                            <span className="text-primary-500 font-bold">
                              {filters.docTypeCheckbox[0].label},
                              {filters.docTypeCheckbox[1].label}
                            </span>
                            and{' '}
                            <span className="text-primary-500 font-bold">
                              + {filters.docTypeCheckbox.length - 2} more
                            </span>
                          </span>
                        )}
                      </span>
                      <Icon name="close" size={16} />
                    </div>
                  )}
                  {!!filters?.docModifiedRadio && (
                    <div
                      onClick={() =>
                        updateFilter('docModifiedRadio', undefined)
                      }
                      className="flex items-center px-3 py-1 border border-neutral-200 rounded-7xl gap-1 cursor-pointer hover:border-primary-600 group h-8"
                    >
                      <span className="text-neutral-500 font-medium">
                        Modified on{' '}
                        <span className="text-primary-500 font-bold">
                          {parseModifiedOn(filters.docModifiedRadio)}
                        </span>
                      </span>
                      <Icon name="close" size={16} />
                    </div>
                  )}
                </div>
              )}
              {filters?.sort && (
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Sort by</span>
                  <div
                    onClick={() => updateFilter('sort', undefined)}
                    className="flex items-center px-3 py-1 border border-neutral-200 rounded-7xl gap-1 cursor-pointer hover:border-primary-600 group h-8"
                  >
                    <span className="text-primary-500 font-bold group-hover:text-primary-600">
                      {
                        sortOptions.find(
                          (option) => option.key === filters?.sort,
                        )?.label
                      }
                    </span>
                    <Icon name="close" size={16} />
                  </div>
                </div>
              )}
            </div>
            <div
              className="text-neutral-500 border px-3 py-[3px] whitespace-nowrap rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
              onClick={clearFilters}
              data-testid={`people-clear-filters`}
            >
              {'Clear all'}
            </div>
          </div>
        )}
      </div>
      {showFilterModal && (
        <FilterModal
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={{
            docOwnerCheckbox: filters?.docOwnerCheckbox,
            docTypeCheckbox: filters?.docTypeCheckbox,
            docModifiedRadio: filters?.docModifiedRadio,
          }}
          onApply={(appliedFilters) => {
            setFilters({
              ...appliedFilters,
              docModifiedRadio: (
                appliedFilters?.docModifiedRadio || []
              ).includes('undefined')
                ? undefined
                : appliedFilters.docModifiedRadio,
            });
            closeFilterModal();
          }}
          onClear={() => {
            setFilters({
              docOwnerCheckbox: [],
              docTypeCheckbox: [],
              docModifiedRadio: undefined,
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
