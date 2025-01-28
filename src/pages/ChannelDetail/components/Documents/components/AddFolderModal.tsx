import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

interface IAddFolderModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSelect: (folderName: string) => void;
  isLoading: boolean;
}

interface IForm {
  folderName: string;
}

const AddFolderModal: FC<IAddFolderModalProps> = ({
  isOpen,
  closeModal,
  onSelect,
  isLoading,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { t: tc } = useTranslation('common');
  const schema = yup.object({
    folderName: yup
      .string()
      .trim()
      .min(1, t('emptyFolderNameError'))
      .max(250, t('charLimitFolderNameError', { limit: 250 })),
  });

  const { handleSubmit, control, formState, getValues } = useForm<IForm>({
    defaultValues: { folderName: '' },
    resolver: yupResolver(schema),
  });

  const onSubmit = () => onSelect(getValues('folderName'));
  return (
    <Modal open={isOpen}>
      {/* Header */}
      <Header title={t('addFolderTitle')} onClose={closeModal} />

      {/* Body */}
      <div className="p-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'folderName',
              label: t('folderNameInputLabel'),
              placeholder: t('folderNameInputPlaceholder'),
              dataTestId: `folder-name-input`,
              inputClassName: 'text-sm py-[9px]',
              error: formState.errors.folderName?.message,
              autofocus: true,
            },
          ]}
        />
      </div>

      {/* Footer */}
      <div className="flex gap-4 justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={tc('cancel')}
          variant={ButtonVariant.Secondary}
          onClick={closeModal}
          size={Size.Small}
        />
        <Button
          label={tc('save')}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          loading={isLoading}
          size={Size.Small}
        />
      </div>
    </Modal>
  );
};

export default AddFolderModal;
