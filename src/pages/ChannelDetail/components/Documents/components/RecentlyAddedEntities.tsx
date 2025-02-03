import Icon from 'components/Icon';
import { Doc } from 'interfaces';
import React, { FC, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getIconFromMime } from './Doc';
import { getUtcMiliseconds, humanizeTime } from 'utils/time';
import { DocumentPathContext } from 'contexts/DocumentPathContext';
import DataGrid from 'components/DataGrid';
import { useDataGrid } from 'hooks/useDataGrid';
import { ColumnDef } from '@tanstack/table-core';
import NoDataFound from 'components/NoDataFound';
import Skeleton from 'react-loading-skeleton';
import Truncate from 'components/Truncate';
import { useTranslation } from 'react-i18next';
import { compressString } from 'utils/misc';
import useNavigate from 'hooks/useNavigation';
import moment from 'moment';

interface IRecentlyAddedEntitiesProps {
  disableActions: boolean;
}

const RecentlyAddedEntities: FC<IRecentlyAddedEntitiesProps> = ({
  disableActions,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { items } = useContext(DocumentPathContext);
  const { channelId } = useParams();
  const isRootDir = items.length === 1;
  const navigate = useNavigate();

  const columns = React.useMemo<ColumnDef<Doc>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => (
          <div className="flex w-[233px] items-center p-2 gap-1 border border-neutral-200 rounded-9xl hover:border-yellow-300 cursor-pointer">
            <div
              className={`flex w-8 h-8 items-center justify-center rounded-full shadow-md ${
                !!!info?.row?.original?.isFolder && 'border border-neutral-200'
              }`}
            >
              <Icon
                name={
                  isRootDir || info.row.original.isFolder
                    ? 'folder'
                    : getIconFromMime(info.row.original.mimeType)
                }
                size={16}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Truncate
                text={info.row.original?.name}
                className="text-xs font-medium text-neutral-900 w-[176px]"
              />
              {info?.row?.original?.externalCreatedAt && (
                <div className="text-xxs font-medium text-neutral-500">
                  {t('addedOn', {
                    date: humanizeTime(info.row.original.externalCreatedAt),
                  })}
                </div>
              )}
            </div>
          </div>
        ),
      },
    ],
    [isRootDir],
  );

  const dataGridProps = useDataGrid<Doc>({
    apiEnum: ApiEnum.GetChannelFiles,
    isInfiniteQuery: false,
    payload: {
      channelId,
      params: {
        rootFolderId: items.length > 1 ? items[1].id : undefined,
        folderId: items.length < 3 ? undefined : items[items.length - 1].id,
        sort: 'external_created_at',
        createdAfter: getUtcMiliseconds(
          moment().subtract(7, 'days').startOf('D').valueOf(),
        ),
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
      onRowClick: (e, table, virtualRow) => {
        if (
          virtualRow.original.isFolder ||
          (!!!virtualRow.original.isFolder && !disableActions)
        ) {
          const encodedPath = compressString(
            JSON.stringify(virtualRow?.original.pathWithId),
          );
          navigate(`/channels/${channelId}/documents/${encodedPath}`);
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
      <p className="text-base font-bold text-neutral-900">
        {t('recentlyAdded')}
      </p>
      <div className="flex gap-6">
        <DataGrid
          {...dataGridProps}
          flatData={dataGridProps.flatData.slice(0, 5).map((doc: any) => ({
            ...doc,
            pathWithId:
              items.length === 1
                ? [{ id: doc.id, name: doc.name, type: 'Folder' }]
                : doc.pathWithId,
          }))}
        />
      </div>
    </div>
  );
};

export default RecentlyAddedEntities;
