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
      // cellClass: (row: any) => {
      //   if (!row.rowData?.fullName?.value) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'email',
      name: 'Email',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData.email?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.email?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'managerEmail',
      name: 'Manager Email',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData.managerEmail?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.managerEmail?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'designation',
      name: 'Designation',
      resizable: true,
      width: 180,
      renderCell: ({ row }: any) => {
        return row.rowData.designation?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.designation?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'department',
      name: 'Department',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData.department?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.department?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'location',
      name: 'Location',
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData.workLocation?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.location?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'employeeId',
      name: 'Employee ID',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData.employeeId?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.employeeId?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'phoneNumber',
      name: 'Phone',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData.workPhone?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.phoneNumber?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'dateOfBirth',
      name: 'Date of Birth',
      resizable: true,
      width: 140,
      renderCell: ({ row }: any) => {
        return row.rowData.birthDate?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.dateOfBirth?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'dateOfJoining',
      name: 'Date of Joining',
      resizable: true,
      width: 140,
      renderCell: ({ row }: any) => {
        return row.rowData.joinDate?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.dateOfJoining?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'maritalStatus',
      name: 'Marital Status',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData.maritalStatus?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.maritalStatus?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
    },
    {
      key: 'role',
      name: 'Role',
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData.role?.value;
      },
      // cellClass: (row: any) => {
      //   if (!row.rowData.role?.isValid) {
      //     return 'text-red-500 bg-red-50';
      //   }
      //   return '';
      // },
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
                  <img src={require('./nodata.png')} />
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
