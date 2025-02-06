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
import { Link, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import { ChannelPermissionEnum } from '../utils/channelPermission';
import { Doc as DocType } from 'interfaces';
import Doc, { getIconFromMime } from './components/Doc';
import FilterMenuDocument from './components/FilterMenuDocument';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import BreadCrumb, { BreadCrumbVariantEnum } from 'components/BreadCrumb';
import DocumentPathProvider, {
  DocumentPathContext,
} from 'contexts/DocumentPathContext';
import RecentlyAddedEntities from './components/RecentlyAddedEntities';
import Avatar from 'components/Avatar';
import Skeleton from 'react-loading-skeleton';
import FilePreviewModal from './components/FilePreviewModal';
import moment from 'moment';
import { useChannelDocUpload } from 'hooks/useUpload';
import { useAppliedFiltersStore } from 'stores/appliedFiltersStore';
import {
  BackgroundJob,
  BackgroundJobStatusEnum,
  BackgroundJobVariantEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';
import queryClient from 'utils/queryClient';
import {
  compressString,
  decompressString,
  downloadFromUrl,
  getLearnUrl,
  isThisAFile,
} from 'utils/misc';
import { useChannelStore } from 'stores/channelStore';
import RenameChannelDocModal from './components/RenameChannelDocModal';
import ConfirmationBox from 'components/ConfirmationBox';
import DocSearch from './components/DocSearch';
import Popover from 'components/Popover';
import { parseNumber } from 'react-advanced-cropper';
import { getExtension, trimExtension } from '../utils';
import { useTranslation } from 'react-i18next';
import { getUtcMiliseconds } from 'utils/time';
import useNavigate from 'hooks/useNavigation';

export enum DocIntegrationEnum {
  Sharepoint = 'SHAREPOINT',
  GoogleDrive = 'GOOGLE_DRIVE',
}

export interface IForm {
  selectAll: boolean;
  documentSearch: string;
  docType?: Record<string, any>;
  applyDocumentSearch: string;
  byTitle?: boolean;
  recentlyModified?: boolean;
}

interface IDocumentProps {
  permissions: ChannelPermissionEnum[];
}

const Document: FC<IDocumentProps> = ({ permissions }) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { t: tc } = useTranslation('common');
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
  const { channelId = '', documentPath = '' } = useParams();
  const { items, setItems } = useContext(DocumentPathContext);
  const { uploadMedia } = useChannelDocUpload(channelId);
  const { filters } = useAppliedFiltersStore();
  const { setRootFolderId } = useChannelStore();
  const {
    config,
    setConfig,
    setJobs,
    getIconFromStatus,
    setJobTitle,
    reset,
    updateJob,
  } = useBackgroundJobStore();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, applyDocumentSearch, documentSearch, byTitle] = watch([
    'docType',
    'applyDocumentSearch',
    'documentSearch',
    'byTitle',
  ]);
  const useCurrentUser = getApi(ApiEnum.GetMe);
  const { data: currentUser } = useCurrentUser();
  const syncIntervalRef = useRef<any>(null);
  const navigate = useNavigate();

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
  });

  // Api call: Connect site / folder
  const updateConnection = getApi(ApiEnum.UpdateChannelDocumentConnection);
  const updateConnectionMutation = useMutation({
    mutationKey: ['update-channel-connection', channelId],
    mutationFn: updateConnection,
  });

  // Api call: Delete doc mutation
  const deleteChannelDoc = getApi(ApiEnum.DeleteChannelDoc);
  const deleteChannelDocMutation = useMutation({
    mutationFn: deleteChannelDoc,
    onSuccess: () => {
      successToastConfig({
        content: t('deleteFile.success', { name: deleteDocProps?.doc?.name }),
      });
    },
    onError: (response: any) => {
      const failMessage =
        response?.response?.data?.errors[0]?.reason === 'ACCESS_DENIED'
          ? t('accessDenied')
          : t('deleteFile.failure', { name: deleteDocProps?.doc?.name });
      failureToastConfig({
        content: failMessage,
        dataTestId: 'file-delete-toaster',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(['get-channel-files'], {
        exact: false,
      });
      closeConfirm();
    },
  });

  // Initialise download file mutation
  const downloadChannelFile = getApi(ApiEnum.GetChannelDocDownloadUrl);
  const downloadChannelFileMutation = useMutation({
    mutationFn: (payload: {
      channelId: string;
      itemId: string;
      name: string;
    }) =>
      downloadChannelFile({
        channelId: payload.channelId,
        itemId: payload.itemId,
      }),
    onSuccess(data: any) {
      downloadFromUrl(
        data?.data?.result?.data?.downloadUrl,
        data?.data?.result?.data?.name,
      );
    },
    onError(response: any, variables) {
      const failMessage =
        response?.response?.data?.errors[0]?.reason === 'ACCESS_DENIED'
          ? t('accessDenied')
          : t('downloadFile.failure', { name: variables?.name });
      failureToastConfig({
        content: failMessage,
        dataTestId: 'file-download-toaster',
      });
    },
  });

  // Initialise rename file mutation
  const renameChannelFileMutation = useMutation({
    mutationFn: getApi(ApiEnum.RenameChannelFile),
    onSuccess: () => {
      successToastConfig({ content: t('renameFile.success') });
    },
    onError: (response: any) => {
      const failMessage =
        response?.response?.data?.errors[0]?.reason === 'ACCESS_DENIED'
          ? t('accessDenied')
          : t('renameFile.failure');
      failureToastConfig({ content: failMessage });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(['get-channel-files'], {
        exact: false,
      }),
        closeRenameModal();
    },
  });

  // Initialise rename folder mutation
  const renameChannelFolderMutation = useMutation({
    mutationFn: getApi(ApiEnum.RenameChannelFolder),
    onSuccess: () => {
      successToastConfig({ content: t('renameFolder.success') });
    },
    onError: (response: any) => {
      const failMessage =
        response?.response?.data?.errors[0]?.reason === 'ACCESS_DENIED'
          ? t('accessDenied')
          : t('renameFolder.failure');
      failureToastConfig({ content: failMessage });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(['get-channel-files'], {
        exact: false,
      });
      closeRenameModal();
    },
  });

  // Api call: Handle rename file / folder
  const handleRename = async (name: string, meta: DocType) => {
    if (meta.isFolder) {
      renameChannelFolderMutation.mutate({
        channelId,
        name,
        folderId: meta.id,
      } as any);
    } else {
      renameChannelFileMutation.mutate({
        channelId,
        name: `${name}${getExtension(meta.name)}`,
        fileId: meta.id,
      } as any);
    }
  };

  // Api call: get sync status
  const useChannelDocSyncStatus = getApi(ApiEnum.UseChannelDocSyncStatus);
  useChannelDocSyncStatus(
    {
      channelId,
    },
    {
      onSuccess: (data: any) => {
        const syncResults = data?.data?.result?.data;
        if (!!syncResults?.length) {
          const isSynced = !syncResults.some(
            (each: { syncStatus: string }) =>
              each.syncStatus !== 'success' && each.syncStatus !== 'failed',
          );
          if (!isSynced) {
            handleSyncing();
          }
        }
      },
      staleTime: 0,
    },
  );

  // State management flags
  const isBaseFolderSet = statusResponse?.status === 'ACTIVE';
  const isConnectionMade =
    isBaseFolderSet ||
    (statusResponse?.status === 'INACTIVE' &&
      statusResponse.availableAccounts.length > 0);
  const integrationType: DocIntegrationEnum = DocIntegrationEnum.Sharepoint;
  const availableAccount = statusResponse?.availableAccounts[0];
  const isRootDir = items.length === 1;
  const isCredExpired = !!statusResponse?.expiryDetails?.expired;
  const reAuthorizeForAdmin =
    isCredExpired && permissions.includes(ChannelPermissionEnum.CanReauthorize);
  const reAuthorizeForOthers =
    isCredExpired &&
    !permissions.includes(ChannelPermissionEnum.CanReauthorize);
  const isDocSearchApplied = applyDocumentSearch !== '';

  // Flags to disable / enable actions
  const disableSelectExistingCTA = isCredExpired || isLoading;
  const disableSharepointCTA = isCredExpired || isLoading;
  const hideAddNewPopup = isRootDir;
  const disableAddNewPopup = isCredExpired || isLoading;
  const hideFilterRow = isRootDir;
  const disableFilter = isCredExpired || isLoading;
  const disableSort = isCredExpired || isLoading;
  const showTitleFilter = isDocSearchApplied;
  const hideClearBtn =
    isRootDir ||
    !permissions.includes(ChannelPermissionEnum.CanEditChannelDoc) ||
    isCredExpired ||
    isLoading;

  // A function that decides what options to show on each row of documents
  const getAllOptions = useCallback(
    (info: CellContext<DocType, unknown>) => {
      const showDownload =
        !isCredExpired &&
        permissions.includes(ChannelPermissionEnum.CanDownloadDocuments) &&
        !!info?.row?.original?.downloadable &&
        !!!info?.row?.original?.isFolder;
      const canRename =
        !isCredExpired &&
        permissions.includes(ChannelPermissionEnum.CanRenameDocuments);
      const canDelete =
        !isCredExpired &&
        permissions.includes(ChannelPermissionEnum.CanDeleteDocuments);
      return [
        {
          label: t('rename'),
          onClick: (e: Event) => {
            e.stopPropagation();
            showRenameModal({
              name: !!info?.row?.original?.isFolder
                ? info?.row?.original?.name
                : trimExtension(info?.row?.original?.name),
              meta: info?.row?.original,
            });
          },
          dataTestId: 'folder-menu',
          className: '!px-6 !py-2',
          isHidden: !canRename,
        },
        {
          label: t('download'),
          onClick: async (e: Event) => {
            e.stopPropagation();
            downloadChannelFileMutation.mutate({
              channelId,
              itemId: info?.row?.original?.id,
              name: info?.row?.original?.name,
            });
          },
          dataTestId: 'folder-menu',
          className: '!px-6 !py-2',
          isHidden: !showDownload,
        },
        {
          label: tc('delete'),
          onClick: (e: Event) => {
            e.stopPropagation();
            showConfirm({ doc: info?.row?.original });
          },
          dataTestId: 'folder-menu',
          className: '!px-6 !py-2 [&_*]:text-red-500',
          isHidden: !canDelete,
        },
      ].filter((option) => !option?.isHidden) as any as IMenuItem[];
    },
    [isCredExpired, permissions],
  );

  // A function to get formated props for location breadcrumb
  const getMappedLocation = (doc: DocType) => {
    let items = [
      ...(doc?.pathWithId || []).map((each) => ({
        id: each.id,
        label: each.name,
        meta: each,
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
        {
          accessorKey: 'name',
          header: () => (
            <div className="font-bold text-neutral-500">
              {t('nameColumn', { totalRows })}
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
                  hover={false}
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
          header: () => (
            <div className="font-bold text-neutral-500">{t('owner')}</div>
          ),
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
            <div className="font-bold text-neutral-500">{t('lastUpdated')}</div>
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
            if (
              info?.row?.original?.id ===
                downloadChannelFileMutation.variables?.itemId &&
              downloadChannelFileMutation.isLoading
            ) {
              return <Spinner />;
            }
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
          (isRootDir || !isDocSearchApplied)
        ) {
          return false;
        }
        if (each.accessorKey === 'more' && isRootDir) {
          return false;
        }
        return true;
      }),
    [
      totalRows,
      isRootDir,
      isDocSearchApplied,
      downloadChannelFileMutation.isLoading,
    ],
  );

  // Columns configuration for Datagrid component for List view
  const columnsDeepSearchListView = React.useMemo<ColumnDef<DocType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="font-bold text-neutral-500">
            {t('nameColumn', { totalRows })}
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
        header: () => (
          <div className="font-bold text-neutral-500">{t('owner')}</div>
        ),
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
          <div className="font-bold text-neutral-500">{t('lastUpdated')}</div>
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
          <div className="font-bold text-neutral-500">{t('location')}</div>
        ),
        cell: (info: CellContext<DocType, unknown>) => {
          return (
            <Popover
              triggerNode={
                <BreadCrumb
                  items={getMappedLocation(info?.row?.original)}
                  onItemClick={() => {}}
                />
              }
              triggerNodeClassName="w-full"
              wrapperClassName="w-full"
              contentRenderer={() => (
                <div className="flex p-3 bg-primary-50 rounded-9xl border border-primary-50 shadow">
                  <BreadCrumb
                    items={getMappedLocation(info?.row?.original)}
                    labelClassName="hover:text-primary-500 hover:underline min-w-max"
                    onItemClick={(item, e) => {
                      e?.stopPropagation();
                      const sliceIndex =
                        info?.row?.original.pathWithId.findIndex(
                          (folder) => folder.id === item.id,
                        );
                      const itemsToEncode =
                        info?.row?.original.pathWithId.slice(0, sliceIndex + 1);
                      const mappedItemsToEncode = itemsToEncode.map((each) => ({
                        id: each.id,
                        name: each.name,
                        type: 'Folder',
                      }));
                      const encodedPath = compressString(
                        JSON.stringify(mappedItemsToEncode),
                      );
                      if (!!mappedItemsToEncode.length) {
                        navigate(
                          `/channels/${channelId}/documents/${encodedPath}`,
                        );
                      } else {
                        navigate(`/channels/${channelId}/documents`);
                      }
                      setValue('documentSearch', '');
                    }}
                  />
                </div>
              )}
            />
          );
        },
        size: 260,
      },
      {
        accessorKey: 'more',
        header: () => '',
        cell: (info: CellContext<DocType, unknown>) => {
          if (
            info?.row?.original?.id ===
              downloadChannelFileMutation.variables?.itemId &&
            downloadChannelFileMutation.isLoading
          ) {
            return <Spinner />;
          }
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
    [totalRows, downloadChannelFileMutation.isLoading],
  );

  // Columns configuration for Datagrid component for Grid view
  const columnsGridView = React.useMemo<ColumnDef<DocType>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: (info) => <Doc doc={info.row.original} isFolder={isRootDir} />,
      },
    ],
    [isRootDir],
  );

  // Its a function to parse modified on filter that maps string to respected date param oo api
  const parseModifiedOnFilter = useMemo(() => {
    if (filters?.docModifiedRadio?.includes('custom')) {
      const [start, end] = filters?.docModifiedRadio
        .replace('custom:', '')
        .split('-');
      if (parseNumber(start) && parseNumber(end)) {
        return {
          modifiedAfter: getUtcMiliseconds(parseNumber(start)),
          modifiedBefore: getUtcMiliseconds(parseNumber(end)),
        };
      }
    }
    if (filters?.docModifiedRadio) {
      switch (filters.docModifiedRadio) {
        case 'Today':
          return {
            modifiedAfter: getUtcMiliseconds(moment().startOf('day').valueOf()),
            modifiedBefore: getUtcMiliseconds(moment().endOf('day').valueOf()),
          };
        case 'Last 7 days':
          return {
            modifiedAfter: getUtcMiliseconds(
              moment().subtract(7, 'days').startOf('day').valueOf(),
            ),
            modifiedBefore: getUtcMiliseconds(moment().endOf('day').valueOf()),
          };
        case 'Last 30 days':
          return {
            modifiedAfter: getUtcMiliseconds(
              moment().subtract(30, 'days').startOf('day').valueOf(),
            ),
            modifiedBefore: getUtcMiliseconds(moment().endOf('day').valueOf()),
          };
        case 'This year':
          return {
            modifiedAfter: getUtcMiliseconds(
              moment().startOf('year').valueOf(),
            ),
            modifiedBefore: getUtcMiliseconds(moment().endOf('day').valueOf()),
          };
        case 'Last year':
          return {
            modifiedAfter: getUtcMiliseconds(
              moment().subtract(1, 'year').startOf('year').valueOf(),
            ),
            modifiedBefore: getUtcMiliseconds(
              moment().subtract(1, 'year').endOf('year').valueOf(),
            ),
          };
      }
    }
    return {};
  }, [filters]);

  // Get props for Datagrid component
  const dataGridProps = useDataGrid<DocType>({
    apiEnum: isDocSearchApplied
      ? ApiEnum.GetChannelDocDeepSearch
      : ApiEnum.GetInfiniteChannelFiles,
    isInfiniteQuery: true,
    payload: {
      channelId,
      params: {
        sort: filters?.sort ? filters?.sort.split(':')[0] : undefined,
        order: filters?.sort ? filters?.sort.split(':')[1] : undefined,
        isFolder: docType ? !!(docType.value === 'folder') : undefined,
        owners: (filters?.docOwnerCheckbox || []).map(
          (owner: any) => owner.name,
        ),
        type: (filters?.docTypeCheckbox || []).map(
          (type: any) => type.paramKey,
        ),
        ...parseModifiedOnFilter,
        ...(isDocSearchApplied
          ? {
              q: !byTitle ? applyDocumentSearch : undefined,
              byTitle: byTitle ? applyDocumentSearch : undefined,
            }
          : {
              rootFolderId: items.length > 1 ? items[1].id : undefined,
              folderId:
                items.length < 3 ? undefined : items[items.length - 1].id,
            }),
      },
    },
    options: {
      enabled: !isLoading,
    },
    loadingGrid: (
      <Skeleton
        containerClassName="!rounded-15xl !w-[213px] !h-[147px] relative"
        className="!absolute !w-full top-0 left-0 h-full !rounded-15xl"
      />
    ),
    dataGridProps: {
      columns:
        view === 'LIST'
          ? isDocSearchApplied
            ? columnsDeepSearchListView
            : columnsListView
          : columnsGridView,
      isRowSelectionEnabled: false,
      view,
      onRowClick: (e, table, virtualRow) => {
        if (
          virtualRow.original.isFolder ||
          (!!!virtualRow.original.isFolder && !isCredExpired)
        ) {
          const encodedPath = compressString(
            JSON.stringify(virtualRow?.original.pathWithId),
          );
          navigate(`/channels/${channelId}/documents/${encodedPath}`);
        }
      },
      noDataFound: (
        <NoDataFound
          labelHeader={t('noDataFound.docListing')}
          clearBtnLabel="Upload now"
          hideClearBtn={hideClearBtn}
          onClearSearch={() => fileInputRef?.current?.click()}
        />
      ),
      trDataClassName: isCredExpired ? '' : 'cursor-pointer',
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
    if (documentSearch === '' && isDocSearchApplied) {
      setValue('applyDocumentSearch', '');
    }
  }, [documentSearch, isDocSearchApplied]);

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

  useEffect(() => {
    try {
      if (documentPath) {
        const items = [
          { id: 'root', label: t('title') },
          ...parseDocumentPath(),
        ];
        const pathWithId = JSON.parse(decompressString(documentPath)) || [];
        if (pathWithId.at(-1).type === 'File') {
          openFilePreview({ id: items.at(-1)?.id, pathWithId });
          setItems(items.slice(0, -1));
        } else {
          setItems(items);
        }
      } else {
        setItems([{ id: 'root', label: t('title') }]);
      }
    } catch (e) {
      failureToastConfig({ content: 'Invalid document path' });
      navigate(`/channels/${channelId}/documents`);
    }
  }, [documentPath]);

  // Reset sync jobs on unmount
  useEffect(
    () => () => {
      if (
        config.variant === BackgroundJobVariantEnum.ChannelDocumentSync &&
        !!config.show &&
        !!syncIntervalRef.current
      ) {
        clearInterval(syncIntervalRef.current);
        reset();
      }
    },
    [config.variant],
  );

  // Component to render before connection.
  const NoConnection = () =>
    permissions.includes(ChannelPermissionEnum.CanConnectChannelDoc) ? (
      <Fragment>
        {isConnectionMade ? (
          <Fragment>
            <NoDataFound
              illustration="noChannelFound"
              illustrationClassName="h-[144px]"
              hideClearBtn
              hideText
            />
            <div className="flex flex-col gap-4 justify-between">
              <p className="w-full text-2xl font-semibold text-neutral-900 text-center">
                {t('activateFolder')}
              </p>
              <Divider />
              <p className="text-center text-lg font-medium text-neutral-900">
                {t('activateFolderDescription')}
              </p>
            </div>
            <div className="flex gap-6 w-full justify-center">
              <Button
                label={t('selectExistingCTA')}
                variant={ButtonVariant.Secondary}
                size={Size.Small}
                onClick={openModal}
                disabled={disableSelectExistingCTA}
              />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="flex flex-col w-full border border-neutral-200 rounded-7xl px-6 py-10 gap-10">
              <div className="flex flex-col gap-4">
                <p className="font-bold text-neutral-900 text-center">
                  {t('enableIntegration')}
                </p>
                <p className="text-neutral-900 text-center">
                  {t('enableIntegrationDescriptionLine1')}
                  <br />
                  {t('enableIntegrationDescriptionLine2')}
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  label={t('sharepointCTA')}
                  size={Size.Small}
                  variant={ButtonVariant.Secondary}
                  leftIcon={'sharePoint'}
                  onClick={() =>
                    window.location.assign(
                      getLearnUrl('/settings/market-place'),
                    )
                  }
                  className="flex !text-[#036b70] group-hover:border-neutral-900 hover:border-neutral-900"
                  disabled={disableSharepointCTA}
                />
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    ) : (
      <NoDataFound hideClearBtn labelHeader={t('noDataFound.noConnection')} />
    );

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

  const handleSyncing = () => {
    setJobTitle('Sync in progress');
    setConfig({
      variant: BackgroundJobVariantEnum.ChannelDocumentSync,
      show: true,
      isExpanded: false,
    });
    syncIntervalRef.current = setInterval(async () => {
      const response = await getApi(ApiEnum.GetChannelDocSyncStatus)({
        channelId,
      }).catch(() => {
        clearInterval(syncIntervalRef.current);
        setJobTitle('Sync failed');
      });
      const syncResults = response?.data?.result?.data;
      if (!!syncResults?.length) {
        let successCount = 0;
        let failCount = 0;
        syncResults.forEach((each: { syncStatus: string }) => {
          if (each.syncStatus === 'success') {
            successCount += 1;
          } else if (each.syncStatus === 'failed') {
            failCount += 1;
          }
        });
        if (successCount + failCount === syncResults?.length) {
          clearInterval(syncIntervalRef.current);
          if (successCount === syncResults.length) {
            setJobTitle('Sync successful');
          } else {
            setJobTitle('Sync failed');
          }
        }
      }
    }, 1000);
  };

  const parseDocumentPath = () => {
    return (
      (JSON.parse(decompressString(documentPath)) ||
        []) as DocType['pathWithId']
    ).map((each) => ({ id: each.id, label: each.name }));
  };

  return isLoading ? (
    <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white overflow-hidden">
      <p className="font-bold text-2xl text-neutral-900">{t('title')}</p>
      <Spinner className="flex w-full justify-center" />
    </Card>
  ) : (
    <Fragment>
      <input
        id="input-file-upload"
        className="hidden"
        disabled={isCredExpired}
        type="file"
        ref={fileInputRef}
        multiple={true}
        onChange={async (e: any) => {
          try {
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

            setConfig({
              variant: BackgroundJobVariantEnum.ChannelDocumentUpload,
              show: true,
              isExpanded: false,
            });

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
          } catch (e: any) {
            const reason =
              e?.response?.data?.errors[0]?.reason ||
              'Something went wrong... try again!';
            failureToastConfig({
              content: reason,
              dataTestId: 'file-delete-toaster',
            });
            reset();
          }
        }}
      />
      <input
        id="input-folder-upload"
        className="hidden"
        type="file"
        disabled={isCredExpired}
        ref={folderInputRef}
        multiple={true}
        onChange={async (e: any) => {
          try {
            reset();
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
            for (const file of allFiles) {
              const parentFolderId = parentFolderIdOriginal;
              files.push({
                file,
                parentFolderId,
                rootFolderId: `${rootFolderId}`,
              });
            }

            // Create jobs
            const jobs = Object.assign(
              ...(files.map((each, index) => ({
                [`upload-job-${index}`]: {
                  id: `upload-job-${index}`,
                  jobData: each,
                  progress: 0,
                  status: BackgroundJobStatusEnum.YetToStart,
                  renderer: () => <></>,
                },
              })) as [{ [key: string]: any }]),
            );

            // Set background job config
            setConfig({
              variant: BackgroundJobVariantEnum.ChannelDocumentUpload,
              show: true,
              isExpanded: false,
              jobsRenderer: folderUploadJobRenderer,
            });

            // Set background jobs
            setJobs(jobs);

            // Iterate through folders and create folder.
            for (const job of Object.values(jobs) as BackgroundJob[]) {
              const folderNames = job.jobData.file.webkitRelativePath
                .split('/')
                .slice(0, -1);
              let parentFolderId = parentFolderIdOriginal;

              // Process each folder in sequence
              for (const folderName of folderNames) {
                if (!folders[folderName]) {
                  const response: any = await createFolderMutation
                    .mutateAsync(
                      {
                        channelId: channelId,
                        remoteFolderId: parentFolderId.toString(),
                        rootFolderId: rootFolderId.toString(),
                        name: folderName,
                      } as any,
                      {
                        onSuccess: async () => {
                          await queryClient.invalidateQueries(
                            ['get-channel-files'],
                            {
                              exact: false,
                            },
                          );
                        },
                      },
                    )
                    .catch((e) => {
                      reset();
                      throw e;
                    });
                  const folderId = (response?.result?.data?.id).toString();
                  folders[folderName] = { id: folderId, parentFolderId };
                  parentFolderId = folderId; // Update parentFolderId for next folder
                } else {
                  parentFolderId = folders[folderName].id.toString();
                }
                updateJob({
                  ...job,
                  jobData: {
                    ...job.jobData,
                    parentFolderId: folders[folderName].id.toString(),
                  },
                });
                const fileIndex = parseInt(job?.id?.split('-').at(-1) || '-1');
                if (fileIndex > -1) {
                  files[fileIndex] = {
                    ...files[fileIndex],
                    parentFolderId: folders[folderName].id.toString(),
                  };
                }
              }
            }

            // Call uploadMedia function here
            uploadMedia(files);
          } catch (e: any) {
            const reason =
              e?.response?.data?.errors[0]?.reason ||
              'Something went wrong... try again!';
            failureToastConfig({
              content: reason,
              dataTestId: 'file-delete-toaster',
            });
          }
        }}
      />
      <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white">
        {reAuthorizeForAdmin && (
          <div className="flex gap-2 w-full p-2 border border-orange-400 bg-orange-50 items-center">
            <Icon name="warning" />
            <span className="text-neutral-600 text-sm font-medium">
              {t('reAuthorizeForAdmin')}
              <Link
                to={getLearnUrl('/settings/market-place')}
                className="text-orange-400 text-sm font-bold underline"
              >
                {t('reAuthorizeCTA')}
              </Link>
            </span>
          </div>
        )}
        {reAuthorizeForOthers && (
          <div className="flex gap-2 w-full p-2 border border-orange-400 bg-orange-50 items-center">
            <Icon name="warning" />
            <span className="text-neutral-600 text-sm font-medium">
              {t('reAuthorizeForOthersFirstHalf')}
              <Link
                to={
                  `mailto:${currentUser?.result?.data?.org?.primaryAdmin?.email}` ||
                  ''
                }
                className="underline"
              >
                {currentUser?.result?.data?.org?.primaryAdmin?.email || ''}
              </Link>{' '}
              {t('reAuthorizeForOthersSecondHalf')}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          {isDocSearchApplied ? (
            <Button
              label={t('backToDocuments')}
              leftIcon="arrowLeft"
              leftIconClassName="!text-neutral-900 group-hover:!text-primary-500"
              leftIconSize={20}
              className="!py-[7px]"
              variant={ButtonVariant.Secondary}
              onClick={() => {
                setValue('documentSearch', '');
              }}
            />
          ) : (
            <BreadCrumb
              variant={BreadCrumbVariantEnum.ChannelDoc}
              items={items}
              onItemClick={(item) => {
                const sliceIndex =
                  items.findIndex((folder) => folder.id === item.id) + 1;
                const itemsToEncode = items.slice(1, sliceIndex);
                const mappedItemsToEncode = itemsToEncode.map((each) => ({
                  id: each.id,
                  name: each.label,
                  type: 'Folder',
                }));
                const encodedPath = compressString(
                  JSON.stringify(mappedItemsToEncode),
                );
                if (!!mappedItemsToEncode.length) {
                  navigate(`/channels/${channelId}/documents/${encodedPath}`);
                } else {
                  navigate(`/channels/${channelId}/documents`);
                }
              }}
            />
          )}
          {isBaseFolderSet && (
            <div className="flex gap-2 items-center">
              <DocSearch
                control={control}
                watch={watch}
                onEnter={(value: string) =>
                  setValue('applyDocumentSearch', value)
                }
                onClick={(doc) => {
                  const encodedPath = compressString(
                    JSON.stringify(doc.pathWithId),
                  );
                  if (!!doc?.pathWithId?.length) {
                    navigate(`/channels/${channelId}/documents/${encodedPath}`);
                  } else {
                    navigate(`/channels/${channelId}/documents`);
                  }
                }}
                disable={isCredExpired || isLoading}
              />
              {permissions.includes(ChannelPermissionEnum.CanEditChannelDoc) &&
                !hideAddNewPopup && (
                  <div className="relative">
                    <PopupMenu
                      triggerNode={
                        <Button
                          label={t('addNewPopupLabelCTA')}
                          leftIcon="add"
                          className="px-4 py-2 gap-1 h-10"
                          leftIconClassName="text-white focus:text-white group-focus:text-white"
                          leftIconHoverColor="text-white"
                          disabled={disableAddNewPopup}
                          size={Size.Small}
                        />
                      }
                      menuItems={[
                        {
                          renderNode: (
                            <div className="bg-blue-50 px-6 text-xs font-medium text-neutral-500 py-2">
                              {t('addNewPopupBanner')}
                            </div>
                          ),
                          isBanner: true,
                        },
                        {
                          label: (
                            <div className="flex gap-2 items-center text-xs">
                              <Icon name={'folder'} size={16} /> {t('folder')}
                            </div>
                          ),
                          onClick: openAddModal,
                        },
                        {
                          renderNode: (
                            <div className="bg-blue-50 px-6 text-xs font-medium text-neutral-500 py-2">
                              {t('uploadNewPopupBanner')}
                            </div>
                          ),
                          isBanner: true,
                        },
                        {
                          label: (
                            <div className="flex gap-2.5 items-center text-xs">
                              <Icon name={'fileUpload'} size={16} /> {t('file')}
                            </div>
                          ),
                          onClick: () => {
                            reset();
                            fileInputRef?.current?.click();
                          },
                        },
                        {
                          label: (
                            <div className="flex gap-2.5 items-center text-xs">
                              <Icon name={'folderUpload'} size={16} />{' '}
                              {t('folder')}
                            </div>
                          ),
                          onClick: () => {
                            reset();
                            folderInputRef?.current?.click();
                          },
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
            {!isRootDir && !isDocSearchApplied && (
              <RecentlyAddedEntities disableActions={isCredExpired} />
            )}
            <p className="text-base font-bold text-neutral-900">
              {isDocSearchApplied ? 'Search results' : t('allItemTitle')}
            </p>
            {!hideFilterRow && (
              <FilterMenuDocument
                control={control}
                watch={watch}
                setValue={setValue}
                view={view}
                hideFilter={disableFilter}
                hideSort={disableSort}
                showTitleFilter={showTitleFilter}
                changeView={(view) => setView(view)}
              />
            )}
            <DataGrid
              {...dataGridProps}
              flatData={dataGridProps.flatData.map((doc: any) => ({
                ...doc,
                pathWithId:
                  items.length === 1 && !isDocSearchApplied
                    ? [{ id: doc.id, name: doc.name, type: 'Folder' }]
                    : doc.pathWithId,
              }))}
            />
          </Fragment>
        ) : (
          <NoConnection />
        )}
      </Card>
      {isOpen && (
        <DocumentPathProvider defaultItem={{ id: 'root', label: 'Sites' }}>
          <EntitySelectModal
            isOpen={isOpen}
            closeModal={closeModal}
            onSelect={(entity: any, callback: (isError: boolean) => void) => {
              updateConnectionMutation.mutate(
                {
                  channelId: channelId,
                  connections: entity,
                  orgProviderId: availableAccount?.orgProviderId,
                } as any,
                {
                  onSuccess: () => {
                    handleSyncing();
                    successToastConfig({
                      content: t('connectFolder.success'),
                    });
                    refetch();
                    queryClient.invalidateQueries(['get-channel-files'], {
                      exact: false,
                    });
                    callback(false);
                  },
                  onError: (response: any) => {
                    const failMessage =
                      response?.response?.data?.errors[0]?.reason ===
                      'ACCESS_DENIED'
                        ? t('accessDenied')
                        : t('connectFolder.failure');
                    failureToastConfig({
                      content: failMessage,
                    });
                    callback(true);
                  },
                },
              );
            }}
            q={{ orgProviderId: availableAccount?.orgProviderId }}
            integrationType={integrationType}
          />
        </DocumentPathProvider>
      )}
      {isAddModalOpen && (
        <AddFolderModal
          isOpen={isAddModalOpen}
          closeModal={closeAddModal}
          isLoading={createFolderMutation.isLoading}
          onSelect={(folderName) => {
            createFolderMutation.mutate(
              {
                channelId: channelId,
                rootFolderId:
                  items.length > 1 ? items[1].id.toString() : undefined,
                remoteFolderId:
                  items.length <= 2
                    ? undefined
                    : items[items.length - 1].id.toString(),
                name: folderName,
              } as any,
              {
                onSuccess: async () => {
                  await queryClient.invalidateQueries(['get-channel-files'], {
                    exact: false,
                  });
                  successToastConfig({
                    content: 'New folder added successfully',
                  });
                },
                onError: () => {
                  failureToastConfig({ content: 'Folder creation failed' });
                },
                onSettled: closeAddModal,
              },
            );
          }}
        />
      )}
      {filePreview && (
        <FilePreviewModal
          fileId={(filePreviewProps as DocType).id}
          rootFolderId={(filePreviewProps as DocType).pathWithId[0].id}
          open={filePreview}
          canDownload={permissions.includes(
            ChannelPermissionEnum.CanDownloadDocuments,
          )}
          closeModal={() => {
            const mappedItemsToEncode = items.slice(1).map((each) => ({
              id: each.id,
              name: each.label,
              type: 'Folder',
            }));
            const encodedPath = compressString(
              JSON.stringify(mappedItemsToEncode),
            );
            if (!!mappedItemsToEncode.length) {
              navigate(`/channels/${channelId}/documents/${encodedPath}`);
            } else {
              navigate(`/channels/${channelId}/documents`);
            }
            closeFilePreview();
          }}
        />
      )}
      {renameModal && (
        <RenameChannelDocModal
          isLoading={
            renameChannelFileMutation.isLoading ||
            renameChannelFolderMutation.isLoading
          }
          isOpen={renameModal}
          closeModal={closeRenameModal}
          defaultName={renameModalProps?.name}
          onSave={(name) => handleRename(name, renameModalProps?.meta)}
        />
      )}
      <ConfirmationBox
        isLoading={deleteChannelDocMutation.isLoading}
        open={confirm}
        onClose={closeConfirm}
        title={t('deleteBoxTitle')}
        description={<span>{t('deleteDescription')}</span>}
        success={{
          label: tc('delete'),
          className: 'bg-red-500 text-white ',
          onSubmit: () =>
            deleteChannelDocMutation.mutate({
              channelId,
              itemId: deleteDocProps?.doc.id,
            } as any),
        }}
        discard={{
          label: tc('cancel'),
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
      />
    </Fragment>
  );
};

export default Document;
