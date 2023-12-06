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
}) => {
  const validateUserMutation = useMutation(() => validateImport(importId), {
    onError: () => {},
    onSuccess: (res: any) => {
      setStep(StepEnum.Review);
    },
  });

  const parseMutation = useMutation((formData: any) =>
    updateParseImport(importId, formData),
  );

  const { control, getValues, watch } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const _sheet = watch('sheet');

  useEffect(() => {
    if (_sheet) {
      parseMutation.mutate({ sheetIndex: _sheet?.value });
    }
  }, [_sheet]);

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
      <div className="px-6 pt-4 pb-6">
        <Layout fields={fields} />
      </div>

      {(() => {
        if (parseMutation.isLoading) {
          return (
            <div className="px-6 pt-2 pb-4 space-y-4">
              <div className="v-center">
                <Spinner className="!h-5 !w-5" />
                <div className="text-sm text-neutral-900 pl-1">
                  Checking for headers
                </div>
              </div>
              <div className="v-center">
                <Spinner className="!h-5 !w-5" />
                <div className="text-sm text-neutral-900 pl-1">
                  Mapping Columns
                </div>
              </div>
            </div>
          );
        }
        if (parseMutation.isSuccess) {
          return (
            <div className="px-6 pt-2 pb-4 space-y-4">
              <div className="v-center">
                <Icon name="boldTick" size={20} className="text-primary-500" />
                <div className="text-sm text-neutral-900">
                  Checking for headers
                </div>
              </div>
              <div className="v-center">
                <Icon name="boldTick" size={20} className="text-primary-500" />
                <div className="text-sm text-neutral-900">Mapping Columns</div>
              </div>
            </div>
          );
        }
        if (parseMutation.isError) {
          return (
            <div className="px-6 pt-2 pb-4 space-y-4">
              <div className="v-center">
                <Spinner className="!h-5 !w-5" />
                <div className="text-sm text-neutral-900 pl-1">
                  Checking for headers
                </div>
              </div>
              <div className="v-center">
                <Spinner className="!h-5 !w-5" />
                <div className="text-sm text-neutral-900 pl-1">
                  Mapping Columns
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
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
          disabled={parseMutation.isLoading}
          loading={validateUserMutation.isLoading}
        />
      </div>
    </Modal>
  );
};

export default SelectSheetStep;
