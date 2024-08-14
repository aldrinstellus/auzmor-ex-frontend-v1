/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StepEnum } from '../utils';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import { updateParseImport, validateImport } from 'queries/importUsers';
import { truncate } from 'lodash';
import Spinner from 'components/Spinner';
import ValidateHeaders from '../ValidateHeaders';
import { useJobStore } from 'stores/jobStore';
import { useTranslation } from 'react-i18next';
import Truncate from 'components/Truncate';

type AppProps = {
  open: boolean;
  closeModal: () => any;
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
  importId,
  meta,
  setMeta,
}) => {
  const { setStep } = useJobStore();
  const parseMutation = useMutation((formData: any) =>
    updateParseImport(importId, formData),
  );
  const { t } = useTranslation('profile', {
    keyPrefix: 'importUser.selectSheetStep',
  });
  const { control, getValues, setValue, watch } = useForm<IForm>({
    mode: 'onSubmit',
  });

  const _sheet = watch('sheet');

  useEffect(() => {
    if (meta.sheetOptions?.length === 1) {
      setValue('sheet', meta.sheetOptions[0].value);
    }
  }, [meta.sheetOptions]);

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
      label: t('selectSheet'),
      placeholder: t('selectSheet'),
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
            <Truncate text={meta?.file?.name} className="max-w-[280px] " />
            <span className="ml-1">{t('fileSuccessfullyImported')}</span>
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
    </Modal>
  );
};

export default SelectSheetStep;
