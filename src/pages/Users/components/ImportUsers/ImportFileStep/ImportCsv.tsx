import React, { useEffect } from 'react';
import Header from 'components/ModalHeader';
import Icon from 'components/Icon';
import { useMutation } from '@tanstack/react-query';
import { updateParseImport } from 'queries/importUsers';
import usePoller from '../usePoller';
import ValidateHeaders from '../ValidateHeaders';
import { StepEnum } from '../utils';
import { useJobStore } from 'stores/jobStore';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  importId: string;
  meta: Record<string, any>;
  setMeta: (...args: any) => any;
};

const ImportingFileStep: React.FC<AppProps> = ({
  closeModal,
  importId,
  meta,
  setMeta,
}) => {
  const { setStep } = useJobStore();
  const { ready, data, loading } = usePoller({
    importId,
    action: 'parse',
    statusCheck: 'PROCESSING',
  });

  const updateParseMutation = useMutation(() =>
    updateParseImport(importId, {}),
  );

  useEffect(() => {
    if (ready) {
      updateParseMutation.mutate();
      setMeta((m: any) => ({ ...m, parsedData: data }));
    }
  }, [ready]);

  const _isLoading = loading || updateParseMutation.isLoading;

  return (
    <div>
      <Header
        title={
          <div className="v-center">
            {ready && <Icon name="boldTick" className="text-primary-500" />}
            <span>
              {ready ? 'Imported' : 'Importing'} {meta?.file?.name} file
            </span>
          </div>
        }
        onClose={closeModal}
        closeBtnDataTestId="import-people-close"
      />
      <ValidateHeaders
        isLoading={_isLoading}
        isSuccess={ready}
        meta={meta}
        closeModal={closeModal}
        onConfirm={() => setStep(StepEnum.Review)}
      />
    </div>
  );
};

export default ImportingFileStep;
