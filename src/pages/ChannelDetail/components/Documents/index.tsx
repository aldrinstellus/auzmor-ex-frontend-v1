import React, { FC, Fragment, useEffect, useState } from 'react';
import Card from 'components/Card';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import useModal from 'hooks/useModal';
import NoDataFound from 'components/NoDataFound';
import Divider from 'components/Divider';
import EntitySelectModal from './components/EntitySelectModal';
import AddFolderModal from './components/AddFolderModal';
import DataList from 'components/DataGrid';
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

export enum DocIntegrationEnum {
  Sharepoint = 'SHAREPOINT',
  GoogleDrive = 'GOOGLE_DRIVE',
}

interface IForm {
  selectAll: boolean;
}

interface IDocumentProps {}

const Document: FC<IDocumentProps> = ({}) => {
  const [isOpen, openModal, closeModal] = useModal();
  const [isAddModalOpen, openAddModal, closeAddModal] = useModal();
  const { control } = useForm<IForm>();
  const [totalRows, setTotalRows] = useState<number>(0);
  const { getApi } = usePermissions();
  const { channelId } = useParams();

  const integrationType: DocIntegrationEnum = DocIntegrationEnum.Sharepoint;
  const isConnectionMade = true;
  const isBaseFolderSet = true;

  const updateConnection = getApi(ApiEnum.UpdateConnection);
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

  const columns = React.useMemo<ColumnDef<any>[]>(
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
                onChange: table.getToggleAllRowsSelectedHandler(),
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
                onChange: row.getToggleSelectedHandler(),
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
            {info.getValue() as string}
          </div>
        ),
        thClassName: 'flex-1',
        tdClassName: 'flex-1',
      },
      {
        accessorKey: 'owner',
        header: () => <div className="font-bold text-neutral-500">Owner</div>,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'lastUpdated',
        header: () => (
          <div className="font-bold text-neutral-500">Last Updated</div>
        ),
        cell: (info) => info.getValue(),
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

  const datalistProps = useDataGrid({
    apiEnum: ApiEnum.GetDirectories,
    isInfiniteQuery: false,
    q: {},
    dataGridProps: {
      columns,
      isRowSelectionEnabled: true,
      onRowClick: (e, table, virtualRow) => {
        table.setRowSelection((param) => {
          return {
            ...param,
            [virtualRow.index]: !!!param[virtualRow.index],
          };
        });
      },
    },
  });

  useEffect(() => {
    setTotalRows((datalistProps?.flatData || []).length);
  }, [datalistProps.flatData]);

  const NoConnection = () => (
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
            Activate your preferred folder/site from google drive or sharepoint
            to create, share and collaborate on files and folders in this
            channel.
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
  );

  return (
    <Fragment>
      <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white">
        <div className="flex justify-between">
          <p className="font-bold text-2xl text-neutral-900">Documents</p>
        </div>
        {isBaseFolderSet && <DataList {...datalistProps} />}
        {!isBaseFolderSet && <NoConnection />}
      </Card>
      {isOpen && (
        <EntitySelectModal
          isOpen={isOpen}
          closeModal={closeModal}
          onSelect={(entity: any) =>
            updateConnectionMutation.mutate({
              channelId: channelId,
              folderId: entity[0].id,
              name: entity[0].name,
              orgProviderId: 17,
            } as any)
          }
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
    </Fragment>
  );
};

export default Document;
