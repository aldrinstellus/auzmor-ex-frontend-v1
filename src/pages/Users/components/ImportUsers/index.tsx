import React, { useState } from 'react';
import UploadFileStep from './UploadFileStep';
import ImportingFileStep from './ImportingFileStep';
import SelectSheetStep from './SelectSheetStep';
import ReviewStep from './ReviewStep';
import ConfirmationStep from './ConfirmationStep';

type AppProps = {
  open: boolean;
  closeModal?: () => any;
};

enum StepEnum {
  Upload = 'upload',
  Importing = 'importing',
  SelectSheet = 'select_sheet',
  Review = 'review',
  Confirmation = 'confirmation',
}

const stepMap = {
  [StepEnum.Upload]: UploadFileStep,
  [StepEnum.Importing]: ImportingFileStep,
  [StepEnum.SelectSheet]: SelectSheetStep,
  [StepEnum.Review]: ReviewStep,
  [StepEnum.Confirmation]: ConfirmationStep,
};

const ImportUsers: React.FC<AppProps> = ({ open, closeModal }) => {
  const [step, setStep] = useState(StepEnum.Upload);

  const Component: any = stepMap[step];

  return <Component open={open} setStep={setStep} closeModal={closeModal} />;
};

export default ImportUsers;
