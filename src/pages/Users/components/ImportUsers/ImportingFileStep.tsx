import React from 'react';
import Spinner from 'components/Spinner';
import Modal from 'components/Modal';
import { StepEnum } from './utils';

type AppProps = {
  open: boolean;
  setStep: (...args: any) => any;
};

const ImportingFileStep: React.FC<AppProps> = ({ open, setStep }) => {
  return (
    <Modal open={open} className="max-w-2xl">
      <div className="p-6 flex flex-col items-center justify-center">
        <Spinner className="!h-[100px] !w-[100px]" />
        <div
          onClick={() => setStep(StepEnum.SelectSheet)}
          className="text-lg text-neutral-900 font-bold mt-4"
        >
          Importing filename.xls
        </div>
      </div>
    </Modal>
  );
};

export default ImportingFileStep;
