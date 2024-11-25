import { ColumnDef, Table } from '@tanstack/react-table';
import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import DataGrid from 'components/DataGrid';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { useDataGrid } from 'hooks/useDataGrid';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { DocIntegrationEnum } from '..';
import Icon from 'components/Icon';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'hooks/useDebounce';
import { getInitials } from 'utils/misc';

interface IEntitySelectModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSelect: (entity: any, callback: () => void) => void;
  integrationType?: DocIntegrationEnum;
  headerText?: string;
  q?: Record<string, any>;
}

interface IForm {
  entitySearch: string;
  folderId: string;
}

const EntitySelectModal: FC<IEntitySelectModalProps> = ({
  isOpen,
  closeModal,
  onSelect,
  integrationType = DocIntegrationEnum.GoogleDrive,
  headerText,
  q,
}) => {
  const { channelId } = useParams();
  const { control, watch, setValue } = useForm<IForm>({
    defaultValues: { entitySearch: '', folderId: '' },
  });
  const [totalRows, setTotalRows] = useState<number>(0);
  const [entitySearch, folderId] = watch(['entitySearch', 'folderId']);
  const debouncedSearchValue = useDebounce(entitySearch || '', 500);
  const [onSelectLoading, setOnSelectLoading] = useState(false);

  const integrationHeadingMapping = {
    [DocIntegrationEnum.GoogleDrive]: {
      headerText: headerText || 'File Picker- Google drive',
      placeholder: 'Select a google drive folder',
      btnLabel: 'Select folder',
    },
    [DocIntegrationEnum.Sharepoint]: {
      headerText: headerText || 'Select base site',
      placeholder: 'Search a sharepoint site',
      btnLabel: 'Select site',
    },
  };

  const SiteIcon: FC<{ name: string }> = ({ name }) => {
    return (
      <div className="flex w-5 h-5 border-1 border-neutral-200 text-white items-end justify-center text-xs font-medium leading-3 bg-primary-600 font-lato">
        {getInitials(name)}
      </div>
    );
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => (
          <div className="font-bold text-neutral-500">
            File Name ({totalRows})
          </div>
        ),
        cell: (info) => (
          <div className="flex gap-2 font-medium text-neutral-900 leading-6">
            {integrationType === DocIntegrationEnum.Sharepoint ? (
              <SiteIcon name={info.getValue() as string} />
            ) : (
              <Icon name="dir" />
            )}
            {info.getValue() as string}
          </div>
        ),
        size: 302,
      },
      {
        accessorKey: 'lastUpdatedAt',
        header: () => (
          <div className="font-bold text-neutral-500">Last Updated</div>
        ),
        cell: (info) => info.getValue(),
        size: 120,
      },
    ],
    [totalRows],
  );

  const dataGridProps = useDataGrid({
    apiEnum: ApiEnum.GetDirectories,
    isInfiniteQuery: false,
    q: {
      channelId: channelId,
      params: {
        q: debouncedSearchValue,
        folderId: folderId,
        ...q,
      },
    },
    dataGridProps: {
      columns,
      isRowSelectionEnabled: true,
      onRowClick: (e, table, virtualRow, isDoubleClick) => {
        if (
          isDoubleClick &&
          integrationType === DocIntegrationEnum.GoogleDrive
        ) {
          setValue('folderId', virtualRow.original.id);
          table.setRowSelection(() => ({}));
        } else {
          table.setRowSelection((param) => {
            if (!!!param[virtualRow.index]) {
              return {
                [virtualRow.index]: !!!param[virtualRow.index],
              };
            }
            return {};
          });
        }
      },
      height: 312,
    },
  });

  useEffect(() => {
    setTotalRows((dataGridProps?.flatData || []).length);
  }, [dataGridProps.flatData]);

  return (
    <Modal open={isOpen}>
      {/* Header */}
      <Header
        title={integrationHeadingMapping[integrationType].headerText}
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
              placeholder:
                integrationHeadingMapping[integrationType].placeholder,
              dataTestId: `entitySearch-search`,
              inputClassName: 'text-sm py-[9px]',
              autofocus: true,
              rightIcon: 'search',
              className: 'mt-4 sticky top-0',
            },
          ]}
        />
        <DataGrid {...dataGridProps} />
      </div>

      {/* Footer */}
      <div className="flex gap-4 justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Cancel"
          variant={ButtonVariant.Secondary}
          onClick={closeModal}
          size={Size.Small}
        />
        <Button
          label={integrationHeadingMapping[integrationType].btnLabel}
          variant={ButtonVariant.Primary}
          onClick={() => {
            setOnSelectLoading(true);
            onSelect(
              Object.keys(
                (dataGridProps.tableRef?.current as Table<any>).getState()
                  .rowSelection,
              ).map((i) => dataGridProps.flatData[i]),
              () => {
                setOnSelectLoading(false);
                closeModal();
              },
            );
          }}
          loading={dataGridProps.isLoading || onSelectLoading}
          disabled={
            dataGridProps.isLoading ||
            !dataGridProps.isRowSelected ||
            onSelectLoading
          }
          size={Size.Small}
        />
      </div>
    </Modal>
  );
};

export default EntitySelectModal;
