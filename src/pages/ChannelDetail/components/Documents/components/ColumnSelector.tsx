import { FC, useEffect, useMemo } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import Popover from 'components/Popover';
import { ICheckboxListOption } from 'components/CheckboxList';
import { searchObjects } from 'utils/misc';

export interface ColumnItem {
  id: string;
  fieldName: string;
  label: string;
  type: string;
  visibility: boolean;
  dataTestId: string;
  values: Array<any>;
  isCustomField: boolean;
}

interface IColumnSelecorProps {
  columns: ColumnItem[];
  updateColumns: (columns: ColumnItem[]) => void;
}

const ColumnSelector: FC<IColumnSelecorProps> = ({
  columns,
  updateColumns,
}) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'columnSelector',
  });

  const { control, watch } = useForm({
    defaultValues: {
      columns: columns
        .filter((column) => !!column.visibility)
        .map((column) => ({ data: column })),
      columnSearch: '',
    },
  });

  const [watchedColumns, watchedColumnSearch] = watch([
    'columns',
    'columnSearch',
  ]);

  useEffect(() => {
    if (watchedColumns) {
      updateColumns(
        columns.map((column) => ({
          ...column,
          visibility: !!watchedColumns.find(
            (watchedColumn) => watchedColumn.data.id === column.id,
          ),
        })),
      );
    }
  }, [watchedColumns]);

  const disabledFieldName = ['Name', 'Owner', 'Last Updated'];

  const columnFields = useMemo(
    () => [
      {
        type: FieldType.Input,
        control,
        name: 'columnSearch',
        placeholder: 'Search',
        isClearable: true,
        leftIcon: 'search',
        dataTestId: `doc-owner-search`,
        className: 'px-4',
      },
      {
        type: FieldType.CheckboxList,
        name: 'columns',
        control,
        options: searchObjects(
          columns?.map((column) => ({
            data: column,
            disabled: disabledFieldName.includes(column.fieldName),
          })),
          ['data.label'],
          watchedColumnSearch,
        ),
        labelRenderer: (option: ICheckboxListOption) => {
          return (
            <div className="ml-2.5 cursor-pointer text-xs">
              {option.data.label || ''}
            </div>
          );
        },
        rowClassName: 'px-6 py-3 border-b border-neutral-200',
      },
    ],
    [columns, watchedColumnSearch],
  );

  return (
    <div className="relative z-50">
      <Popover
        triggerNode={
          <IconButton
            icon="columnSelector"
            variant={Variant.Secondary}
            size={Size.Medium}
            borderAround
            className="bg-white !p-[10px]"
            dataTestId="column-selector-button"
            ariaLabel={t('sort')}
          />
        }
        className="-right-2 top-[52px] rounded-9xl"
        contentRenderer={() => (
          <div className="z-50 max-h-96 overflow-y-auto shadow-lg relative rounded-2xl overflow-hidden w-64">
            <Layout fields={columnFields} className="gap-4" />
            <div className="sticky bottom-0 px-6 py-3 bg-white font-sm font-bold text-neutral-500 hover:text-primary-500 text-center border-t-1 border-t-neutral-200">
              {watchedColumns.length} of {columns.length}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ColumnSelector;
