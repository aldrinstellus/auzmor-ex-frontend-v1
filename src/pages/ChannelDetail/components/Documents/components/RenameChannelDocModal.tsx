import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface IRenameChannelDocModalProps {
  defaultName: string;
  isOpen: boolean;
  isLoading?: boolean;
  closeModal: () => void;
  onSave: (name: string) => void;
}

interface IForm {
  name: string;
}

const RenameChannelDocModal: FC<IRenameChannelDocModalProps> = ({
  defaultName,
  isOpen,
  isLoading = false,
  closeModal,
  onSave,
}) => {
  const schema = yup.object({
    folderName: yup
      .string()
      .trim()
      .min(1, 'Name can not ne empty')
      .max(250, 'Name can not exceed 250 character'),
  });

  const {
    control,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    defaultValues: { name: defaultName },
    resolver: yupResolver(schema),
  });

  return (
    <Modal open={isOpen}>
      {/* Header */}
      <Header title="Rename" onClose={closeModal} />

      {/* Body */}
      <Layout
        fields={[
          {
            type: FieldType.Input,
            control,
            name: 'name',
            placeholder: 'Type new name',
            dataTestId: `rename-input`,
            inputClassName: 'text-sm py-[9px]',
            className: 'p-6',
            error: errors.name?.message,
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
          disabled={isLoading}
        />
        <Button
          label={'Okay'}
          onClick={() => onSave(getValues('name'))}
          disabled={isLoading}
          loading={isLoading}
          size={Size.Small}
        />
      </div>
    </Modal>
  );
};

export default RenameChannelDocModal;
