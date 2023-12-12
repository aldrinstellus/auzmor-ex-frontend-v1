import React, { useEffect, useState } from 'react';
import Spinner from 'components/Spinner';
import Modal from 'components/Modal';
import { StepEnum } from './utils';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import { useMutation } from '@tanstack/react-query';
import {
  parseImport,
  updateParseImport,
  validateImport,
} from 'queries/importUsers';
import Button, { Size, Variant } from 'components/Button';
import ImportingForExcel from './ImportingForExcel';
import usePoller from './usePoller';
import ValidateHeaders from './ValidateHeaders';

type AppProps = {
  open: boolean;
  setStep: (...args: any) => any;
  closeModal: () => any;
  importId: string;
  meta: Record<string, any>;
  setMeta: (...args: any) => any;
};

const ImportingFileStep: React.FC<AppProps> = ({
  open,
  setStep,
  closeModal,
  importId,
  meta,
  setMeta,
}) => {
  const isCsv = meta?.file?.name?.includes('.csv');
  const [startPolling, setStartPolling] = useState(false);
  const { ready, loading } = usePoller({
    importId,
    action: 'parse',
    statusCheck: 'PROCESSING',
    enabled: isCsv && startPolling,
  });

  const updateParseMutation = useMutation(() =>
    updateParseImport(importId, {}),
  );

  useEffect(() => {
    if (isCsv && ready) {
      updateParseMutation.mutate();
    }
  }, [ready]);

  const parseMutation = useMutation(() => parseImport(importId), {
    onSuccess: async () => {
      setMeta((m: any) => ({ ...m, parsed: true }));
      setStartPolling(true);
    },
  });

  const validateUserMutation = useMutation(() => validateImport(importId), {
    onError: () => {},
    onSuccess: () => {
      setStep(StepEnum.Review);
    },
  });

  useEffect(() => {
    if (!meta.parsed) {
      parseMutation.mutate();
    }
  }, []);

  const renderForExcel = () => {
    if (parseMutation.isLoading) {
      return (
        <div className="p-6 flex flex-col items-center justify-center">
          <Spinner className="!h-[100px] !w-[100px]" />
          <div className="text-lg text-neutral-900 font-bold mt-4">
            Importing {meta?.file?.name}
          </div>
        </div>
      );
    }
    return (
      <ImportingForExcel
        importId={importId}
        fileName={meta?.file?.name}
        setMeta={setMeta}
        setStep={setStep}
      />
    );
  };

  const _isSuccess = (meta?.parsed || parseMutation.isSuccess) && ready;
  const _isLoading =
    loading || parseMutation.isLoading || updateParseMutation.isLoading;

  const renderForCsv = () => {
    return (
      <div>
        <Header
          title={
            <div className="v-center">
              {_isSuccess && (
                <Icon name="boldTick" className="text-primary-500" />
              )}
              <span>
                {_isSuccess ? 'Imported' : 'Importing'} {meta?.file?.name} file
              </span>
            </div>
          }
          onClose={closeModal}
          closeBtnDataTestId="import-people-close"
        />
        <ValidateHeaders
          isLoading={_isLoading}
          isSuccess={_isSuccess}
          isError={parseMutation.isError}
        />

        {!_isLoading && (
          <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
            <Button
              label="Cancel"
              variant={Variant.Secondary}
              size={Size.Small}
              className="mr-4"
              onClick={closeModal}
              dataTestId="import-people-cancel"
              disabled={validateUserMutation.isLoading}
            />
            <Button
              label="Confirm"
              size={Size.Small}
              dataTestId="import-people-next"
              onClick={() => {
                validateUserMutation.mutate();
              }}
              disabled={validateUserMutation.isLoading}
              loading={validateUserMutation.isLoading}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal open={open} className="max-w-2xl">
      {isCsv ? renderForCsv() : renderForExcel()}
    </Modal>
  );
};

export default ImportingFileStep;
