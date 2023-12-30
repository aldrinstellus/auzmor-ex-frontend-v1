import React, { useEffect, useState } from 'react';
import { StepEnum, stepMap } from './utils';
import { useJobStore } from 'stores/jobStore';

type AppProps = {
  open: boolean;
  closeModal?: () => any;
};

const ImportUsers: React.FC<AppProps> = ({ open, closeModal }) => {
  const [importId, setImportId] = useState<string>('');
  const [meta, setMeta] = useState<Record<string, any>>({});
  const { step, setStep } = useJobStore();

  const Component: any = stepMap[step];

  useEffect(() => {
    return () => {
      setStep(StepEnum.Upload);
    };
  }, []);

  return (
    <Component
      key={step}
      open={open}
      closeModal={closeModal}
      importId={importId}
      setImportId={setImportId}
      meta={meta}
      setMeta={setMeta}
    />
  );
};

export default ImportUsers;
