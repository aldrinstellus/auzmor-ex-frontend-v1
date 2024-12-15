import React, { useCallback, useEffect, useState } from 'react';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { useDropzone } from 'react-dropzone';
import Button, { Size, Variant } from 'components/Button';
import { StepEnum } from './utils';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { EntityType } from 'interfaces';
import { useMutation } from '@tanstack/react-query';
import Spinner from 'components/Spinner';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useJobStore } from 'stores/jobStore';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

const IMPORT_FORMAT =
  'Name,Email,Manager Email,Designation,Department,Location,Employee Id,Phone Number,Date of Birth,Date of Joining,Marital Status,Role';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  setImportId: (...args: any) => any;
  setMeta: (...args: any) => any;
  importId: string;
};

const UploadFileStep: React.FC<AppProps> = ({
  open,
  closeModal,
  setImportId,
  setMeta,
  importId,
}) => {
  const { getApi } = usePermissions();
  const { t } = useTranslation('profile', {
    keyPrefix: 'importUser.uploadFileStep',
  });
  const { error: uploadError, uploadMedia, uploadStatus } = useUpload();
  const [fileObj, setFileObj] = useState<any>({});
  const [fileError, setFileError] = useState('');
  const { setStep } = useJobStore();

  useEffect(() => {
    if (uploadError) {
      setFileObj({});
    }
  }, [uploadError]);

  useEffect(() => {
    if (importId) {
      setStep(StepEnum.Importing);
    }
  }, [importId]);

  const startImportUser = getApi(ApiEnum.StartImportUsers);
  const triggerUserImportMutation = useMutation(
    () => startImportUser({ fileId: fileObj.id }),
    {
      onError: () => {},
      onSuccess: (res: any) => {
        const isCsv = fileObj?.name?.includes('.csv');
        setImportId(res.result.data.id);
        setMeta({ file: fileObj, isCsv });
      },
    },
  );

  const onDrop = useCallback(
    async (acceptedFiles: any, fileRejections: any[]) => {
      if (acceptedFiles?.[0]?.size === 0) {
        setFileError(t('emptyFileError'));
        return;
      }
      if (fileRejections?.length) {
        const reason =
          fileRejections[0]?.errors?.[0].message || t('genericError');

        if (reason.includes('is larger')) {
          setFileError(t('fileSizeError'));
        } else if (reason.includes('file type')) {
          setFileError(t('fileTypeError'));
        } else {
          setFileError(reason);
        }
      } else {
        setFileError('');
        const uploadedMedia = await uploadMedia(
          acceptedFiles,
          EntityType.UserImport,
        );
        setFileObj(uploadedMedia[0]);
      }
    },
    [uploadMedia, t],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/*': ['.csv', '.xls', '.xlsx'] },
    maxSize: 5000000,
  });

  const downloadFormat = () => {
    const blob = new Blob([IMPORT_FORMAT], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    document.body.appendChild(a);
    a.click();
  };

  return (
    <Modal open={open} className="max-w-2xl">
      <Header
        title={t('importCandidates')}
        onClose={closeModal}
        closeBtnDataTestId="close-import-modal"
      />
      <div className="px-6 py-4">
        <div className="flex flex-col justify-center items-center space-y-2">
          <Icon name="folderOpen" className="text-primary-600" size={48} />
          <div className="text-sm text-neutral-900">
            {t('addFileInstruction')}
          </div>
          <div className="text-xs text-neutral-500">
            {t('fileRequirements')}
          </div>
          <div
            className="text-primary-600 font-bold text-sm cursor-pointer"
            data-testid="download-format-cta"
            onClick={downloadFormat}
          >
            {t('downloadFormat')}
          </div>
        </div>
        {(!!uploadError || !!fileError) && (
          <div className="mt-4">
            <Banner
              variant={BannerVariant.Error}
              title={uploadError || fileError}
            />
          </div>
        )}
        <div className="mt-4">
          <div
            {...getRootProps()}
            className="border border-dashed border-primary-600 rounded-9xl p-6"
          >
            <input {...getInputProps()} aria-label="drop files here" />
            {(() => {
              if (uploadStatus === UploadStatus.Uploading) {
                return (
                  <div className="flex flex-col justify-center items-center py-6">
                    <Spinner />
                    <div className="text-sm mt-2">{t('uploadingFile')}</div>
                  </div>
                );
              }
              if (uploadStatus === UploadStatus.Finished && !uploadError) {
                return (
                  <div className="flex flex-col justify-center items-center py-6">
                    <Icon name="document" size={52} />
                    <div className="text-sm mt-2">{fileObj?.name}</div>
                  </div>
                );
              }
              return (
                <div className="text-neutral-900 flex flex-col items-center space-y-4">
                  <div>{t('dropFilesHere')}</div>
                  <div className="bg-neutral-100 rounded-full text-xs font-bold">
                    {t('or')}
                  </div>
                  <div
                    className="flex items-center space-x-1 border rounded-full px-4 py-1"
                    data-testid="upload-from-system"
                  >
                    <Icon name="documentUpload" size={18} />
                    <span className="text-sm font-bold">
                      {t('uploadFromDocuments')}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('cancel')}
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={closeModal}
          dataTestId="import-cancel-cta"
          disabled={
            uploadStatus === UploadStatus.Uploading ||
            triggerUserImportMutation.isLoading
          }
        />
        <Button
          label={t('next')}
          size={Size.Small}
          dataTestId="import-next-cta"
          onClick={() => triggerUserImportMutation.mutate()}
          disabled={
            !!uploadError ||
            uploadStatus === UploadStatus.YetToStart ||
            uploadStatus === UploadStatus.Uploading
          }
          loading={triggerUserImportMutation.isLoading}
        />
      </div>
    </Modal>
  );
};

export default UploadFileStep;
