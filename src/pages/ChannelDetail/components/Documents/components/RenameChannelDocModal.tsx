import Button, { Variant as ButtonVariant, Size } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const { t: tc } = useTranslation('common');
  const schema = yup.object({
    folderName: yup
      .string()
      .trim()
      .min(1, t('emptyRenameError'))
      .max(250, t('charLimitRenameError', { limit: 250 })),
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
      <Header title={t('rename')} onClose={closeModal} />

      {/* Body */}
      <Layout
        fields={[
          {
            type: FieldType.Input,
            control,
            name: 'name',
            placeholder: t('renameInputPlaceholder'),
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
          label={tc('cancel')}
          variant={ButtonVariant.Secondary}
          onClick={closeModal}
          size={Size.Small}
          disabled={isLoading}
        />
        <Button
          label={tc('okay')}
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
