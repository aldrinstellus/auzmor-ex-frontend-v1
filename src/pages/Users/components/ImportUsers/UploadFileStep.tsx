import React, { useCallback, useState } from 'react';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { useDropzone } from 'react-dropzone';
import Button, { Size, Variant } from 'components/Button';
import { StepEnum } from './utils';
import { UploadStatus, useUpload } from 'hooks/useUpload';
import { EntityType } from 'queries/files';
import { useMutation } from '@tanstack/react-query';
import { startImportUser } from 'queries/importUsers';
import Spinner from 'components/Spinner';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  setStep: (...args: any) => any;
  setImportId: (...args: any) => any;
  setMeta: (...args: any) => any;
};

const UploadFileStep: React.FC<AppProps> = ({
  open,
  closeModal,
  setStep,
  setImportId,
  setMeta,
}) => {
  const { uploadMedia, uploadStatus } = useUpload();
  const [fileObj, setFileObj] = useState<any>({});

  const triggerUserImportMutation = useMutation(
    () => startImportUser({ fileId: fileObj.id }),
    {
      onError: () => {},
      onSuccess: (res: any) => {
        const isCsv = fileObj?.name?.includes('.csv');
        setImportId(res.result.data.id);
        setMeta({ file: fileObj, isCsv });
        setStep(StepEnum.Importing);
      },
    },
  );

  const onDrop = useCallback(async (acceptedFiles: any) => {
    const uploadedMedia = await uploadMedia(
      acceptedFiles,
      EntityType.UserImport,
    );
    setFileObj(uploadedMedia[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'text/*': ['.csv', '.xls', '.xlsx'] },
  });

  return (
    <Modal open={open} className="max-w-2xl">
      <Header
        title="Import Candidates"
        onClose={closeModal}
        closeBtnDataTestId="import-people-close"
      />
      <div className="px-6 py-4">
        <div className="flex flex-col justify-center items-center space-y-2">
          <Icon name="folderOpen" className="text-primary-600" size={48} />
          <div className="text-sm text-neutral-900">
            To invite a list of people, add your csv,xls or xlsx file in the
            given format
          </div>
          <div className="text-xs text-neutral-500">
            File must be in csv, xls or xlsx format and must not exceed 100mb
          </div>
          <div className="text-primary-600 font-bold text-sm cursor-pointer">
            Download format
          </div>
        </div>
        <div className="mt-4">
          <div
            {...getRootProps()}
            className="border border-dashed border-primary-600 rounded-9xl p-6"
          >
            <input {...getInputProps()} />
            {(() => {
              if (uploadStatus === UploadStatus.Uploading) {
                return (
                  <div className="flex flex-col justify-center items-center py-6">
                    <Spinner />
                    <div className="text-sm mt-2">Uploading file</div>
                  </div>
                );
              }
              if (uploadStatus === UploadStatus.Finished) {
                return (
                  <div className="flex flex-col justify-center items-center py-6">
                    <Icon name="document" size={52} />
                    <div className="text-sm mt-2">{fileObj?.name}</div>
                  </div>
                );
              }
              return (
                <div className="text-neutral-900 flex flex-col items-center space-y-4">
                  <div>Drop Files Here</div>
                  <div className="bg-neutral-100 rounded-full text-xs font-bold">
                    OR
                  </div>
                  <div className="flex items-center space-x-1 border rounded-full px-4 py-1">
                    <Icon name="documentUpload" size={18} />
                    <span className="text-sm font-bold">
                      Upload from existing documents
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
          label="Cancel"
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={closeModal}
          dataTestId="import-people-cancel"
          disabled={
            uploadStatus === UploadStatus.Uploading ||
            triggerUserImportMutation.isLoading
          }
        />
        <Button
          label="Next"
          size={Size.Small}
          dataTestId="import-people-next"
          onClick={() => triggerUserImportMutation.mutate()}
          disabled={
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
