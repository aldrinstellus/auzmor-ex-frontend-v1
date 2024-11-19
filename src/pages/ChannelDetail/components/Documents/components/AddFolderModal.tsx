import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface IAddFolderModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSelect: (folderName: string) => void;
}

interface IForm {
  folderName: string;
}

const AddFolderModal: FC<IAddFolderModalProps> = ({
  isOpen,
  closeModal,
  onSelect,
}) => {
  const schema = yup.object({
    folderName: yup
      .string()
      .trim()
      .min(1, 'Folder name can not ne empty')
      .max(250, 'Folder name can not exceed 250 character'),
  });

  const {
    control,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    defaultValues: { folderName: 'Folder Name' },
    resolver: yupResolver(schema),
  });
  return (
    <Modal open={isOpen}>
      {/* Header */}
      <Header title="Add new folder" onClose={closeModal} />

      {/* Body */}
      <Layout
        fields={[
          {
            type: FieldType.Input,
            control,
            name: 'folderName',
            label: 'Folder name',
            placeholder: 'Type folder name',
            dataTestId: `folder-name-input`,
            inputClassName: 'text-sm py-[9px]',
            className: 'p-6',
            error: errors.folderName?.message,
            autofocus: true,
          },
        ]}
      />

      {/* Footer */}
      <div className="flex gap-4 justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label="Cancel"
          variant={ButtonVariant.Secondary}
          onClick={closeModal}
          size={Size.Small}
        />
        <Button
          label={'save'}
          onClick={() => onSelect(getValues('folderName'))}
          disabled={false}
          size={Size.Small}
        />
      </div>
    </Modal>
  );
};

export default AddFolderModal;
