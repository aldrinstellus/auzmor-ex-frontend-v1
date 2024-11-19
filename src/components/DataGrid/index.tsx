import React, {
  Dispatch,
  FC,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Header,
  Row,
  RowSelectionState,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import Spinner from 'components/Spinner';
import { clsx } from 'clsx';

export interface IDataGridProps {
  flatData?: any;
  columns: ColumnDef<any>[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: any;
  hasNextPage?: boolean;
  tableContainerRef?: RefObject<HTMLDivElement>;
  isRowSelectionEnabled: boolean;
  onRowClick?: (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    table: Table<any>,
    row: Row<any>,
    isDoubleClick?: boolean,
  ) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  className?: string;
  tableRef?: MutableRefObject<any>;
  isRowSelected?: boolean;
  height?: number | 'auto';
  trDataClassName?: string;
}

const DataGrid: FC<IDataGridProps> = ({
  flatData,
  columns,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  tableContainerRef,
  isRowSelectionEnabled,
  onRowClick = () => {},
  rowSelection,
  setRowSelection,
  className,
  tableRef,
  height = 'auto',
  trDataClassName = '',
}) => {
  const { ref, inView } = useInView();
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  // Styles
  const getThClassName = (header: any) =>
    clsx({ flex: true, [header?.column?.columnDef?.thClassName || '']: true });
  const getTdClassName = (cell: any) =>
    clsx({ flex: true, [cell?.column?.columnDef?.tdClassName || '']: true });
  const trHeaderClassName = () =>
    clsx({ 'flex w-full px-5 py-3 bg-neutral-100 gap-2 group/row': true });
  const getTrDataClassName = (row: Row<any>) =>
    clsx({
      'flex absolute w-full hover:bg-primary-100 px-5 py-3 gap-2 cursor-default border-b-1 select-none group/row':
        true,
      'bg-primary-100': row.getIsSelected(),
      'cursor-pointer': row.getCanSelect(),
      [trDataClassName]: true,
    });

  useEffect(() => {
    if (inView && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: { rowSelection },
    enableRowSelection: isRowSelectionEnabled,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  if (tableRef) {
    tableRef.current = table;
  }

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 60, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef?.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element: {
            getBoundingClientRect: () => { (): any; new (): any; height: any };
          }) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const handleClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    table: Table<any>,
    row: Row<any>,
  ) => {
    if (clickTimeout) {
      // If a timeout is already set, clear it and trigger double-click
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onRowClick(e, table, row, true);
    } else {
      // Set a timeout for single click detection
      const timeout = setTimeout(() => {
        onRowClick(e, table, row, false);
        setClickTimeout(null);
      }, 100); // 100ms delay to distinguish single and double-click
      setClickTimeout(timeout);
    }
  };

  return (
    <div
      className={className}
      ref={tableContainerRef}
      style={{
        overflow: 'auto', //our scrollable table container
        position: 'relative', //needed for sticky header
        height,
      }}
    >
      {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
      <table className="grid gap-2">
        <thead className="grid sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={trHeaderClassName()}>
              {headerGroup.headers.map((header: Header<any, unknown>) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={getThClassName(header)}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: 'relative', //needed for absolute positioning of rows
          }}
        >
          {rowVirtualizer
            .getVirtualItems()
            .map((virtualRow: any, rowIndex: number) => {
              const row = rows[virtualRow.index] as Row<any>;
              return (
                <tr
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  className={getTrDataClassName(row)}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    zIndex: rows.length - rowIndex,
                  }}
                  onClick={(e) => handleClick(e, table, row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className={getTdClassName(cell)}
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
          {isFetchingNextPage && (
            <div className="w-full flex items-center justify-center p-8">
              <Spinner />
            </div>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;
