import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import Card from 'components/Card';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useTranslation } from 'react-i18next';
import FolderNavigator from './components/FolderNavigator';
import Divider from 'components/Divider';
import FilterMenu from 'components/FilterMenu';
import {
  IntegrationOptionsEnum,
  getLinkToken,
  patchConfig,
  resync,
  useSyncStatus,
} from 'queries/storage';
import { useMergeLink } from '@mergeapi/react-merge-link';
import { useMutation } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';
import queryClient from 'utils/queryClient';
import { humanizeTime } from 'utils/time';

interface IDocumentProps {}

const Document: FC<IDocumentProps> = ({}) => {
  const { t } = useTranslation('common');
  const [storageConfig, setStorageConfig] = useState<Record<string, string>>();
  const resyncMutation = useMutation({
    mutationKey: ['resync'],
    mutationFn: resync,
  });
  const {
    data: syncStatus,
    isLoading,
    isRefetching,
    refetch,
  } = useSyncStatus();

  const isSynced = !!syncStatus?.data?.result?.data?.length;
  const lastSynced = syncStatus?.data?.result?.data[0]?.lastSyncStart;

  const configStorageMutation = useMutation({
    mutationKey: ['configure-storage'],
    mutationFn: getLinkToken,
    onSuccess: (data) => {
      setStorageConfig(data.result.data);
    },
  });

  const onSuccess = useCallback(
    (public_token: string) => {
      patchConfig(storageConfig?.id || '', public_token, refetch);
    },
    [storageConfig],
  );

  const { open, isReady } = useMergeLink({
    linkToken: storageConfig?.linkToken,
    onSuccess,
  });

  useEffect(() => {
    if (isReady) {
      open();
    }
  }, [isReady]);

  const filterForm = useForm<{
    search: string;
    documentType?: {
      label: string;
      value: string;
      dataTestId: string;
    };
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  const ConnectionCard = () => {
    const Integrations = [
      {
        icon: 'google',
        label: 'Google drive',
        integrationValue: IntegrationOptionsEnum.GoogleDrive,
      },
    ];
    return (
      <div className="flex flex-col w-full items-center justify-center gap-4">
        <p className="text-2xl text-neutral-900 font-semibold">
          Enable integrations to view your files
        </p>
        <Divider />
        <p className="text-xl text-neutral-900">
          To view your files here, you need to enable google drive integration.
        </p>
        <div className="flex px-2 py-3 border border-dashed rounded-9xl border-primary-400 w-full justify-center">
          {Integrations.map((each) => {
            return (
              <Button
                variant={ButtonVariant.Secondary}
                leftIcon={each.icon}
                key={each.integrationValue}
                label={each.label}
                onClick={() => {
                  configStorageMutation.mutate(each.integrationValue);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const SyncStatus: FC<{ lastSynced: string }> = ({ lastSynced }) => {
    const [syncedAt, setSyncedAt] = useState(
      `Synced ${humanizeTime(lastSynced)}`,
    );
    useEffect(() => {
      const updateInterval = setInterval(() => {
        setSyncedAt(`Synced ${humanizeTime(lastSynced)}`);
      }, 60000);
      return () => clearInterval(updateInterval);
    }, [lastSynced]);

    return (
      <div
        className="flex items-center gap-2 group cursor-pointer border border-neutral-300 px-4 rounded"
        onClick={async () => {
          await resyncMutation.mutateAsync();
          await refetch();
          queryClient.invalidateQueries(['get-storage-files'], {
            exact: false,
          });
          queryClient.invalidateQueries(['get-storage-folders'], {
            exact: false,
          });
        }}
      >
        <div className={`${isRefetching && 'animate-spin'}`}>
          <Icon name="refresh" size={16} />
        </div>
        <p className="group-hover:text-primary-500 text-neutral-500">
          {isRefetching ? 'Syncing...' : syncedAt}
        </p>
      </div>
    );
  };

  return (
    <Card className="flex flex-col gap-6 p-8 w-full justify-center bg-white">
      <div className="flex justify-between">
        <p className="font-bold text-2xl text-neutral-900">Documents</p>
        {isSynced && !isLoading && (
          <Button
            label="Add documents"
            leftIcon="add"
            leftIconClassName="text-white hover:!text-white"
            iconColor="text-white"
            leftIconHover={false}
            leftIconHoverColor="text-white"
            loading={configStorageMutation.isLoading}
          />
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center w-full p-16">
          <Spinner />
        </div>
      ) : !isSynced ? (
        <ConnectionCard />
      ) : (
        <Fragment>
          <FilterMenu
            filterForm={filterForm}
            searchPlaceholder={t('Search documents')}
            dataTestIdFilter="document-filter-icon"
            dataTestIdSort="document-sort-icon"
            dataTestIdSearch="document-search"
          >
            <div className="flex items-center gap-8">
              <Layout
                fields={[
                  {
                    type: FieldType.SingleSelect,
                    name: 'documentType',
                    control: filterForm.control,
                    options: [
                      {
                        label: 'PDF',
                        value: 'pdf',
                        dataTestId: 'doc-type-pdf',
                      },
                      {
                        label: 'Excel',
                        value: 'excel',
                        dataTestId: 'doc-type-excel',
                      },
                      {
                        label: 'PPT',
                        value: 'ppt',
                        dataTestId: 'doc-type-ppt',
                      },
                      {
                        label: 'Word',
                        value: 'word',
                        dataTestId: 'doc-type-word',
                      },
                      {
                        label: 'Other',
                        value: 'other',
                        dataTestId: 'doc-type-other',
                      },
                    ],
                    placeholder: 'Document Type',
                    dataTestId: 'doc-type-dropdown',
                    height: 32,
                    showSearch: false,
                    className: 'w-44',
                  },
                ]}
              />
              <SyncStatus lastSynced={lastSynced} />
            </div>
          </FilterMenu>
          <FolderNavigator />
        </Fragment>
      )}
    </Card>
  );
};

export default Document;
