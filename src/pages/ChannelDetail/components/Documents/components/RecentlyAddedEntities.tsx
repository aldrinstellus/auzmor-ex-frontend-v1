import Icon from 'components/Icon';
import { Doc } from 'interfaces';
import React, { FC, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getIconFromMime } from './Doc';
import { humanizeTime } from 'utils/time';
import { DocumentPathContext } from 'contexts/DocumentPathContext';
import DataGrid from 'components/DataGrid';
import { useDataGrid } from 'hooks/useDataGrid';
import { ColumnDef } from '@tanstack/table-core';
import NoDataFound from 'components/NoDataFound';
import Skeleton from 'react-loading-skeleton';
import FilePreviewModal from './FilePreviewModal';
import useModal from 'hooks/useModal';
// import moment from 'moment';

interface IRecentlyAddedEntitiesProps {}

const RecentlyAddedEntities: FC<IRecentlyAddedEntitiesProps> = ({}) => {
  const { items, appendItem } = useContext(DocumentPathContext);
  const { channelId } = useParams();
  const [filePreview, openFilePreview, closeFilePreview, filePreviewProps] =
    useModal();

  const columns = React.useMemo<ColumnDef<Doc>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => (
          <div className="flex w-[233px] p-2 gap-1 border border-neutral-200 rounded-9xl hover:border-yellow-300 cursor-pointer">
            <div className="flex w-8 h-8 items-center justify-center border rounded-full shadow-md border-neutral-200">
              <Icon
                name={
                  info.row.original.isFolder
                    ? 'dir'
                    : getIconFromMime(info.row.original.mimeType)
                }
                size={16}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium leading-[18px] text-neutral-900">
                {info.row.original?.name}
              </div>
              <div className="text-[8px] font-medium text-neutral-500 leading-3">
                added{' '}
                {info.row.original.externalCreatedAt
                  ? humanizeTime(info.row.original.externalCreatedAt)
                  : 'while ago'}
              </div>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const dataGridProps = useDataGrid<Doc>({
    apiEnum: ApiEnum.GetChannelFiles,
    isInfiniteQuery: false,
    payload: {
      channelId,
      params: {
        folderId: items.length === 1 ? undefined : items[items.length - 1].id,
        // modifiedAfter: moment().startOf('D').subtract(10, 'Q').valueOf(),
        limit: 5,
      },
    },
    isEnabled: true,
    loadingGrid: (
      <Skeleton
        containerClassName="!rounded-15xl !w-[233px] !h-[53px] relative"
        className="!absolute !w-full top-0 left-0 h-full !rounded-15xl"
      />
    ),
    dataGridProps: {
      columns,
      isRowSelectionEnabled: false,
      view: 'GRID',
      onRowClick: (e, table, virtualRow, isDoubleClick) => {
        if (virtualRow.original.isFolder && isDoubleClick) {
          appendItem({
            id: virtualRow.original.id,
            label: virtualRow?.original?.name,
          });
        } else if (!!!virtualRow.original.isFolder && isDoubleClick) {
          openFilePreview(virtualRow.original);
          return;
        }
      },
      noDataFound: <NoDataFound hideClearBtn />,
    },
  });

  if (dataGridProps?.flatData.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base font-bold text-neutral-900">Recently added</p>
      <div className="flex gap-6">
        <DataGrid
          {...dataGridProps}
          flatData={dataGridProps.flatData.slice(0, 5)}
        />
      </div>
      {filePreview && (
        <FilePreviewModal
          file={(filePreviewProps as Doc) || {}}
          open={filePreview}
          closeModal={closeFilePreview}
        />
      )}
    </div>
  );
};

export default RecentlyAddedEntities;
