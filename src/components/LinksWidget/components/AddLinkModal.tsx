import { FC, useEffect } from 'react';

import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Size, Variant } from 'components/Button';
import { IChannelLink } from 'stores/channelStore';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout, { FieldType } from 'components/Form';
import { URL_REGEX } from 'utils/constants';

interface IAddLinksModalProps {
  open: boolean;
  closeModal: () => void;
  isCreateMode?: boolean;
  linkDetails?: IChannelLink;
  setLinkDetails: (link: IChannelLink) => void;
}

const AddLinkModal: FC<IAddLinksModalProps> = ({
  open,
  closeModal,
  isCreateMode,
  linkDetails,
  setLinkDetails,
}) => {
  const schema = yup.object({
    title: yup
      .string()
      .optional()
      .max(20, 'Label cannot contain more than 20 characters'),
    url: yup
      .string()
      .required('This field cannot be empty')
      .matches(URL_REGEX, 'Invalid link'),
  });

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset({
      title: linkDetails?.title,
      url: linkDetails?.url,
    });
  }, [linkDetails]);

  const onSubmit = () => {
    const { title, url } = getValues();
    setLinkDetails({ title, url });
  };

  const fields = [
    {
      name: 'url',
      label: 'URL',
      placeholder: 'ex: www.abc.com',
      type: FieldType.Input,
      control,
      error: errors.url?.message,
      className: '',
      dataTestId: 'add-link-url',
      maxLength: 256,
      required: true,
    },
    {
      name: 'title',
      label: 'Label',
      placeholder: 'ex: New hire checklist',
      type: FieldType.Input,
      control,
      error: errors.title?.message,
      className: '',
      dataTestId: 'add-link-title',
      maxLength: 20,
      required: false,
    },
  ];

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[638px]">
      <Header
        title={isCreateMode ? 'Add Link' : 'Edit Link'}
        onClose={() => closeModal()}
        closeBtnDataTestId="add-link-close"
      />

      <div className="flex flex-col w-full max-h-[400px] p-6 gap-6 overflow-y-auto">
        <Layout fields={fields} className="space-y-6" />
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 px-6 py-4 bg-blue-50 rounded-b-9xl">
        <Button
          label="Cancel"
          size={Size.Small}
          variant={Variant.Secondary}
          onClick={closeModal}
          className="mr-4"
          dataTestId="add-link-back"
        />
        <Button
          label={isCreateMode ? 'Add Link' : 'Save'}
          size={Size.Small}
          variant={Variant.Primary}
          onClick={handleSubmit(onSubmit)}
          dataTestId="add-link-cta"
        />
      </div>
    </Modal>
  );
};

export default AddLinkModal;
