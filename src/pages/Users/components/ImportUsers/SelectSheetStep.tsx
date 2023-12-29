/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StepEnum } from './utils';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { updateParseImport, validateImport } from 'queries/importUsers';
import { truncate } from 'lodash';
import Spinner from 'components/Spinner';
import ValidateHeaders from './ValidateHeaders';

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
  const parseMutation = useMutation((formData: any) =>
    updateParseImport(importId, formData),
  );

  const { control, getValues, setValue, watch } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const _sheet = watch('sheet');

  useEffect(() => {
    if (meta.sheetOptions?.length === 1) {
      setValue('sheet', meta.sheetOptions[0].value);
    }
  }, [meta.sheetOptions]);

  // useEffect(() => {
  //   if (_sheet) {
  //     parseMutation.mutate({ sheetIndex: _sheet?.value });
  //     setMeta((m: any) => ({ ...m, sheetIndex: _sheet?.value }));
  //   }
  // }, [_sheet]);

  const onSubmit = () => {
    if (_sheet) {
      parseMutation.mutate({ sheetIndex: _sheet?.value });
      setMeta((m: any) => ({ ...m, sheetIndex: _sheet?.value }));
      setStep(StepEnum.Review);
    }
  };

  const fields = [
    {
      type: FieldType.SingleSelect,
      control,
      name: 'sheet',
      label: 'Select Sheet',
      placeholder: 'Select Sheet',
      showSearch: false,
      options: meta.sheetOptions,
      dataTestId: 'select-sheet',
    },
  ];

  return (
    <Modal open={open} className="max-w-2xl">
      <Header
        title={
          <div className="v-center">
            <Icon name="boldTick" className="text-primary-500" />
            <span>
              {truncate(meta?.file?.name, { length: 40 })} file successfully
              imported
            </span>
          </div>
        }
        onClose={closeModal}
        closeBtnDataTestId="close-modal"
      />
      {meta.sheetOptions?.length > 1 && (
        <div className="px-6 pt-4 pb-6">
          <Layout fields={fields} />
        </div>
      )}

      <ValidateHeaders
        isLoading={false}
        isSuccess={true}
        isError={false}
        // isLoading={parseMutation.isLoading}
        // isSuccess={parseMutation.isSuccess}
        // isError={parseMutation.isError}
        meta={meta}
        onConfirm={() => {
          onSubmit();
        }}
        closeModal={closeModal}
        disableSubmit={meta.sheetOptions?.length != 1 ? !_sheet : false}
        selectedSheet={
          meta.sheetOptions?.length === 1 ? meta.sheetOptions[0] : _sheet?.value
        }
        isCsv={false}
      />

      {/* <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Cancel"
          variant={Variant.Secondary}
          size={Size.Small}
          className="mr-4"
          onClick={closeModal}
          dataTestId="cancel-cta"
          disabled={parseMutation.isLoading || validateUserMutation.isLoading}
        />
        <Button
          label="Confirm"
          size={Size.Small}
          dataTestId="confirm-cta"
          onClick={() => {
            validateUserMutation.mutate();
          }}
          disabled={!_sheet || parseMutation.isLoading}
          loading={validateUserMutation.isLoading}
        />
      </div> */}
    </Modal>
  );
};

export default SelectSheetStep;
