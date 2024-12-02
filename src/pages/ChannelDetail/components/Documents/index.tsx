import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Card from 'components/Card';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import useModal from 'hooks/useModal';
import NoDataFound from 'components/NoDataFound';
import Divider from 'components/Divider';
import EntitySelectModal from './components/EntitySelectModal';
import AddFolderModal from './components/AddFolderModal';
import DataGrid from 'components/DataGrid';
import { ColumnDef } from '@tanstack/react-table';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useDataGrid } from 'hooks/useDataGrid';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { usePermissions } from 'hooks/usePermissions';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import { ChannelPermissionEnum } from '../utils/channelPermission';
import { Doc as DocType } from 'interfaces';
import Doc, { getIconFromMime } from './components/Doc';
import FilterMenuDocument from './components/FilterMenuDocument';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import BreadCrumb from 'components/BreadCrumb';
import { DocumentPathContext } from 'contexts/DocumentPathContext';
import RecentlyAddedEntities from './components/RecentlyAddedEntities';
import ActionMenu from './components/ActionMenu';
import Avatar from 'components/Avatar';
import Skeleton from 'react-loading-skeleton';
import FilePreviewModal from './components/FilePreviewModal';

export enum DocIntegrationEnum {
  Sharepoint = 'SHAREPOINT',
  GoogleDrive = 'GOOGLE_DRIVE',
}

interface IForm {
  selectAll: boolean;
}

interface IDocumentProps {
  permissions: ChannelPermissionEnum[];
}

const Document: FC<IDocumentProps> = ({ permissions }) => {
  const [isOpen, openModal, closeModal] = useModal();
  const [isAddModalOpen, openAddModal, closeAddModal] = useModal();
  const { control } = useForm<IForm>();
  const [totalRows, setTotalRows] = useState<number>(0);
  const { getApi } = usePermissions();
  const { channelId } = useParams();
  const { items, appendItem, sliceItems } = useContext(DocumentPathContext);
  const [view, setView] = useState<'LIST' | 'GRID'>('GRID');
  const [filePreview, openFilePreview, closeFilePreview, filePreviewProps] =
    useModal();

  const useChannelDocumentStatus = getApi(ApiEnum.GetChannelDocumentStatus);
  const {
    data: statusResponse,
    isLoading,
    refetch,
  } = useChannelDocumentStatus({
    channelId,
  });

  const isBaseFolderSet = statusResponse?.status === 'ACTIVE';
  const isConnectionMade =
    isBaseFolderSet ||
    (statusResponse?.status === 'INACTIVE' &&
      statusResponse.availableAccounts.length > 0);
  const integrationType: DocIntegrationEnum = DocIntegrationEnum.Sharepoint;
  const availableAccount = statusResponse?.availableAccounts[0];

  const updateConnection = getApi(ApiEnum.UpdateChannelDocumentConnection);
  const updateConnectionMutation = useMutation({
    mutationKey: ['update-channel-connection', channelId],
    mutationFn: updateConnection,
  });

  const allOptions = [
    {
      label: 'Remove from starred',
      onClick: () => {},
      dataTestId: 'folder-menu',
      enabled: true,
      className: '!px-6 !py-2',
    },
    {
      label: 'Download',
      onClick: () => {},
      dataTestId: 'folder-menu',
      enabled: true,
      className: '!px-6 !py-2',
    },
  ];

  const columnsListView = React.useMemo<ColumnDef<DocType>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Layout
            fields={[
              {
                type: FieldType.Checkbox,
                name: `selectAll`,
                inputClassName: '!w-4 !h-4 text-white',
                control,
                dataTestId: `select-all`,
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: (e: any) => {
                  e.stopPropagation();
                  table.getToggleAllRowsSelectedHandler();
                },
              },
            ]}
            className={`items-center group-hover/row:flex ${
              table.getIsAllRowsSelected() ? 'flex' : 'hidden'
            }`}
          />
        ),
        cell: ({ row }) => (
          <Layout
            fields={[
              {
                type: FieldType.Checkbox,
                name: `selectAll`,
                inputClassName: '!w-4 !h-4 text-white',
                control,
                dataTestId: `select-all`,
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: (e: any) => {
                  e.stopPropagation();
                  row.getToggleSelectedHandler();
                },
              },
            ]}
            className={`items-center group-hover/row:flex ${
              row.getIsSelected() ? 'flex' : 'hidden'
            }`}
          />
        ),
        size: 16,
      },
      {
        accessorKey: 'name',
        header: () => (
          <div className="font-bold text-neutral-500">
            File Name ({totalRows})
          </div>
        ),
        cell: (info) => (
          <div className="flex gap-2 font-medium text-neutral-900 leading-6">
            <Icon
              name={
                info?.row?.original?.isFolder
                  ? 'dir'
                  : getIconFromMime(info.row.original.mimeType)
              }
            />
            {info.getValue() as string}
          </div>
        ),
        thClassName: 'flex-1',
        tdClassName: 'flex-1',
      },
      {
        accessorKey: 'ownerName',
        header: () => <div className="font-bold text-neutral-500">Owner</div>,
        cell: (info) => (
          <div className="flex gap-2 items-center">
            <Avatar
              image={info.row.original?.ownerImage}
              name={info.row.original?.ownerName}
              size={24}
            />
            <span className="truncate">{info.row.original?.ownerName}</span>
          </div>
        ),
        size: 256,
      },
      {
        accessorKey: 'modifiedAt',
        header: () => (
          <div className="font-bold text-neutral-500">Last Updated</div>
        ),
        cell: (info) => (
          <div className="flex gap-2 font-medium text-neutral-900 leading-6">
            {info.getValue() as string}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: 'more',
        header: () => '',
        cell: () => (
          <PopupMenu
            triggerNode={
              <div
                className="cursor-pointer relative"
                data-testid="feed-post-ellipsis"
                title="more"
              >
                <Icon name="moreV2Filled" tabIndex={0} size={16} />
              </div>
            }
            menuItems={allOptions}
            className="right-0 top-full border-1 border-neutral-200 focus-visible:outline-none w-44"
          />
        ),
        size: 16,
        tdClassName: 'items-center relative',
      },
    ],
    [totalRows],
  );

  const columnsGridView = React.useMemo<ColumnDef<DocType>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => <Doc doc={info.row.original} />,
      },
    ],
    [],
  );

  const dataGridProps = useDataGrid<DocType>({
    apiEnum: ApiEnum.GetChannelFiles,
    isInfiniteQuery: false,
    payload: {
      channelId,
      params: {
        folderId: items.length === 1 ? undefined : items[items.length - 1].id,
      },
    },
    isEnabled: !isLoading,
    loadingGrid: (
      <Skeleton
        containerClassName="!rounded-15xl !w-[213px] !h-[147px] relative"
        className="!absolute !w-full top-0 left-0 h-full !rounded-15xl"
      />
    ),
    dataGridProps: {
      columns: view === 'LIST' ? columnsListView : columnsGridView,
      isRowSelectionEnabled: true,
      view,
      onRowClick: (e, table, virtualRow, isDoubleClick) => {
        if (virtualRow.original.isFolder && isDoubleClick) {
          // If double click on folder then navigate to that folder
          appendItem({
            id: virtualRow.original.id,
            label: virtualRow?.original?.name,
          });
          table.setRowSelection({});
          return;
        } else if (!!!virtualRow.original.isFolder && isDoubleClick) {
          openFilePreview(virtualRow.original);
          return;
        }
        if (!isDoubleClick) {
          // If single click select file / folder
          table.setRowSelection((param) => {
            return {
              ...param,
              [virtualRow.index]: !!!param[virtualRow.index],
            };
          });
        }
      },
      noDataFound: (
        <NoDataFound
          labelHeader="No documents found"
          clearBtnLabel="Upload now"
        />
      ),
    },
  });

  useEffect(() => {
    setTotalRows((dataGridProps?.flatData || []).length);
  }, [dataGridProps.flatData]);

  const NoConnection = () =>
    permissions.includes(ChannelPermissionEnum.CanConnectChannelDoc) ? (
      <Fragment>
        <NoDataFound
          illustration={isConnectionMade ? 'noChannelFound' : 'noResultAlt'}
          hideClearBtn
          hideText
        />
        <div className="flex flex-col gap-4 justify-between">
          {isConnectionMade ? (
            <p className="w-full text-2xl font-semibold text-neutral-900 text-center">
              Activate folder
            </p>
          ) : (
            <p className="w-full text-2xl font-semibold text-neutral-900 text-center">
              Integration not enabled for this organization
            </p>
          )}
          <Divider />
          {isConnectionMade ? (
            <p className="text-center text-lg font-medium text-neutral-900">
              Activate your preferred folder/site from google drive or
              sharepoint to create, share and collaborate on files and folders
              in this channel.
            </p>
          ) : (
            <p className="text-center text-lg font-medium text-neutral-900">
              To view your files in EX, you need to enable google drive or share
              point integration.
            </p>
          )}
        </div>
        {isConnectionMade ? (
          <div className="flex gap-6 w-full justify-center">
            <Button
              label="Select existing"
              variant={ButtonVariant.Secondary}
              size={Size.Small}
              onClick={openModal}
            />
            {integrationType !== DocIntegrationEnum.Sharepoint && (
              <Button
                label="Add new"
                leftIcon="plus"
                size={Size.Small}
                onClick={openAddModal}
              />
            )}
          </div>
        ) : (
          <div className="flex gap-6 w-full justify-center">
            <Button
              label="Connect"
              size={Size.Small}
              onClick={openModal}
              variant={ButtonVariant.Primary}
            />
          </div>
        )}
      </Fragment>
    ) : (
      <NoDataFound hideClearBtn labelHeader="No documents found" />
    );

  const selectedItems = useMemo(() => {
    const items: any = [];
    Object.keys(dataGridProps.rowSelection).forEach((index) => {
      if (!!dataGridProps.rowSelection[index]) {
        items.push(dataGridProps.flatData[index]);
      }
    });
    return items;
  }, [dataGridProps.rowSelection]);

  return isLoading ? (
    <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white overflow-hidden">
      <p className="font-bold text-2xl text-neutral-900">Documents</p>
      <Spinner className="flex w-full justify-center" />
    </Card>
  ) : (
    <Fragment>
      <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white">
        <div className="flex justify-between">
          <BreadCrumb
            items={items}
            onItemClick={(item) => sliceItems(item.id)}
          />
        </div>
        {isBaseFolderSet ? (
          <Fragment>
            <RecentlyAddedEntities />
            {dataGridProps.isRowSelected ? (
              <ActionMenu
                selectedItems={selectedItems}
                view={view}
                changeView={(view) => setView(view)}
                onDeselect={() => {
                  dataGridProps.setRowSelection({});
                }}
              />
            ) : (
              <FilterMenuDocument
                view={view}
                changeView={(view) => setView(view)}
              />
            )}
            <DataGrid {...dataGridProps} />
          </Fragment>
        ) : (
          <NoConnection />
        )}
      </Card>
      {isOpen && (
        <EntitySelectModal
          isOpen={isOpen}
          closeModal={closeModal}
          onSelect={(entity: any, callback: () => void) =>
            updateConnectionMutation.mutate(
              {
                channelId: channelId,
                folderId: entity[0].id,
                name: entity[0].name,
                orgProviderId: availableAccount?.orgProviderId,
              } as any,
              {
                onSettled: callback,
                onSuccess: () => {
                  successToastConfig({
                    content: `${entity[0].name} connected successfully`,
                  });
                  refetch();
                },
                onError: () => {
                  failureToastConfig({
                    content: 'Fail to connect, Try again!',
                  });
                },
              },
            )
          }
          q={{ orgProviderId: availableAccount?.orgProviderId }}
          integrationType={integrationType}
        />
      )}
      {isAddModalOpen && (
        <AddFolderModal
          isOpen={isAddModalOpen}
          closeModal={closeAddModal}
          onSelect={(folderName) => {
            console.log(folderName);
            openModal();
            closeAddModal();
          }}
        />
      )}
      {filePreview && (
        <FilePreviewModal
          file={(filePreviewProps as DocType) || {}}
          open={filePreview}
          closeModal={closeFilePreview}
        />
      )}
    </Fragment>
  );
};

export default Document;
