import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from './usePermissions';
import { IDataGridProps } from 'components/DataGrid';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import Skeleton from 'react-loading-skeleton';

type DataGridType<T> = {
  apiEnum: ApiEnum;
  payload?: Record<string, any>;
  isInfiniteQuery?: boolean;
  loadingRowCount?: number;
  loadingGrid?: ReactNode;
  isEnabled?: boolean;
  dataGridProps: IDataGridProps<T>;
};

export const useDataGrid = <T extends object>({
  loadingRowCount = 5,
  ...rest
}: DataGridType<T>) => {
  const { getApi } = usePermissions();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isRowSelected, setIsRowSelected] = useState<boolean>(false);
  const tableRef = useRef<any>(null);
  const { apiEnum, payload, isInfiniteQuery, isEnabled, loadingGrid } = rest;
  const { columns, view } = rest.dataGridProps;

  useEffect(() => {
    setIsRowSelected(
      Object.keys(rowSelection).some((index) => !!rowSelection[index]),
    );
  }, [rowSelection]);

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

  if (isInfiniteQuery) {
    const useInfiniteQuery = getApi(apiEnum);
    const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
      useInfiniteQuery(payload, { enabled: isEnabled });
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
          ? columns.map(
              (column) =>
                ({
                  ...column,
                  header: () => <></>,
                  cell: () => (
                    <Skeleton
                      containerClassName="w-full !h-3 !rounded-15xl !max-w-[280px] relative"
                      className="!absolute !w-full top-0 left-0 h-3 !rounded-15xl"
                    />
                  ),
                } as ColumnDef<T>),
            )
          : columns,
      [isLoading, columns],
    );

    return {
      ...rest.dataGridProps,
      columns: tableColumns as ColumnDef<T>[],
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
  const { data, isLoading } = useQuery(payload, { enabled: isEnabled });
  const flatData = data;

  const tableData = useMemo(
    () => (isLoading ? loadingData : flatData),
    [isLoading, flatData],
  );

  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map(
            (column) =>
              ({
                ...column,
                header: () => null,
                cell: () =>
                  view === 'LIST' ? (
                    <Skeleton
                      containerClassName="w-full !h-3 !rounded-15xl !max-w-[280px] relative"
                      className="!absolute !w-full top-0 left-0 h-3 !rounded-15xl"
                    />
                  ) : (
                    loadingGrid
                  ),
              } as ColumnDef<T>),
          )
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
