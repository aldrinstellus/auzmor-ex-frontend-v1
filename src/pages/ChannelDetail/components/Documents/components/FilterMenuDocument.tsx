// Imports - Grouped by category
import { FC, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

import { getIconFromMime } from './Doc';
import { IForm } from '..';
import { ICheckboxListOption } from 'components/CheckboxList';
import { IFilterNavigation } from 'components/FilterModalNew/components/FilterModalNew';
import { titleCase } from 'utils/misc';
import { useAppliedFilter } from 'hooks/useAppliedFilter';
import { FilterKey } from 'stores/appliedFiltersStore';

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
  modifiedOn?: string;
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
  const staticFilterKeys: FilterKey[] = [
    { key: 'docOwners', label: 'Owners' },
    { key: 'docType', label: 'Type' },
    { key: 'modifiedOn', label: 'Modified on' },
    { key: 'sort', label: 'Sort by' },
  ];
  const initialFilters = {
    sort: undefined,
    docOwners: [],
    docType: [],
    modifiedOn: '',
  };

  const [filterKeys, setFilterKeys] = useState<FilterKey[]>([
    ...staticFilterKeys,
    ...columns
      .filter((column) => column.isCustomField && column.visibility)
      .map((column) => ({
        key: column.fieldName,
        label: titleCase(column.fieldName),
      })),
  ]);
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { filters, setFilters, isFilterApplied, clearFilters, FilterChips } =
    useAppliedFilter(initialFilters);

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

  useEffect(() => {
    setFilterKeys([
      ...staticFilterKeys,
      ...columns
        .filter((column) => column.isCustomField && column.visibility)
        .map((column) => ({
          key: column.fieldName,
          label: titleCase(column.fieldName),
        })),
    ]);
  }, [columns]);

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
                selectedValue={filters?.sort}
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
        <FilterChips filterKeys={filterKeys} sortOptions={sortOptions} />
      </div>

      {/* Modal */}
      {showFilterModal && (
        <FilterModalNew
          open={showFilterModal}
          closeModal={closeFilterModal}
          appliedFilters={filters as IFilters}
          onApply={(newFilters: IFilters) => {
            setFilters(newFilters);
            closeFilterModal();
          }}
          onClear={() => {
            clearFilters();
            closeFilterModal();
          }}
          defaultValues={filters as IFilters}
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
              key: 'modifiedOn',
              label: () => 'Modified',
              component: (form: UseFormReturn<any>) => (
                <DocModified {...form} name="modifiedOn" />
              ),
            },
            ...dynamicFilters,
          ]}
        />
      )}
    </>
  );
};

export default FilterMenuDocument;
