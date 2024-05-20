import React, { FC, Fragment } from 'react';
import Card from 'components/Card';
import Button, { Variant as ButtonVariant } from 'components/Button';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useTranslation } from 'react-i18next';
import FolderNavigator from './components/FolderNavigator';
import Divider from 'components/Divider';
import {
  IntegrationOptionsEnum,
  createFolder,
  getLinkToken,
  patchConfig,
  useConnectedStatus,
} from 'queries/storage';
import Spinner from 'components/Spinner';
import FilterMenuDocument from './components/FilterMenu/FilterMenuDocument';
import Icon from 'components/Icon';
import { useMutation } from '@tanstack/react-query';
import useModal from 'hooks/useModal';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { useDocumentPath } from 'hooks/useDocumentPath';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import useURLParams from 'hooks/useURLParams';
import DocumentSearch from './DocumentSearch';
import { useAppliedFiltersForDoc } from 'stores/appliedFiltersForDoc';
import { useVault } from '@apideck/vault-react';
import useAuth from 'hooks/useAuth';

export enum FilePickerObjectType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  DRIVE = 'DRIVE',
}

interface IDocumentProps {}

const Document: FC<IDocumentProps> = ({}) => {
  const { t } = useTranslation('common');
  const [isOpen, openModal, closeModal] = useModal(false, true);
  const { getCurrentFolder } = useDocumentPath();
  const { filters } = useAppliedFiltersForDoc();
  const { searchParams } = useURLParams();
  const { open } = useVault();
  const { user } = useAuth();

  const searchQuery = searchParams.get('search') || undefined;
  const isFilterApplied =
    !!filters?.docTypeCheckbox?.length ||
    !!filters?.docPeopleCheckbox?.length ||
    !!filters?.docModifiedRadio;

  const showSearchResults = searchQuery || isFilterApplied;

  // Mutations
  // const resyncMutation = useMutation({
  //   mutationKey: ['resync'],
  //   mutationFn: resync,
  // });
  const configStorageMutation = useMutation({
    mutationKey: ['configure-storage'],
    mutationFn: getLinkToken,
    onSuccess: (data, variables) => {
      open({
        token: data.result.data.linkToken,
        unifiedApi: 'file-storage',
        serviceId: variables,
        onReady: () => console.log('ready'),
        onClose: () => console.log('onClose'),
        onConnectionChange: () => {
          patchConfig({ isAuthorized: true, id: data.result.data.id }, refetch);
        },
      });
    },
  });
  const createFolderMutation = useMutation({
    mutationKey: ['create-folder'],
    mutationFn: createFolder,
  });

  //Queries
  const {
    data: syncStatus,
    isLoading,
    refetch,
  } = useConnectedStatus(user?.email || '');
  const isSynced = !!syncStatus?.data?.result?.data;
  const filterForm = useForm<{
    search: string;
    documentType?: {
      label: string;
      value: string;
      dataTestId: string;
    };
    folderName?: string;
    showFiles?: boolean;
    showFolders?: boolean;
  }>({
    mode: 'onChange',
    defaultValues: {
      search: '',
      folderName: 'Untitled folder',
      showFiles: true,
      showFolders: true,
    },
  });
  const [showFiles, showFolders] = filterForm.watch([
    'showFiles',
    'showFolders',
  ]);

  const handleCreateFolder = () =>
    createFolderMutation.mutate(
      {
        folderId: getCurrentFolder().id,
        name: filterForm.getValues('folderName') || 'Undifined folder',
      },
      {
        onError: () => {
          toast(<FailureToast content={'Opps... Somthing went wrong.'} />, {
            closeButton: (
              <Icon name="closeCircleOutline" color="text-red-500" size={20} />
            ),
            style: {
              border: `1px solid ${twConfig.theme.colors.red['300']}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            },
            autoClose: TOAST_AUTOCLOSE_TIME,
            transition: slideInAndOutTop,
            theme: 'dark',
          });
        },
        onSuccess: () => {
          toast(<SuccessToast content={'Folder created successfully'} />, {
            closeButton: (
              <Icon
                name="closeCircleOutline"
                color="text-primary-500"
                size={20}
              />
            ),
            style: {
              border: `1px solid ${twConfig.theme.colors.primary['300']}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            },
            autoClose: TOAST_AUTOCLOSE_TIME,
            transition: slideInAndOutTop,
            theme: 'dark',
          });
        },
        onSettled: () => {
          closeModal();
        },
      },
    );

  //Components
  const ConnectionCard: FC = () => {
    const Integrations = [
      {
        icon: 'google',
        label: 'Google Drive',
        integrationValue: IntegrationOptionsEnum.GoogleDrive,
      },
      {
        icon: 'sharePoint',
        label: 'Share Point',
        integrationValue: IntegrationOptionsEnum.Sharepoint,
      },
    ];
    return (
      <div className="flex flex-col w-full items-center justify-center gap-4">
        <p className="text-xl text-neutral-900 font-semibold">
          Enable integrations to view your files
        </p>
        <Divider />
        <p className="text-base text-neutral-900">
          To view your files here, you need to enable google drive integration.
        </p>
        <div className="flex px-2 py-3 border border-dashed rounded-9xl border-primary-400 w-full justify-center items-center flex-col gap-2">
          {Integrations.map((each) => {
            return (
              <Button
                variant={ButtonVariant.Secondary}
                leftIcon={each.icon}
                label={each.label}
                key={each.integrationValue}
                className="w-64"
                onClick={() =>
                  configStorageMutation.mutate(each.integrationValue)
                }
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Card className="flex flex-col gap-6 p-8 pb-16 w-full justify-center bg-white">
        <div className="flex justify-between">
          <p className="font-bold text-2xl text-neutral-900">Documents</p>
          {isSynced && !isLoading && (
            <Button
              label="New folder"
              leftIcon="add"
              leftIconClassName="text-white hover:!text-white"
              iconColor="text-white"
              leftIconHover={false}
              leftIconHoverColor="text-white"
              loading={configStorageMutation.isLoading}
              onClick={openModal}
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
            <FilterMenuDocument
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
                <div className="flex overflow-hidden rounded-14xl border border-neutral-300 bg-neutral-100 h-8 items-center">
                  <p
                    className="flex w-24 text-center border-r border-neutral-300 justify-center cursor-pointer items-center gap-2"
                    onClick={() =>
                      filterForm.setValue('showFiles', !!!showFiles)
                    }
                  >
                    Files
                    {showFiles && (
                      <Icon name="tickCircle" size={16} hover={false} />
                    )}
                  </p>
                  <p
                    className="flex w-24 text-center justify-center cursor-pointer items-center gap-2"
                    onClick={() =>
                      filterForm.setValue('showFolders', !!!showFolders)
                    }
                  >
                    Folders
                    {showFolders && (
                      <Icon name="tickCircle" size={16} hover={false} />
                    )}
                  </p>
                </div>
              </div>
            </FilterMenuDocument>
            {showSearchResults && <DocumentSearch searchQuery={searchQuery} />}
            {!showSearchResults && (
              <FolderNavigator
                showFiles={!!showFiles}
                showFolders={!!showFolders}
              />
            )}
          </Fragment>
        )}
      </Card>
      {isOpen && (
        <Modal open={isOpen}>
          <Header title="New folder" onClose={closeModal} />
          <Layout
            fields={[
              {
                type: FieldType.Input,
                control: filterForm.control,
                name: 'folderName',
                className: 'px-5 py-3',
                placeholder: 'Enter folder name',
                dataTestId: 'new-folder-name',
                disabled: false,
                cleareable: true,
              },
            ]}
          />
          <div className="flex gap-4 justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
            <Button
              label="Cancel"
              variant={ButtonVariant.Secondary}
              onClick={closeModal}
            />
            <Button
              label="Create"
              variant={ButtonVariant.Primary}
              onClick={handleCreateFolder}
              loading={createFolderMutation.isLoading}
            />
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default Document;
