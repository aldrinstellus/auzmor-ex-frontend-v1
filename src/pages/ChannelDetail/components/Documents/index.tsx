import React, {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { useDataGrid } from 'hooks/useDataGrid';
import Icon from 'components/Icon';
import PopupMenu, { IMenuItem } from 'components/PopupMenu';
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
import BreadCrumb, { BreadCrumbVariantEnum } from 'components/BreadCrumb';
import { DocumentPathContext } from 'contexts/DocumentPathContext';
import RecentlyAddedEntities from './components/RecentlyAddedEntities';
import ActionMenu from './components/ActionMenu';
import Avatar from 'components/Avatar';
import Skeleton from 'react-loading-skeleton';
import FilePreviewModal from './components/FilePreviewModal';
import moment from 'moment';
import { useChannelDocUpload } from 'hooks/useUpload';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import {
  BackgroundJob,
  BackgroundJobStatusEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';
import queryClient from 'utils/queryClient';
import { downloadFromUrl, getLearnUrl, isThisAFile } from 'utils/misc';
import { IChannel, useChannelStore } from 'stores/channelStore';
import RenameChannelDocModal from './components/RenameChannelDocModal';
import ConfirmationBox from 'components/ConfirmationBox';
import DocSearch from './components/DocSearch';
import Popover from 'components/Popover';

export enum DocIntegrationEnum {
  Sharepoint = 'SHAREPOINT',
  GoogleDrive = 'GOOGLE_DRIVE',
}

export interface IForm {
  selectAll: boolean;
  documentSearch: string;
  docType?: Record<string, any>;
  applyDocumentSearch: string;
}

interface IDocumentProps {
  channelData: IChannel;
  permissions: ChannelPermissionEnum[];
}

const Document: FC<IDocumentProps> = ({ channelData, permissions }) => {
  const [isOpen, openModal, closeModal] = useModal();
  const [isAddModalOpen, openAddModal, closeAddModal] = useModal();
  const [totalRows, setTotalRows] = useState<number>(0);
  const [view, setView] = useState<'LIST' | 'GRID'>('LIST');
  const [confirm, showConfirm, closeConfirm, deleteDocProps] = useModal();
  const [filePreview, openFilePreview, closeFilePreview, filePreviewProps] =
    useModal();
  const [renameModal, showRenameModal, closeRenameModal, renameModalProps] =
    useModal();
  const { control, watch, setValue } = useForm<IForm>({
    defaultValues: {
      applyDocumentSearch: '',
      documentSearch: '',
    },
  });
  const { getApi } = usePermissions();
  const { channelId = '' } = useParams();
  const { items, appendItem, sliceItems, setItems } =
    useContext(DocumentPathContext);
  const { uploadMedia } = useChannelDocUpload(channelId);
  const { filters } = useAppliedFiltersStore();
  const { setRootFolderId } = useChannelStore();
  const { setJobs, getIconFromStatus, setJobTitle, setJobsRenderer, setShow } =
    useBackgroundJobStore();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, applyDocumentSearch, documentSearch] = watch([
    'docType',
    'applyDocumentSearch',
    'documentSearch',
  ]);
  const getChannelDocDownloadUrl = getApi(ApiEnum.GetChannelDocDownloadUrl);
  const deleteChannelDoc = getApi(ApiEnum.DeleteChannelDoc);

  // Api call: Check connection status
  const useChannelDocumentStatus = getApi(ApiEnum.GetChannelDocumentStatus);
  const {
    data: statusResponse,
    isLoading,
    refetch,
  } = useChannelDocumentStatus({
    channelId,
  });

  // Api call: Create folder mutation
  const createChannelDocFolder = getApi(ApiEnum.CreateChannelDocFolder);
  const createFolderMutation = useMutation({
    mutationKey: ['create-channel-doc-folder'],
    mutationFn: createChannelDocFolder,
    onSuccess: () => {
      successToastConfig({ content: 'Folder created successfully' });
    },
    onError: () => {
      failureToastConfig({ content: 'Folder creation failed' });
    },
  });

  // Api call: Connect site / folder
  const updateConnection = getApi(ApiEnum.UpdateChannelDocumentConnection);
  const updateConnectionMutation = useMutation({
    mutationKey: ['update-channel-connection', channelId],
    mutationFn: updateConnection,
  });

  // Initialise rename file mutation
  const renameChannelFileMutation = useMutation({
    mutationFn: getApi(ApiEnum.RenameChannelFile),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['get-channel-files'], {
        exact: false,
      });
      successToastConfig({ content: 'File renamed successfully' });
      dataGridProps.setRowSelection({});
    },
    onError: () => {
      failureToastConfig({ content: 'File rename failed' });
    },
  });

  // Initialise rename folder mutation
  const renameChannelFolderMutation = useMutation({
    mutationFn: getApi(ApiEnum.RenameChannelFolder),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['get-channel-files'], {
        exact: false,
      });
      successToastConfig({ content: 'Folder renamed successfully' });
      dataGridProps.setRowSelection({});
    },
    onError: () => {
      failureToastConfig({ content: 'Folder rename failed' });
    },
  });

  // Api call: Handle rename file / folder
  const handleRename = async (name: string) => {
    if (selectedItems[0].isFolder) {
      renameChannelFolderMutation.mutate({
        channelId,
        name,
        folderId: selectedItems[0].id,
      } as any);
    } else {
      renameChannelFileMutation.mutate({
        channelId,
        name,
        fileId: selectedItems[0].id,
      } as any);
    }
  };

  // Api call: delete document
  const handleDeleteDoc = async () => {
    closeConfirm();
    try {
      await deleteChannelDoc({ channelId, itemId: deleteDocProps?.doc.id });
      successToastConfig({
        content: `“${deleteDocProps?.doc?.name}” file deleted`,
      });
    } catch (e) {
      failureToastConfig({
        content: `Failed to delete ${deleteDocProps?.doc?.name}`,
        dataTestId: 'file-delete-toaster',
      });
    }
    await queryClient.invalidateQueries(['get-channel-files'], {
      exact: false,
    });
  };

  // State management flags
  const isBaseFolderSet = statusResponse?.status === 'ACTIVE';
  const isConnectionMade =
    isBaseFolderSet ||
    (statusResponse?.status === 'INACTIVE' &&
      statusResponse.availableAccounts.length > 0);
  const integrationType: DocIntegrationEnum = DocIntegrationEnum.Sharepoint;
  const availableAccount = statusResponse?.availableAccounts[0];
  const isRootDir = items.length === 1;

  // A function that decides what options to show on each row of documents
  const getAllOptions = useCallback((info: CellContext<DocType, unknown>) => {
    const showDownload =
      !!channelData?.settings?.restriction?.canDownloadDocuments &&
      !!info?.row?.original?.downloadable &&
      !!!info?.row?.original?.isFolder;
    return [
      {
        label: 'Rename',
        onClick: (e: Event) => {
          e.stopPropagation();
          showRenameModal({ name: info?.row?.original?.name });
        },
        dataTestId: 'folder-menu',
        className: '!px-6 !py-2',
        isHidden: false,
      },
      {
        label: 'Remove from starred',
        onClick: (e: Event) => {
          e.stopPropagation();
        },
        dataTestId: 'folder-menu',
        className: '!px-6 !py-2',
        isHidden: true,
      },
      {
        label: 'Download',
        onClick: async (e: Event) => {
          e.stopPropagation();
          try {
            const { data } = await getChannelDocDownloadUrl({
              channelId,
              itemId: info?.row?.original?.id,
            });
            downloadFromUrl(
              data?.result?.data?.downloadUrl,
              data?.result?.data?.name,
            );
          } catch (e) {
            failureToastConfig({
              content: `Failed to download ${info?.row?.original?.name}`,
              dataTestId: 'file-download-toaster',
            });
          }
        },
        dataTestId: 'folder-menu',
        className: '!px-6 !py-2',
        isHidden: !showDownload,
      },
      {
        label: 'Delete',
        onClick: (e: Event) => {
          e.stopPropagation();
          showConfirm({ doc: info?.row?.original });
        },
        dataTestId: 'folder-menu',
        className: '!px-6 !py-2 [&_*]:text-red-500',
        isHidden: false,
      },
    ].filter((option) => !option?.isHidden) as any as IMenuItem[];
  }, []);

  // A function to get formated props for location breadcrumb
  const getMappedLocation = (doc: DocType) => {
    let items = [
      { id: 'root', label: 'Documents' },
      ...Object.keys(doc?.pathWithId || {}).map((key) => ({
        id: doc?.pathWithId[key],
        label: key,
      })),
    ];
    if (!doc.isFolder) {
      items = items.slice(0, -1);
    }
    return items;
  };

  // Columns configuration for Datagrid component for List view
  const columnsListView = React.useMemo<ColumnDef<DocType>[]>(
    () =>
      [
        // {
        //   id: 'select',
        //   header: ({ table }) => (
        //     <Layout
        //       fields={[
        //         {
        //           type: FieldType.Checkbox,
        //           name: `selectAll`,
        //           inputClassName: '!w-4 !h-4 text-white',
        //           control,
        //           dataTestId: `select-all`,
        //           checked: table.getIsAllRowsSelected(),
        //           indeterminate: table.getIsSomeRowsSelected(),
        //           onChange: (e: any) => {
        //             e.stopPropagation();
        //             table.getToggleAllRowsSelectedHandler();
        //           },
        //         },
        //       ]}
        //       className={`items-center group-hover/row:flex ${
        //         table.getIsAllRowsSelected() ? 'flex' : 'hidden'
        //       }`}
        //     />
        //   ),
        //   cell: ({ row }: CellContext<DocType, unknown>) => (
        //     <Layout
        //       fields={[
        //         {
        //           type: FieldType.Checkbox,
        //           name: `selectAll`,
        //           inputClassName: '!w-4 !h-4 text-white',
        //           control,
        //           dataTestId: `select-all`,
        //           checked: row.getIsSelected(),
        //           indeterminate: row.getIsSomeSelected(),
        //           onChange: (e: any) => {
        //             e.stopPropagation();
        //             row.getToggleSelectedHandler();
        //           },
        //         },
        //       ]}
        //       className={`items-center group-hover/row:flex ${
        //         row.getIsSelected() ? 'flex' : 'hidden'
        //       }`}
        //     />
        //   ),
        //   size: 16,
        // },
        {
          accessorKey: 'name',
          header: () => (
            <div className="font-bold text-neutral-500">
              File Name ({totalRows})
            </div>
          ),
          cell: (info: CellContext<DocType, unknown>) => (
            <div className="flex gap-2 font-medium text-neutral-900 leading-6 w-full">
              <div className="flex w-6">
                <Icon
                  name={
                    isRootDir || info?.row?.original?.isFolder
                      ? 'folder'
                      : getIconFromMime(info.row.original.mimeType)
                  }
                  className="!w-6"
                />
              </div>
              <span className="break-all truncate w-full">
                {info.getValue() as string}
              </span>
            </div>
          ),
          thClassName: 'flex-1',
          tdClassName: 'flex-1',
        },
        {
          accessorKey: 'ownerName',
          header: () => <div className="font-bold text-neutral-500">Owner</div>,
          cell: (info: CellContext<DocType, unknown>) => (
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
          cell: (info: CellContext<DocType, unknown>) => (
            <div className="flex gap-2 font-medium text-neutral-900 leading-6">
              {
                moment(info.getValue() as string).format(
                  'MMMM DD,YYYY',
                ) as string
              }
            </div>
          ),
          size: 200,
        },
        {
          accessorKey: 'more',
          header: () => '',
          cell: (info: CellContext<DocType, unknown>) => {
            const options = getAllOptions(info);
            return options.length > 0 ? (
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
                menuItems={options}
                className="right-0 top-full border-1 border-neutral-200 focus-visible:outline-none w-44"
              />
            ) : (
              <></>
            );
          },
          size: 16,
          tdClassName: 'items-center relative',
        },
      ].filter((each) => {
        if (each.accessorKey === 'ownerName' && isRootDir) {
          return false;
        }
        if (
          each.accessorKey === 'location' &&
          (isRootDir || applyDocumentSearch === '')
        ) {
          return false;
        }
        if (each.accessorKey === 'more' && isRootDir) {
          return false;
        }
        return true;
      }),
    [totalRows, isRootDir, applyDocumentSearch],
  );

  // Columns configuration for Datagrid component for List view
  const columnsDeepSearchListView = React.useMemo<ColumnDef<DocType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="font-bold text-neutral-500">
            File Name ({totalRows})
          </div>
        ),
        cell: (info: CellContext<DocType, unknown>) => (
          <div className="flex gap-2 font-medium text-neutral-900 leading-6 w-full">
            <div className="flex w-6">
              <Icon
                name={
                  info?.row?.original?.isFolder
                    ? 'folder'
                    : getIconFromMime(info.row.original.mimeType)
                }
                className="!w-6"
              />
            </div>
            <span className="break-all truncate w-full">
              {info.getValue() as string}
            </span>
          </div>
        ),
        thClassName: 'flex-1',
        tdClassName: 'flex-1',
      },
      {
        accessorKey: 'ownerName',
        header: () => <div className="font-bold text-neutral-500">Owner</div>,
        cell: (info: CellContext<DocType, unknown>) => (
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
        cell: (info: CellContext<DocType, unknown>) => (
          <div className="flex gap-2 font-medium text-neutral-900 leading-6">
            {moment(info.getValue() as string).format('MMMM DD,YYYY') as string}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: 'location',
        header: () => (
          <div className="font-bold text-neutral-500">Location</div>
        ),
        cell: (info: CellContext<DocType, unknown>) => (
          <Popover
            triggerNode={
              <BreadCrumb
                items={getMappedLocation(info?.row?.original)}
                onItemClick={(item) => console.log(item)}
              />
            }
            triggerNodeClassName="w-full"
            wrapperClassName="w-full"
            contentRenderer={() => (
              <div className="flex p-3 bg-primary-50 rounded-9xl border border-primary-50 shadow">
                <BreadCrumb
                  items={getMappedLocation(info?.row?.original)}
                  className="hover:text-primary-500 hover:underline min-w-max"
                  onItemClick={(item) => {
                    const items = getMappedLocation(info?.row?.original);
                    const sliceIndex = items.findIndex(
                      (eachItem) => eachItem.id === item.id,
                    );
                    if (sliceIndex >= 0) {
                      console.log(items.slice(0, sliceIndex));
                      setItems(items.slice(0, sliceIndex + 1));
                    }
                  }}
                />
              </div>
            )}
          />
        ),
        size: 260,
      },
      {
        accessorKey: 'more',
        header: () => '',
        cell: (info: CellContext<DocType, unknown>) => {
          const options = getAllOptions(info);
          return options.length > 0 ? (
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
              menuItems={options}
              className="right-0 top-full border-1 border-neutral-200 focus-visible:outline-none w-44"
            />
          ) : (
            <></>
          );
        },
        size: 16,
        tdClassName: 'items-center relative',
      },
    ],
    [totalRows],
  );

  // Columns configuration for Datagrid component for Grid view
  const columnsGridView = React.useMemo<ColumnDef<DocType>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => <Doc doc={info.row.original} isFolder={isRootDir} />,
      },
    ],
    [],
  );

  // Get props for Datagrid component
  const dataGridProps = useDataGrid<DocType>({
    apiEnum:
      applyDocumentSearch === ''
        ? ApiEnum.GetInfiniteChannelFiles
        : ApiEnum.GetChannelDocDeepSearch,
    isInfiniteQuery: true,
    payload: {
      channelId,
      params:
        applyDocumentSearch === ''
          ? {
              rootFolderId: items.length > 1 ? items[1].id : undefined,
              folderId:
                items.length < 3 ? undefined : items[items.length - 1].id,
              sort: filters?.sort ? filters?.sort.split(':')[0] : undefined,
              order: filters?.sort ? filters?.sort.split(':')[1] : undefined,
              isFolder: docType ? !!(docType.value === 'folder') : undefined,
              owners: (filters?.docOwnerCheckbox || []).map(
                (owner: any) => owner.name,
              ),
              type: (filters?.docTypeCheckbox || []).map(
                (type: any) => type.paramKey,
              ),
            }
          : { q: applyDocumentSearch },
    },
    isEnabled: !isLoading,
    loadingGrid: (
      <Skeleton
        containerClassName="!rounded-15xl !w-[213px] !h-[147px] relative"
        className="!absolute !w-full top-0 left-0 h-full !rounded-15xl"
      />
    ),
    dataGridProps: {
      columns:
        view === 'LIST'
          ? applyDocumentSearch === ''
            ? columnsListView
            : columnsDeepSearchListView
          : columnsGridView,
      isRowSelectionEnabled: false,
      view,
      onRowClick: (e, table, virtualRow, isDoubleClick) => {
        if ((isRootDir || virtualRow.original.isFolder) && isDoubleClick) {
          // If double click on folder then navigate to that folder
          appendItem({
            id: virtualRow.original.id,
            label: virtualRow?.original?.name,
            meta: virtualRow.original,
          });
          // table.setRowSelection({});
          return;
        } else if (!!!virtualRow.original.isFolder && isDoubleClick) {
          openFilePreview(virtualRow.original);
          return;
        }
        if (!isDoubleClick) {
          // If single click select file / folder
          // table.setRowSelection((param) => {
          //   return {
          //     ...param,
          //     [virtualRow.index]: !!!param[virtualRow.index],
          //   };
          // });
        }
      },
      noDataFound: (
        <NoDataFound
          labelHeader="No documents found"
          clearBtnLabel="Upload now"
          onClearSearch={() => fileInputRef?.current?.click()}
        />
      ),
    },
  });

  // Hook to update total count of rows listed
  useEffect(() => {
    setTotalRows((dataGridProps?.flatData || []).length);
  }, [dataGridProps.flatData]);

  // Hook to update input tag attributes
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute('directory', '');
      folderInputRef.current.setAttribute('webkitdirectory', '');
      folderInputRef.current.setAttribute('multiple', '');
    }
  }, [isLoading]);

  // Hook to reset document search param
  useEffect(() => {
    if (documentSearch === '' && applyDocumentSearch !== '') {
      setValue('applyDocumentSearch', '');
    }
  }, [documentSearch, applyDocumentSearch]);

  // Hook to set rootfolder information in filters store to be consumed by document owners api call in filter by owners
  useEffect(() => {
    if (items.length > 1) {
      setRootFolderId(items[1].id);
    } else {
      if (items.length > 1) {
        setRootFolderId(undefined);
      }
    }
  }, [items]);

  // Component to render before connection.
  const NoConnection = () =>
    permissions.includes(ChannelPermissionEnum.CanConnectChannelDoc) ? (
      <Fragment>
        {isConnectionMade ? (
          <Fragment>
            <NoDataFound illustration="noChannelFound" hideClearBtn hideText />
            <div className="flex flex-col gap-4 justify-between">
              <p className="w-full text-2xl font-semibold text-neutral-900 text-center">
                Activate folder
              </p>
              <Divider />
              <p className="text-center text-lg font-medium text-neutral-900">
                Activate your preferred site from sharepoint to create, share
                and collaborate on files and folders in this channel.
              </p>
            </div>
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
          </Fragment>
        ) : (
          <Fragment>
            <div className="flex flex-col w-full border border-neutral-200 rounded-7xl px-6 py-10 gap-10">
              <div className="flex flex-col gap-4">
                <p className="font-bold text-neutral-900 text-center">
                  Enable integrations to view your files
                </p>
                <p className="text-neutral-900 text-center">
                  To view your files here, you need to enable SharePoint
                  integration
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  label="SharePoint"
                  size={Size.Small}
                  variant={ButtonVariant.Secondary}
                  leftIcon={'sharePoint'}
                  onClick={() =>
                    window.location.assign(
                      getLearnUrl('/settings/market-place'),
                    )
                  }
                  className="flex !text-[#036b70] group-hover:border-neutral-900 hover:border-neutral-900"
                />
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    ) : (
      <NoDataFound hideClearBtn labelHeader="No documents found" />
    );

  // Selected items to be used for action menu
  const selectedItems = useMemo(() => {
    const items: any = [];
    Object.keys(dataGridProps.rowSelection).forEach((index) => {
      if (!!dataGridProps.rowSelection[index]) {
        items.push(dataGridProps.flatData[index]);
      }
    });
    return items;
  }, [dataGridProps.rowSelection]);

  // Its a functional component that gives File upload job rendered
  const fileUploadJobRenderer = useCallback(
    (
      id: string,
      jobData: { parentFolderId: string; file: File },
      progress: number,
      status: BackgroundJobStatusEnum,
      jobComment: string,
    ) => (
      <div className="flex gap-2 items-center py-3">
        <div className="w-6 h-6">
          <Icon name={getIconFromMime(jobData?.file.type)} />
        </div>
        <span className="items-center flex-grow trunc">
          <span>{jobData?.file.name}</span>&nbsp;
          {jobComment && (
            <span className="text-xxs font-medium text-neutral-500">
              ({jobComment})
            </span>
          )}
        </span>
        <div className="flex items-center">
          {getIconFromStatus(status, progress)}
        </div>
      </div>
    ),
    [],
  );

  // Its a functional component that gives Folder upload job rendered
  const folderUploadJobRenderer = useCallback((jobs: BackgroundJob[]) => {
    let completed = 0;
    let total = 0;
    let status = BackgroundJobStatusEnum.YetToStart;
    let completeJobCount = 0;
    jobs.forEach((job) => {
      completed += job.progress;
      total += 100;
      if (job.progress === 100) {
        completeJobCount += 1;
      }
    });
    const progress = Math.floor((completed * 100) / total);
    if (progress > 0 && progress < 100) {
      status = BackgroundJobStatusEnum.Running;
    } else if (progress === 100) {
      status = BackgroundJobStatusEnum.CompletedSuccessfully;
    }

    if (jobs?.length) {
      return (
        <div className="flex gap-2 items-center py-3">
          <Icon name="folder" hover={false} />
          <span className="flex-grow">
            {jobs[0].jobData?.file?.webkitRelativePath?.split('/')[0]}{' '}
          </span>
          <span className="text-neutral-500 text-xxs font-medium">
            {completeJobCount} of {Math.floor(total / 100)}
          </span>
          {getIconFromStatus(status, progress)}
        </div>
      );
    }
    return (
      <div className="flex w-full h-full items-center justify-center h-ful">
        <Spinner />
      </div>
    );
  }, []);

  return isLoading ? (
    <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white overflow-hidden">
      <p className="font-bold text-2xl text-neutral-900">Documents</p>
      <Spinner className="flex w-full justify-center" />
    </Card>
  ) : (
    <Fragment>
      <input
        id="input-file-upload"
        className="hidden"
        type="file"
        ref={fileInputRef}
        multiple={true}
        onChange={async (e: any) => {
          // Id of parent folder
          const parentFolderId =
            items.length <= 2 ? '' : items[items.length - 1].id.toString();

          // Id of root folderId
          const rootFolderId = items.length > 1 ? items[1].id.toString() : '';

          // Collection file with mapped parent folder id
          const files: {
            file: File;
            parentFolderId: string;
            rootFolderId: string;
          }[] = [];

          setJobTitle('Upload in progress...');

          let index = 0;
          const jobs: { [key: string]: any } = {};

          for (const file of Array.from(e.target.files) as File[]) {
            const isFile = await isThisAFile(file);
            files.push({ file, parentFolderId, rootFolderId });
            jobs[`upload-job-${index}`] = {
              id: `upload-job-${index}`,
              jobData: { file, parentFolderId },
              progress: isFile ? 0 : 100,
              status: isFile
                ? BackgroundJobStatusEnum.YetToStart
                : BackgroundJobStatusEnum.Cancelled,
              jobComment: !isFile && 'File not found',
              renderer: fileUploadJobRenderer,
            };
            index += 1;
          }

          setJobs(jobs);

          // Call your uploadMedia function here
          uploadMedia(files);
        }}
      />
      <input
        id="input-folder-upload"
        className="hidden"
        type="file"
        ref={folderInputRef}
        multiple={true}
        onChange={async (e: any) => {
          // Variable to store all new folder and respective ids and parent folder ids
          const folders: {
            [folderName: string]: { parentFolderId: string; id: string };
          } = {};

          // Id of root folder
          const parentFolderIdOriginal =
            items.length <= 2 ? '' : items[items.length - 1].id;

          const rootFolderId = items.length > 1 ? items[1].id : '';

          // Collection file with mapped parent folder id
          const files: {
            file: File;
            parentFolderId: string;
            rootFolderId: string;
          }[] = [];

          const allFiles: File[] = Array.from(e.target.files);

          setJobTitle('Analysing folder...');
          setJobsRenderer(folderUploadJobRenderer);
          setShow(true);

          for (const file of allFiles) {
            const folderNames = file.webkitRelativePath.split('/').slice(0, -1);
            let parentFolderId = parentFolderIdOriginal;

            // Process each folder in sequence
            for (const folderName of folderNames) {
              if (!folders[folderName]) {
                try {
                  const response: any = await createFolderMutation.mutateAsync({
                    channelId: channelId,
                    remoteFolderId: parentFolderId.toString(),
                    rootFolderId: rootFolderId.toString(),
                    name: folderName,
                  } as any);

                  const folderId = (response?.result?.data?.id).toString();
                  folders[folderName] = { id: folderId, parentFolderId };
                  parentFolderId = folderId; // Update parentFolderId for next folder
                } catch (error) {
                  console.error(
                    `Error creating folder "${folderName}":`,
                    error,
                  );
                  throw error; // Stop execution on error
                }
              } else {
                parentFolderId = folders[folderName].id.toString();
              }
            }

            files.push({ file, parentFolderId, rootFolderId });
          }

          setJobs(
            Object.assign(
              ...(files.map((each, index) => ({
                [`upload-job-${index}`]: {
                  id: `upload-job-${index}`,
                  jobData: each,
                  progress: 0,
                  status: BackgroundJobStatusEnum.YetToStart,
                  renderer: () => <></>,
                },
              })) as [{ [key: string]: any }]),
            ),
          );

          // Call your uploadMedia function here
          uploadMedia(files);
        }}
      />
      <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white">
        <div className="flex justify-between">
          <BreadCrumb
            variant={BreadCrumbVariantEnum.ChannelDoc}
            items={items}
            onItemClick={(item) => sliceItems(item.id)}
          />
          {isBaseFolderSet && (
            <div className="flex gap-2 items-center">
              <DocSearch
                control={control}
                watch={watch}
                onEnter={(value: string) =>
                  setValue('applyDocumentSearch', value)
                }
                onClick={(doc) => setItems(getMappedLocation(doc))}
              />
              {permissions.includes(
                ChannelPermissionEnum.CanCreateNewChannelDoc,
              ) && (
                <div className="relative">
                  <PopupMenu
                    triggerNode={
                      <Button
                        label="New"
                        leftIcon="add"
                        className="px-4 py-2 gap-1 h-10"
                        leftIconClassName="text-white focus:text-white group-focus:text-white"
                        leftIconHoverColor="text-white"
                        disabled={isRootDir}
                        size={Size.Small}
                      />
                    }
                    menuItems={[
                      {
                        renderNode: (
                          <div className="bg-blue-50 px-6 text-xs font-medium text-neutral-500 py-2">
                            Add new
                          </div>
                        ),
                        isBanner: true,
                      },
                      {
                        label: (
                          <div className="flex gap-2 items-center text-xs">
                            <Icon name={'folder'} size={16} /> Folder
                          </div>
                        ),
                        onClick: openAddModal,
                      },
                      {
                        renderNode: (
                          <div className="bg-blue-50 px-6 text-xs font-medium text-neutral-500 py-2">
                            Upload new
                          </div>
                        ),
                        isBanner: true,
                      },
                      {
                        label: (
                          <div className="flex gap-2.5 items-center text-xs">
                            <Icon name={'fileUpload'} size={16} /> File
                          </div>
                        ),
                        onClick: () => fileInputRef?.current?.click(),
                      },
                      {
                        label: (
                          <div className="flex gap-2.5 items-center text-xs">
                            <Icon name={'folderUpload'} size={16} /> Folder
                          </div>
                        ),
                        onClick: () => folderInputRef?.current?.click(),
                      },
                    ]}
                    className="right-0 mt-2 top-full border-1 border-neutral-200 focus-visible:outline-none w-[247px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {isBaseFolderSet ? (
          <Fragment>
            <RecentlyAddedEntities />
            <p className="text-base font-bold text-neutral-900">All files</p>
            {dataGridProps.isRowSelected ? (
              <ActionMenu
                selectedItems={selectedItems}
                view={view}
                channelData={channelData}
                changeView={(view) => setView(view)}
                onDeselect={() => {
                  dataGridProps.setRowSelection({});
                }}
                onRename={handleRename}
              />
            ) : (
              <FilterMenuDocument
                control={control}
                watch={watch}
                view={view}
                hideFilter={isRootDir}
                hideSort={isRootDir}
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
          onSelect={(entity: any, callback: () => void) => {
            updateConnectionMutation.mutate(
              {
                channelId: channelId,
                connections: entity,
                orgProviderId: availableAccount?.orgProviderId,
              } as any,
              {
                onSettled: callback,
                onSuccess: () => {
                  successToastConfig({
                    content: `Connected successfully`,
                  });
                  refetch();
                },
                onError: () => {
                  failureToastConfig({
                    content: 'Fail to connect, Try again!',
                  });
                },
              },
            );
          }}
          q={{ orgProviderId: availableAccount?.orgProviderId }}
          integrationType={integrationType}
        />
      )}
      {isAddModalOpen && (
        <AddFolderModal
          isOpen={isAddModalOpen}
          closeModal={closeAddModal}
          onSelect={(folderName) => {
            createFolderMutation.mutate({
              channelId: channelId,
              rootFolderId:
                items.length > 1 ? items[1].id.toString() : undefined,
              remoteFolderId:
                items.length <= 2
                  ? undefined
                  : items[items.length - 1].id.toString(),
              name: folderName,
            } as any);
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
      {renameModal && (
        <RenameChannelDocModal
          isOpen={renameModal}
          closeModal={closeRenameModal}
          defaultName={renameModalProps?.name}
          onSave={handleRename}
        />
      )}
      <ConfirmationBox
        open={confirm}
        onClose={closeConfirm}
        title={`Delete ${selectedItems.length > 1 ? 'files' : 'file'}?`}
        description={
          <span>Are you sure you want to delete? This cannot be undone</span>
        }
        success={{
          label: 'Delete',
          className: 'bg-red-500 text-white ',
          onSubmit: handleDeleteDoc,
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
      />
    </Fragment>
  );
};

export default Document;
