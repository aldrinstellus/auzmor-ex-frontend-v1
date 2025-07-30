import { FC, useEffect, useMemo } from 'react';
import IconButton, { Size, Variant } from 'components/IconButton';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import Popover from 'components/Popover';
import { ICheckboxListOption } from 'components/CheckboxList';
import { searchObjects } from 'utils/misc';
import Input from 'components/Input';
import { useDebounce } from 'hooks/useDebounce';

export interface ColumnItem {
  id: string;
  custom_field_id: string;
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

  const { control, watch, formState: { dirtyFields } } = useForm({
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

  const debouncedWatchedColumns = useDebounce(watchedColumns, 500);

  useEffect(() => {
    if (debouncedWatchedColumns && dirtyFields?.columns) {
      updateColumns(
        columns.map((column) => ({
          ...column,
          visibility: !!debouncedWatchedColumns.find(
            (watchedColumn: any) => watchedColumn.data.id === column.id,
          ),
        })),
      );
    }
  }, [debouncedWatchedColumns, dirtyFields]);

  const disabledFieldName = ['Name'];

  const columnFields = useMemo(
    () => [
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
            <div className="ml-2.5 cursor-pointer text-sm">
              {option.data.label || ''}
            </div>
          );
        },
        rowClassName: 'px-4 py-3',
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
            className="h-full flex items-center justify-center bg-white !p-[10px] "
            dataTestId="column-selector-button"
            ariaLabel={t('sort')}
          />
        }
        className="-right-2 top-[52px] rounded-9xl"
        contentRenderer={() => (
          <div className="flex flex-col h-[350px] shadow-lg relative rounded-9xl border border-neutral-100 w-64">
            <Input
              control={control}
              name="columnSearch"
              placeholder="Search"
              isClearable
              leftIcon="search"
              dataTestId="doc-owner-search"
              className="px-4 py-1 h-[60px]"
            />
            <Layout fields={columnFields} className="gap-4 h-[248px] overflow-y-auto" />
            <div className="text-sm h-[40px] px-4 mt-[2px] flex items-center bg-white font-sm text-neutral-500 hover:text-primary-500 rounded-b-9xl border-t-1 border-t-neutral-200">
              {t('selectedColumns', { selectedCount: watchedColumns.length, totalCount: columns.length })}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ColumnSelector;
