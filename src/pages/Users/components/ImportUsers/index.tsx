import React, { useState } from 'react';
import { StepEnum, stepMap } from './utils';

type AppProps = {
  open: boolean;
  closeModal?: () => any;
};

const ImportUsers: React.FC<AppProps> = ({ open, closeModal }) => {
  const [step, setStep] = useState(StepEnum.Upload);

  const Component: any = stepMap[step];

  return <Component open={open} setStep={setStep} closeModal={closeModal} />;
};

export default ImportUsers;
