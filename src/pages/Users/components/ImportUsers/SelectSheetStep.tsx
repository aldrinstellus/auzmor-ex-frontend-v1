/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StepEnum } from './utils';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  setStep: (...args: any) => any;
  importId: string;
  meta: Record<string, any>;
  setMeta: (...args: any) => any;
};

interface IForm {
  sheet: any;
}

const SelectSheetStep: React.FC<AppProps> = ({
  open,
  closeModal,
  setStep,
  importId,
  meta,
  setMeta,
}) => {
  const { handleSubmit, control, reset } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const onSubmit = async (data: any) => {
    console.log('::>>>', data);
    setStep(StepEnum.Review);
  };

  const fields = [
    {
      type: FieldType.AsyncSingleSelect,
      control,
      name: 'sheet',
      label: 'Select Sheet',
      placeholder: 'Select Sheet',
      option: () => {},
    },
  ];

  return (
    <Modal open={open} className="max-w-2xl">
      <Header
        title={
          <div className="v-center">
            <Icon name="tickCircle" className="text-primary-500" />
            <span>file_name.xls file successfully imported</span>
          </div>
        }
        onClose={closeModal}
        closeBtnDataTestId="import-people-close"
      />
      <div className="p-6">
        <Layout fields={fields} />
      </div>
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Cancel"
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={closeModal}
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

export default SelectSheetStep;
