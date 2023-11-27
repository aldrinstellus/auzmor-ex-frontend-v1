/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';
import { StepEnum } from './utils';
import Button, { Size, Variant } from 'components/Button';

type AppProps = {
  open: boolean;
  setStep: (...args: any) => any;
};

const ConfirmationStep: React.FC<AppProps> = ({ open, setStep }) => {
  return (
    <Modal open={open} className="max-w-md">
      <Header
        title="Confirmation"
        onClose={() => setStep(StepEnum.Review)}
        closeBtnDataTestId="import-people-close"
      />
      <div className="p-6 flex justify-center items-center text-sm text-neutral-900">
        Are you sure you want to proceed?
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Review module"
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={() => setStep(StepEnum.Review)}
          dataTestId="mport-people-cancel"
        />
        <Button
          label="Confirm"
          size={Size.Small}
          dataTestId="mport-people-next"
          onClick={() => setStep(StepEnum.Review)}
        />
      </div>
    </Modal>
  );
};

export default ConfirmationStep;
