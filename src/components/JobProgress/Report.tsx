import React from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { useInfiniteImportResultData } from 'queries/importUsers';
import Spinner from 'components/Spinner';
import { titleCase } from 'utils/misc';

type AppProps = {
  importId: string;
  status: string;
};

const Report: React.FC<AppProps> = ({ importId, status }) => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteImportResultData({
      importId,
      startFetching: true,
      q: { status },
    });

  const flatData: any[] = (
    data?.pages.flatMap((page) => {
      return page?.data?.result?.data?.map((user: any) => user);
    }) || []
  ).map((f, idx) => ({ idx: idx + 1, ...f }));

  const columns: any[] = [
    { key: 'idx', name: '', width: 40 },
    {
      key: 'name',
      name: 'Name',
      resizable: true,
      width: 200,
      renderCell: ({ row }: any) => {
        return row.rowData?.fullName?.value;
      },
    },
    {
      key: 'email',
      name: 'Email',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.email?.value;
      },
    },
    {
      key: 'managerEmail',
      name: 'Manager Email',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.managerEmail?.value;
      },
    },
    {
      key: 'designation',
      name: 'Designation',
      resizable: true,
      width: 180,
      renderCell: ({ row }: any) => {
        return row.rowData?.designation?.value;
      },
    },
    {
      key: 'department',
      name: 'Department',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.department?.value;
      },
    },
    {
      key: 'location',
      name: 'Location',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.workLocation?.value || row.rowData?.location?.value;
      },
    },
    {
      key: 'employeeId',
      name: 'Employee ID',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.employeeId?.value;
      },
    },
    {
      key: 'phoneNumber',
      name: 'Phone',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.workPhone?.value || row.rowData?.phoneNumber?.value;
      },
    },
    {
      key: 'dateOfBirth',
      name: 'Date of Birth',
      resizable: true,
      width: 140,
      renderCell: ({ row }: any) => {
        return row.rowData?.birthDate?.value || row.rowData?.dateOfBirth?.value;
      },
    },
    {
      key: 'dateOfJoining',
      name: 'Date of Joining',
      resizable: true,
      width: 140,
      renderCell: ({ row }: any) => {
        return (
          row.rowData?.joinDate?.value || row.rowData?.dateOfJoining?.value
        );
      },
    },
    {
      key: 'maritalStatus',
      name: 'Marital Status',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.maritalStatus?.value;
      },
    },
    {
      key: 'role',
      name: 'Role',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.role?.value;
      },
    },
  ];

  if (['PARTIAL', 'FAILED'].includes(status)) {
    columns.push({
      key: 'error',
      name: 'Error',
      resizable: true,
      width: 160,
      renderCell: ({ row }: any) => {
        if (row.error) {
          return titleCase(row.error?.split('_').join(' '));
        }
        return '';
      },
      cellClass: (row: any) => {
        if (row.error) {
          return 'text-red-500 bg-red-50';
        }
        return '';
      },
    });
  }

  const rowKeyGetter = (row: any) => row.id || row.idx;

  const handleScroll = (event: any) => {
    if (hasNextPage && !isFetchingNextPage) {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget || {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
      };
      if (scrollHeight - (scrollTop + clientHeight) < 1000) {
        fetchNextPage();
      }
    }
  };

  return (
    <div>
      <div className="pt-4">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="bg-white">
            <div className="px-6">
              {flatData?.length ? (
                <DataGrid
                  enableVirtualization
                  columns={columns}
                  rows={flatData}
                  rowKeyGetter={rowKeyGetter}
                  rowHeight={32}
                  headerRowHeight={36}
                  className="text-xs rdg-light h-[65vh] w-auto"
                  onScroll={handleScroll}
                />
              ) : (
                <div className="flex flex-col justify-center items-center p-4">
                  <img src={require('./nodata.png')} alt="No Data Picture" />
                  <div className="pt-4 text-2xl font-bold">
                    No data to display
                  </div>
                </div>
              )}
              {isFetchingNextPage && (
                <div className="text-xs font-bold text-neutral-500 text-center">
                  Loading...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
