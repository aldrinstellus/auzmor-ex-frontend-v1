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
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLinks, updateChannelLink } from 'queries/channel';

interface IAddLinksModalProps {
  open: boolean;
  closeModal: () => void;
  isCreateMode?: boolean;
  linkDetails?: IChannelLink;
  channelId?: string;
  isEditMode?: boolean;
}

const AddLinkModal: FC<IAddLinksModalProps> = ({
  open,
  closeModal,
  isCreateMode,
  linkDetails,
  channelId = '',
  isEditMode = false,
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('channelLinksWidget', {
    keyPrefix: 'addLinkModal',
  });

  const schema = yup.object({
    title: yup
      .string()
      .required(t('labelField.requiredError'))
      .min(2, 'Label must be at least 2 characters')
      .max(20, t('labelField.maxLengthError')),
    url: yup
      .string()
      .required(t('urlField.requiredError'))
      .test('is-valid-url', 'The URL must start with http or https', (value) =>
        /^(http|https):\/\//.test(value || ''),
      )
      .matches(URL_REGEX, {
        message: t('urlField.invalidUrlError'),
        excludeEmptyString: true,
      })
      .max(256, 'max length 256 characters '),
  });
  const updateLinksMutation = useMutation(
    async (payload: any) => {
      if (isCreateMode) {
        return createLinks(channelId, { links: [payload] });
      } else {
        return updateChannelLink(payload);
      }
    },
    {
      onError: (error: any) => console.log(error),
      onSuccess: async () => {
        await queryClient.invalidateQueries(['channel-links-widget']);
        closeModal();
      },
    },
  );

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
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

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'url' && value.url) {
        const titleMatch = value.url.match(/https?:\/\/(?:www\.)?([^.]+)\./);
        const title = titleMatch ? titleMatch[1] : '';
        setValue('title', title);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = () => {
    try {
      const { title, url } = getValues();
      if (isCreateMode) {
        updateLinksMutation.mutate({ title, url });
        return;
      }
      if (isEditMode) {
        updateLinksMutation.mutate({
          channelId: channelId,
          linkId: linkDetails?.id,
          title,
          url,
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fields = [
    {
      name: 'url',
      label: t('urlField.label'),
      placeholder: t('urlField.placeholder'),
      type: FieldType.Input,
      control,
      error: errors.url?.message,
      className: '',
      dataTestId: 'add-link-url',
      required: true,
      autofocus: true,
    },
    {
      name: 'title',
      label: t('labelField.label'),
      placeholder: t('labelField.placeholder'),
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
        title={isCreateMode ? t('title.createMode') : t('title.updateMode')}
        onClose={() => closeModal()}
        closeBtnDataTestId="add-link-close"
      />

      <div className="flex flex-col w-full max-h-[400px] p-6 gap-6 overflow-y-auto">
        <Layout fields={fields} className="space-y-6" />
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 px-6 py-4 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('cancelCTA')}
          size={Size.Small}
          variant={Variant.Secondary}
          onClick={closeModal}
          className="mr-4"
          dataTestId="add-link-back"
        />
        <Button
          label={
            isCreateMode ? t('saveCTA.createMode') : t('saveCTA.updateMode')
          }
          size={Size.Small}
          variant={Variant.Primary}
          onClick={handleSubmit(onSubmit)}
          loading={updateLinksMutation.isLoading}
          dataTestId="add-link-cta"
        />
      </div>
    </Modal>
  );
};

export default AddLinkModal;
