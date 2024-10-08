import React from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import Spinner from 'components/Spinner';
import { titleCase } from 'utils/misc';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

type AppProps = {
  importId: string;
  status: string;
};

const Report: React.FC<AppProps> = ({ importId, status }) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('components', {
    keyPrefix: 'jobProgress.Report',
  });

  const useInfiniteImportResultData = getApi(ApiEnum.GetImportReport);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteImportResultData({
      importId,
      startFetching: true,
      q: { status },
    });

  const flatData: any[] = (
    data?.pages.flatMap((page: any) => {
      return page?.data?.result?.data?.map((user: any) => user);
    }) || []
  ).map((f: any, idx: number) => ({ idx: idx + 1, ...f }));

  const columns: any[] = [
    { key: 'idx', name: '', width: 40 },
    {
      key: 'name',
      name: t('columns.name'),
      resizable: true,
      width: 200,
      renderCell: ({ row }: any) => {
        return row.rowData?.fullName?.value;
      },
    },
    {
      key: 'email',
      name: t('columns.email'),
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.email?.value;
      },
    },
    {
      key: 'managerEmail',
      name: t('columns.managerEmail'),
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.managerEmail?.value;
      },
    },
    {
      key: 'designation',
      name: t('columns.designation'),
      resizable: true,
      width: 180,
      renderCell: ({ row }: any) => {
        return row.rowData?.designation?.value;
      },
    },
    {
      key: 'department',
      name: t('columns.department'),
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.department?.value;
      },
    },
    {
      key: 'location',
      name: t('columns.location'),
      resizable: true,
      width: 220,
      renderCell: ({ row }: any) => {
        return row.rowData?.workLocation?.value || row.rowData?.location?.value;
      },
    },
    {
      key: 'employeeId',
      name: t('columns.employeeId'),
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.employeeId?.value;
      },
    },
    {
      key: 'phoneNumber',
      name: t('columns.phone'),
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.workPhone?.value || row.rowData?.phoneNumber?.value;
      },
    },
    {
      key: 'dateOfBirth',
      name: t('columns.dateOfBirth'),
      resizable: true,
      width: 140,
      renderCell: ({ row }: any) => {
        return row.rowData?.birthDate?.value || row.rowData?.dateOfBirth?.value;
      },
    },
    {
      key: 'dateOfJoining',
      name: t('columns.dateOfJoining'),
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
      name: t('columns.maritalStatus'),
      resizable: true,
      width: 120,
      renderCell: ({ row }: any) => {
        return row.rowData?.maritalStatus?.value;
      },
    },
    {
      key: 'role',
      name: t('columns.role'),
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
      name: t('columns.error'),
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
                  <img src={require('./nodata.png')} alt={t('noDataAlt')} />
                  <div className="pt-4 text-2xl font-bold">
                    {t('noDataToDisplay')}
                  </div>
                </div>
              )}
              {isFetchingNextPage && (
                <div className="text-xs font-bold text-neutral-500 text-center">
                  {t('loading')}
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
