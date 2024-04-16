import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import Card from 'components/Card';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useTranslation } from 'react-i18next';
import Folder, { FolderType } from './components/Folder';
import Doc, { DocType } from './components/Doc';
import { FILES } from 'mocks/files';
import { FOLDERS } from 'mocks/folders';
import FolderNavigator from './components/FolderNavigator';
import { useDocumentPath } from 'hooks/useDocumentPath';
import Divider from 'components/Divider';
import FilterMenu from 'components/FilterMenu';
import {
  IntegrationOptionsEnum,
  getLinkToken,
  patchConfig,
} from 'queries/storage';
import { useMergeLink } from '@mergeapi/react-merge-link';
import { useMutation } from '@tanstack/react-query';

interface IDocumentProps {}

const Document: FC<IDocumentProps> = ({}) => {
  const { t } = useTranslation('common');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { path, appendFolder } = useDocumentPath();
  const [storageConfig, setStorageConfig] = useState<Record<string, string>>();

  const configStorageMutation = useMutation({
    mutationKey: ['configure-storage'],
    mutationFn: getLinkToken,
    onSuccess: (data) => {
      setStorageConfig(data.result.data);
    },
  });

  const onSuccess = useCallback(async (public_token: string) => {
    await patchConfig(storageConfig?.id || '', public_token);
  }, []);

  const { open, isReady } = useMergeLink({
    linkToken: storageConfig?.linkToken,
    onSuccess,
    // tenantConfig: {
    // apiBaseURL: "https://api-eu.merge.dev" /* OR your specified single tenant API base URL */
    // },
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
                  setIsConnected(true);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const Folders = () => {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Folders</p>
        <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
          {FOLDERS.map((folder: FolderType) => (
            <Folder
              key={folder.id}
              folder={folder}
              onClick={() =>
                appendFolder({ id: folder.id || '', label: folder.name })
              }
            />
          ))}
        </div>
      </div>
    );
  };

  const RecentlyUpdatedFiles = () => {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Recently updated</p>
        <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
          {FILES.map((file: DocType) => (
            <Doc key={file.id} file={file} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col gap-6 p-8 w-full justify-center bg-white">
      <div className="flex justify-between">
        <p className="font-bold text-2xl text-neutral-900">Documents</p>
        {isConnected && (
          <Button
            label="Add documents"
            leftIcon="add"
            leftIconClassName="text-white hover:!text-white"
            iconColor="text-white"
            leftIconHover={false}
            leftIconHoverColor="text-white"
          />
        )}
      </div>
      {!isConnected ? (
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
          </FilterMenu>
          {path.length === 1 ? (
            <Fragment>
              <Folders />
              <RecentlyUpdatedFiles />
            </Fragment>
          ) : (
            <FolderNavigator />
          )}
        </Fragment>
      )}
    </Card>
  );
};

export default Document;
