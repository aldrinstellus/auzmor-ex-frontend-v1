import React, { useState } from 'react';
import { StepEnum, stepMap } from './utils';

type AppProps = {
  open: boolean;
  closeModal?: () => any;
};

const ImportUsers: React.FC<AppProps> = ({ open, closeModal }) => {
  const [step, setStep] = useState(StepEnum.Upload);
  const [importId, setImportId] = useState<string>('');
  const [meta, setMeta] = useState<Record<string, any>>({});

  const Component: any = stepMap[step];

  return (
    <Component
      open={open}
      setStep={setStep}
      closeModal={closeModal}
      importId={importId}
      setImportId={setImportId}
      meta={meta}
      setMeta={setMeta}
    />
  );
};

export default ImportUsers;
