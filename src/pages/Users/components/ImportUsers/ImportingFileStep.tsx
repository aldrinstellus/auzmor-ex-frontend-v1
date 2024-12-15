import React, { useEffect, useState } from 'react';
import Spinner from 'components/Spinner';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import { useMutation } from '@tanstack/react-query';
import ImportingForExcel from './ImportingForExcel';
import usePoller from './usePoller';
import ValidateHeaders from './ValidateHeaders';
import { StepEnum } from './utils';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

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
  const { getApi } = usePermissions();
  const isCsv = meta?.file?.name?.includes('.csv');
  const [startPolling, setStartPolling] = useState(false);
  const { ready, data, loading } = usePoller({
    importId,
    action: 'parse',
    statusCheck: 'PROCESSING',
    enabled: isCsv && startPolling,
  });

  const updateParseImport = getApi(ApiEnum.UpdateParseImport);
  const updateParseMutation = useMutation(() =>
    updateParseImport(importId, {}),
  );

  useEffect(() => {
    if (isCsv && ready) {
      updateParseMutation.mutate();
      setMeta((m: any) => ({ ...m, parsedData: data }));
    }
  }, [ready]);

  const parseImport = getApi(ApiEnum.ParseImport);
  const parseMutation = useMutation(() => parseImport(importId), {
    onSuccess: async () => {
      setMeta((m: any) => ({ ...m, parsed: true }));
      setStartPolling(true);
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
          meta={meta}
          closeModal={closeModal}
          onConfirm={() => setStep(StepEnum.Review)}
        />
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
