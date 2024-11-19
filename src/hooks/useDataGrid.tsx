import { useEffect, useMemo, useRef, useState } from 'react';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from './usePermissions';
import { IDataGridProps } from 'components/DataGrid';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import Skeleton from 'react-loading-skeleton';

type DataGridType = {
  apiEnum: ApiEnum;
  q?: Record<string, any>;
  isInfiniteQuery?: boolean;
  loadingRowCount?: number;
  dataGridProps: IDataGridProps;
};

export const useDataGrid: (config: DataGridType) => IDataGridProps = ({
  loadingRowCount = 5,
  ...rest
}) => {
  const { getApi } = usePermissions();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isRowSelected, setIsRowSelected] = useState(false);
  const tableRef = useRef<any>(null);
  const { apiEnum, q, isInfiniteQuery } = rest;
  const { columns } = rest.dataGridProps;

  const generateLoadingRows = () => {
    // Extract keys from the columns array to define the structure of each row
    const rowTemplate = columns.reduce((acc: any, column) => {
      acc[(column as any).accessorKey] = '';
      return acc;
    }, {});

    // Generate an array of empty rows based on loadingRowCount
    return Array.from({ length: loadingRowCount }, () => ({ ...rowTemplate }));
  };

  const loadingData = generateLoadingRows();

  useEffect(() => {
    setIsRowSelected(!!tableRef?.current?.getIsSomeRowsSelected());
  }, [rowSelection]);

  if (isInfiniteQuery) {
    const useInfiniteQuery = getApi(apiEnum);
    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
      useInfiniteQuery(q);
    const flatData = useMemo(
      () => data?.pages?.flatMap((page: { data: any }) => page.data) ?? [],
      [data],
    );

    const tableData = useMemo(
      () => (isLoading ? loadingData : flatData),
      [isLoading, flatData],
    );
    const tableColumns = useMemo(
      () =>
        isLoading
          ? columns.map((column) => ({
              ...column,
              cell: () => (
                <div className="w-full h-5">
                  <Skeleton className="w-full h-full" />
                </div>
              ),
            }))
          : columns,
      [isLoading, columns],
    );

    return {
      ...rest.dataGridProps,
      columns: tableColumns as ColumnDef<any>[],
      isFetchingNextPage,
      fetchNextPage,
      hasNextPage,
      isRowSelected,
      flatData: tableData,
      isLoading,
      tableContainerRef,
      rowSelection,
      setRowSelection,
      tableRef,
      onRowClick: isLoading ? () => {} : rest.dataGridProps.onRowClick,
    };
  }

  const useQuery = getApi(apiEnum);
  const { data, isLoading } = useQuery(q);
  const flatData = data?.result?.data || [];

  const tableData = useMemo(
    () => (isLoading ? loadingData : flatData),
    [isLoading, flatData],
  );
  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: () => (
              <div className="w-full h-6">
                <Skeleton
                  className="w-full h-full"
                  style={{ lineHeight: 'unset' }}
                />
              </div>
            ),
          }))
        : columns,
    [isLoading, columns],
  );
  return {
    ...rest.dataGridProps,
    flatData: tableData,
    columns: tableColumns,
    isLoading,
    tableContainerRef,
    rowSelection,
    setRowSelection,
    tableRef,
    isRowSelected,
    onRowClick: isLoading ? () => {} : rest.dataGridProps.onRowClick,
  };
};
