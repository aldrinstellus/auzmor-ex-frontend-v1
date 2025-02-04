import { ColumnDef, Table } from '@tanstack/react-table';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import DataGrid from 'components/DataGrid';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { useDataGrid } from 'hooks/useDataGrid';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { DocIntegrationEnum } from '..';
import Icon from 'components/Icon';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'hooks/useDebounce';
import { getInitials } from 'utils/misc';
import NoDataFound from 'components/NoDataFound';
import moment from 'moment';
import BreadCrumb, { BreadCrumbVariantEnum } from 'components/BreadCrumb';
import { DocumentPathContext } from 'contexts/DocumentPathContext';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';

interface IEntitySelectModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSelect: (entity: any, callback: (isError: boolean) => void) => void;
  integrationType?: DocIntegrationEnum;
  headerText?: string;
  q?: Record<string, any>;
}

interface IForm {
  entitySearch: string;
}

const EntitySelectModal: FC<IEntitySelectModalProps> = ({
  isOpen,
  closeModal,
  onSelect,
  headerText,
  q,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { t: tc } = useTranslation('common');
  const { channelId } = useParams();
  const { control, watch, resetField } = useForm<IForm>({
    defaultValues: { entitySearch: '' },
  });
  const [totalRows, setTotalRows] = useState<number>(0);
  const [entitySearch] = watch(['entitySearch']);
  const debouncedSearchValue = useDebounce(entitySearch || '', 500);
  const [onSelectLoading, setOnSelectLoading] = useState(false);
  const { items, appendItem, sliceItems } = useContext(DocumentPathContext);
  const [selectedItems, setSelectedItems] = useState<{
    directory?: Record<string, any>;
    drive?: Record<string, any>;
    folders?: Record<string, any>[];
  } | null>(null);

  const directoryId = items?.length >= 2 ? items[1]?.meta?.directoryId : '';
  const driveId =
    !!(items?.length >= 3) &&
    (items[2]?.meta?.rootFolderId || items[2]?.meta?.folderId);
  const parentFolderId =
    items?.length >= 4 ? items[items.length - 1]?.meta?.folderId : '';

  const integrationHeadingMapping = {
    site: {
      headerText: headerText || t('selectBaseSite'),
      placeholder: t('searchSitePlaceholder'),
      btnLabel: t('selectSiteCTA'),
    },
    drive: {
      headerText: headerText || t('selectBaseDrive'),
      placeholder: t('searchDrivePlaceholder'),
      btnLabel: t('selectDriveCTA'),
    },
    folder: {
      headerText: headerText || t('selectBaseFolder'),
      placeholder: t('searchFolderPlaceholder'),
      btnLabel: t('selectFolderCTA'),
    },
  };

  const headings: 'site' | 'drive' | 'folder' = useMemo(() => {
    if (driveId) {
      return 'folder';
    } else if (directoryId) {
      return 'drive';
    } else {
      return 'site';
    }
  }, [driveId, directoryId]);

  const SiteIcon: FC<{ name: string }> = ({ name }) => {
    return (
      <div className="flex w-5 h-5 border-1 border-neutral-200 text-white items-end justify-center text-xs font-medium leading-3 bg-primary-600 font-lato">
        {getInitials(name || '')}
      </div>
    );
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="font-bold text-neutral-500">
            {t('nameColumn', { totalRows })}
          </div>
        ),
        cell: (info) => (
          <div className="flex gap-2 font-medium text-neutral-900 leading-6">
            {!info.row?.original?.folderId ? (
              <SiteIcon name={info.getValue() as string} />
            ) : (
              <Icon name="folder" />
            )}
            {info.getValue() as string}
          </div>
        ),
        size: 302,
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="font-bold text-neutral-500">{t('createdAt')}</div>
        ),
        cell: (info) => (
          <span>
            {moment(info.row.original.createdAt).format('MMM DD,YYYY')}
          </span>
        ),
        size: 120,
      },
    ],
    [totalRows, directoryId],
  );

  const dataGridProps = useDataGrid({
    apiEnum: ApiEnum.GetChannelDirectories,
    isInfiniteQuery: false,
    payload: {
      channelId: channelId,
      directoryId,
      driveId,
      params: {
        name: debouncedSearchValue,
        parentFolderId,
        ...q,
      },
    },
    onError: (e: AxiosError<Record<string, any>>) => {
      const isAccessDenied = !!e.response?.data?.errors?.some(
        (e: { code: string; message: string; reason: string }) =>
          e.code === 'ACCESS_DENIED',
      );
      if (isAccessDenied) {
        failureToastConfig({ content: t('accessDenied') });
      } else {
        failureToastConfig({
          content: t('listDirectories.failure'),
        });
      }
    },
    dataGridProps: {
      columns,
      className: 'overflow-y-auto',
      view: 'LIST',
      isRowSelectionEnabled: true,
      enableMultiRowSelection: directoryId && directoryId,
      getRowId: (row) => row.id,
      onRowClick: (e, table, virtualRow, isDoubleClick) => {
        if (isDoubleClick) {
          appendItem({
            id: virtualRow.original.id,
            label: virtualRow.original.name,
            meta: virtualRow.original,
          });
          resetField('entitySearch');
          if (headings === 'folder') {
            return;
          }
        }
        if (headings === 'site') {
          setSelectedItems({
            directory: virtualRow.original,
            drive: undefined,
            folders: [],
          });
        } else if (headings === 'drive') {
          setSelectedItems({
            directory: selectedItems?.directory,
            drive: virtualRow.original,
            folders: [],
          });
        } else {
          if (
            (selectedItems?.folders || [])?.findIndex(
              (folder) => folder.id === virtualRow.original.id,
            ) > -1
          ) {
            setSelectedItems({
              ...selectedItems,
              folders: [
                ...(selectedItems?.folders || []).filter(
                  (folder) => folder.id !== virtualRow.original.id,
                ),
              ],
            });
          } else {
            setSelectedItems({
              ...selectedItems,
              folders: [
                ...(selectedItems?.folders || []),
                {
                  ...virtualRow.original,
                  parentFolderId:
                    items.length > 3 ? items.at(-1)?.meta?.folderId : undefined,
                },
              ],
            });
          }
        }
      },
      height: 312,
      noDataFound: (
        <NoDataFound
          hideClearBtn
          labelHeader={(() => {
            switch (headings) {
              case 'site':
                return t('noDataFound.site');
              case 'drive':
                return t('noDataFound.drive');
              case 'folder':
                return t('noDataFound.folder');
            }
            return t('noDataFound.common');
          })()}
        />
      ),
      isDoubleClickAllowed: headings === 'folder',
    },
  });

  useEffect(() => {
    setTotalRows((dataGridProps?.flatData || []).length);
  }, [dataGridProps.flatData]);

  useEffect(() => {
    if (dataGridProps?.tableRef?.current) {
      const selectedDirectoryId = selectedItems?.directory?.id;
      const selectedDiriveId = selectedItems?.drive?.id;
      const selectedFolderId = Object.fromEntries(
        (selectedItems?.folders || [])
          .map((each: any) => each.id)
          .map((id) => [id, true]),
      );
      (dataGridProps?.tableRef?.current as Table<any>)?.setRowSelection(() => ({
        [selectedDirectoryId]: true,
        [selectedDiriveId]: true,
        ...selectedFolderId,
      }));
    }
  }, [selectedItems]);

  return (
    <Modal open={isOpen}>
      {/* Header */}
      <Header
        title={integrationHeadingMapping[headings].headerText}
        onClose={closeModal}
      />

      {/* Body */}
      <div className="flex flex-col gap-3 px-5">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'entitySearch',
              placeholder: integrationHeadingMapping[headings].placeholder,
              dataTestId: `entitySearch-search`,
              inputClassName: 'text-sm py-[9px]',
              autofocus: true,
              rightIcon: 'search',
              className: 'mt-4 sticky top-0',
            },
          ]}
        />
        {!!(items.length > 1) && !!!debouncedSearchValue && (
          <BreadCrumb
            items={items}
            onItemClick={(item) => sliceItems(item.id)}
            variant={BreadCrumbVariantEnum.ChannelDoc}
            iconSize={16}
            labelClassName="!text-base"
          />
        )}
        <DataGrid {...dataGridProps} />
      </div>

      {/* Footer */}
      <div className="flex gap-4 justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={tc('cancel')}
          variant={ButtonVariant.Secondary}
          onClick={closeModal}
          size={Size.Small}
        />

        {headings === 'site' && (
          <Button
            label={integrationHeadingMapping[headings].btnLabel}
            variant={ButtonVariant.Primary}
            onClick={() => {
              if (selectedItems?.directory) {
                appendItem({
                  id: selectedItems.directory.id,
                  label: selectedItems.directory.name,
                  meta: selectedItems.directory,
                });
              }
              resetField('entitySearch');
            }}
            disabled={
              dataGridProps.isLoading ||
              onSelectLoading ||
              !selectedItems?.directory
            }
            size={Size.Small}
          />
        )}
        {headings === 'drive' && (
          <Button
            label={integrationHeadingMapping[headings].btnLabel}
            variant={ButtonVariant.Primary}
            onClick={() => {
              if (selectedItems?.drive) {
                appendItem({
                  id: selectedItems.drive.id,
                  label: selectedItems.drive.name,
                  meta: selectedItems.drive,
                });
              }
              resetField('entitySearch');
            }}
            disabled={
              dataGridProps.isLoading ||
              onSelectLoading ||
              !selectedItems?.drive
            }
            size={Size.Small}
          />
        )}
        {headings === 'folder' && (
          <Button
            label={integrationHeadingMapping[headings].btnLabel}
            variant={ButtonVariant.Primary}
            onClick={() => {
              setOnSelectLoading(true);
              onSelect(selectedItems?.folders || [], (isError: boolean) => {
                setOnSelectLoading(false);
                if (!isError) {
                  closeModal();
                }
              });
              resetField('entitySearch');
            }}
            loading={onSelectLoading}
            disabled={
              dataGridProps.isLoading ||
              onSelectLoading ||
              !(selectedItems?.folders || []).length
            }
            size={Size.Small}
          />
        )}
      </div>
    </Modal>
  );
};

export default EntitySelectModal;
