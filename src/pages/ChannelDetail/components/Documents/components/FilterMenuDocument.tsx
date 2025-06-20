// Imports - Grouped by category
import { FC, useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { parseNumber } from 'react-advanced-cropper';
import {
  Control,
  UseFormReturn,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

import Icon from 'components/Icon';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Sort from 'components/Sort';
import PopupMenu from 'components/PopupMenu';
import ColumnSelector, { ColumnItem } from './ColumnSelector';
import { FilterModalNew, GenericFilter } from 'components/FilterModalNew';
import DocumentOwner from 'components/FilterModalNew/components/DocumentOwner';
import DocumentType from 'components/FilterModalNew/components/DocumentType';
import DocModified from 'components/FilterModalNew/components/DocumentModifed';

import useModal from 'hooks/useModal';
import useURLParams from 'hooks/useURLParams';

import { getIconFromMime } from './Doc';
import { IForm } from '..';
import { ICheckboxListOption } from 'components/CheckboxList';
import { IFilterNavigation } from 'components/FilterModalNew/components/FilterModalNew';
import { titleCase } from 'utils/misc';

// Interfaces
interface IFilterMenu {
  control: Control<IForm, any>;
  watch: UseFormWatch<IForm>;
  setValue: UseFormSetValue<IForm>;
  dataTestIdSort?: string;
  dataTestIdFilter?: string;
  view: 'LIST' | 'GRID';
  columns?: ColumnItem[];
  updateColumns?: (columns: ColumnItem[]) => void;
  hideFilter?: boolean;
  hideSort?: boolean;
  hideColumnSelector?: boolean;
  showTitleFilter?: boolean;
  changeView: (view: 'LIST' | 'GRID') => void;
}

type SortType = 'name:asc' | 'name:desc' | 'external_updated_at' | 'size:asc';

interface IFilters {
  sort?: SortType;
  docOwners: ICheckboxListOption[];
  docType: ICheckboxListOption[];
  docModified?: string;
  [key: string]: any;
}

// Component
const FilterMenuDocument: FC<IFilterMenu> = ({
  control,
  watch,
  setValue,
  dataTestIdSort,
  dataTestIdFilter,
  view,
  columns = [],
  updateColumns = () => {},
  hideFilter = false,
  hideSort = false,
  hideColumnSelector = false,
  showTitleFilter = true,
  changeView,
}) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'documentTab' });
  const { t: ts } = useTranslation('components', { keyPrefix: 'Sort' });

  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const [isInitialized, setIsInitialized] = useState(false);
  const [filters, setFilters] = useState<IFilters>({
    sort: undefined,
    docOwners: [],
    docType: [],
    docModified: '',
  });

  const {
    searchParams,
    updateParam,
    serializeFilter,
    deleteParam,
    parseParams,
  } = useURLParams();

  const [docType, byTitle] = watch(['docType', 'byTitle']);

  const dynamicFilters: IFilterNavigation<any>[] = useMemo(
    () =>
      columns
        .filter((column) => column.isCustomField && column.visibility)
        .map((column) => ({
          key: column.fieldName,
          label: () => titleCase(column.fieldName),
          component: (form: UseFormReturn<any>) => (
            <GenericFilter
              options={column.values}
              name={column.fieldName}
              {...form}
            />
          ),
        })),
    [columns],
  );

  const selectedClass = '!bg-primary-50 text-primary-500 text-sm';
  const regularClass =
    '!text-neutral-500 text-sm hover:border hover:border-primary-500 focus:border focus:border-primary-500 !font-normal';

  const isFilterApplied = useMemo(
    () =>
      filters.docOwners.length > 0 ||
      filters.docType.length > 0 ||
      !!filters.docModified,
    [filters],
  );

  // Util: Format modified date
  const parseModifiedOn = useCallback((value: string) => {
    if (value.includes('custom')) {
      const [start, end] = value.replace('custom:', '').split('-');
      return `${moment(parseNumber(start)).format('DD MMM YYYY')} - ${moment(
        parseNumber(end),
      ).format('DD MMM YYYY')}`;
    }
    return value;
  }, []);

  // Sync filters to URL
  useEffect(() => {
    if (!isInitialized) return;
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        deleteParam(key);
      } else {
        updateParam(
          key,
          typeof value === 'object' ? serializeFilter(value) : value,
        );
      }
    });
  }, [filters, isInitialized]);

  // Load filters from URL on mount
  useEffect(() => {
    const sort = searchParams.get('sort') || undefined;
    const docOwners = parseParams('docOwners') || [];
    const docType = parseParams('docType') || [];
    const docModified = searchParams.get('docModified') || '';

    setFilters({ sort, docOwners, docType, docModified });

    const validSorts = [
      'name:asc',
      'name:desc',
      'external_updated_at',
      'size:desc',
    ];
    if (!validSorts.includes(sort)) deleteParam('sort');
    if (!docOwners.length) deleteParam('docOwners');
    if (!docType.length) deleteParam('docType');
    if (!docModified) deleteParam('docModified');

    setIsInitialized(true);
  }, []);

  // Memoized sort & view menu options
  const menuItems = useMemo(
    () => [
      { icon: 'list', label: t('list'), onClick: () => changeView('LIST') },
      { icon: 'grid', label: t('grid'), onClick: () => changeView('GRID') },
    ],
    [changeView, t],
  );

  const sortOptions = useMemo(
    () => [
      {
        icon: 'sortByAcs',
        label: ts('aToZ'),
        key: 'name:asc',
        dataTestId: 'sortBy-asc',
      },
      {
        icon: 'sortByDesc',
        label: ts('zToA'),
        key: 'name:desc',
        dataTestId: 'sortBy-desc',
      },
      {
        icon: 'calendar',
        label: ts('dateModified'),
        key: 'external_updated_at',
        dataTestId: 'sortby-dateadded',
      },
      {
        icon: 'vuesax',
        label: ts('size'),
        key: 'size:asc',
        dataTestId: 'sortBy-size',
      },
    ],
    [ts],
  );

  const clearFilters = useCallback(() => {
    setFilters({
      sort: undefined,
      docOwners: [],
      docType: [],
      docModified: '',
    });
  }, []);

  // Render
  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Top controls */}
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
                          <Icon name={getIconFromMime()} size={16} />{' '}
                          {t('file')}
                        </div>
                      ),
                    },
                    {
                      value: 'folder',
                      render: () => (
                        <div className="flex gap-2 font-medium text-xs">
                          <Icon name="folder" size={16} /> {t('folder')}
                        </div>
                      ),
                    },
                  ],
                  disabled: hideFilter,
                  suffixIcon: !!docType && <></>,
                  isClearable: !!docType,
                  clearIcon: <Icon name="close" size={16} />,
                  placeholder: 'Select',
                  showSearch: false,
                  selectClassName:
                    '[&>span.ant-select-clear]:!opacity-100 [&>span.ant-select-clear]:!w-4 [&>span.ant-select-clear]:!h-4 [&>span.ant-select-clear]:!-mt-2 [&>div.ant-select-selector]:!h-9 [&>div.ant-select-selection-placeholder]:!h-9 [&_input]:!h-9 [&_input]:!p-0 [&_span.ant-select-selection-placeholder]:!pl-0',
                },
              ]}
            />

            {showTitleFilter && !hideFilter && (
              <Button
                variant={ButtonVariant.Secondary}
                label={t('titleOnlyCTA')}
                className={`capitalize ${
                  !!byTitle ? selectedClass : regularClass
                }`}
                onClick={() => setValue('byTitle', !byTitle)}
              />
            )}
          </div>

          {/* Right controls */}
          <div className="flex space-x-2 items-center relative">
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
              className="mt-1 top-full right-0 border-1 border-neutral-200"
            />
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
                setFilter={(val) =>
                  setFilters({ ...filters, sort: val as SortType })
                }
                selectedValue={filters.sort}
                entity="channel-document"
                dataTestId={dataTestIdSort}
                sortOptions={sortOptions}
              />
            )}
            {!hideColumnSelector && (
              <ColumnSelector columns={columns} updateColumns={updateColumns} />
            )}
          </div>
        </div>

        {/* Active filters */}
        {(filters?.sort || isFilterApplied) && (
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <span className="text-neutral-500">Filter by</span>
              {isFilterApplied && (
                <>
                  {/* Filter chips */}
                  {filters.docOwners.length > 0 && (
                    <FilterChip
                      label="Owner"
                      values={filters.docOwners.map((o) => o.data.label)}
                      onClear={() => setFilters({ ...filters, docOwners: [] })}
                    />
                  )}
                  {filters.docType.length > 0 && (
                    <FilterChip
                      label="Type"
                      values={filters.docType.map((t) => t.data.label)}
                      onClear={() => setFilters({ ...filters, docType: [] })}
                    />
                  )}
                  {!!filters.docModified && (
                    <FilterChip
                      label="Modified on"
                      values={[parseModifiedOn(filters.docModified)]}
                      onClear={() =>
                        setFilters({ ...filters, docModified: '' })
                      }
                    />
                  )}
                </>
              )}
              {!!filters.sort && (
                <FilterChip
                  label="Sort by"
                  values={[
                    sortOptions.find((s) => s.key === filters.sort)?.label ||
                      '',
                  ]}
                  onClear={() => setFilters({ ...filters, sort: undefined })}
                />
              )}
            </div>
            <div
              className="text-neutral-500 border px-3 py-[3px] rounded-7xl hover:text-primary-600 hover:border-primary-600 cursor-pointer"
              onClick={clearFilters}
              data-testid="people-clear-filters"
            >
              Clear all
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showFilterModal && (
        <FilterModalNew
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={filters}
          onApply={(newFilters: IFilters) => {
            setFilters(newFilters);
            closeFilterModal();
          }}
          onClear={() => {
            clearFilters();
            closeFilterModal();
          }}
          defaultValues={filters}
          filterNavigation={[
            {
              key: 'docOwners',
              label: () => 'Owner',
              component: (form: UseFormReturn<any>) => (
                <DocumentOwner {...form} name="docOwners" />
              ),
            },
            {
              key: 'docType',
              label: () => 'Type',
              component: (form: UseFormReturn<any>) => (
                <DocumentType {...form} name="docType" />
              ),
            },
            {
              key: 'docModified',
              label: () => 'Modified',
              component: (form: UseFormReturn<any>) => (
                <DocModified {...form} name="docModified" />
              ),
            },
            ...dynamicFilters,
          ]}
        />
      )}
    </>
  );
};

// Helper component: FilterChip
const FilterChip = ({
  label,
  values,
  onClear,
}: {
  label: string;
  values: string[];
  onClear: () => void;
}) => (
  <div
    onClick={onClear}
    className="flex items-center px-3 py-1 border border-neutral-200 rounded-7xl gap-1 cursor-pointer hover:border-primary-600 group h-8"
  >
    <span className="text-neutral-500 font-medium">
      {label}{' '}
      <span className="text-primary-500 font-bold">
        {values.slice(0, 2).join(', ')}
        {values.length > 2 && ` and + ${values.length - 2} more`}
      </span>
    </span>
    <Icon name="close" size={16} />
  </div>
);

export default FilterMenuDocument;
