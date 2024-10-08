import { FC, useEffect } from 'react';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import Button, { Size, Variant } from 'components/Button';
import { IChannelLink } from 'stores/channelStore';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout, { FieldType } from 'components/Form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'hooks/useDebounce';
import { isValidUrl } from 'utils/misc';
import { getUrlWithProtocol } from 'utils/misc';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

interface IAddLinksModalProps {
  open: boolean;
  closeModal: () => void;
  isCreateMode?: boolean;
  linkDetails?: IChannelLink;
  channelId?: string;
  isEditMode?: boolean;
}

type InputForm = {
  title: string;
  url: string;
};

const AddLinkModal: FC<IAddLinksModalProps> = ({
  open,
  closeModal,
  isCreateMode,
  linkDetails,
  channelId = '',
  isEditMode = false,
}) => {
  const { getApi } = usePermissions();
  const queryClient = useQueryClient();
  const { t } = useTranslation('channelLinksWidget', {
    keyPrefix: 'addLinkModal',
  });

  const schema = yup.object({
    title: yup
      .string()
      .required(t('labelField.requiredError'))
      .min(2, t('labelField.minLengthError'))
      .max(20, t('labelField.maxLengthError')),
    url: yup
      .string()
      .test('is-valid-url', t('urlField.invalidUrlError'), (value) =>
        isValidUrl(getUrlWithProtocol(value)),
      )
      .max(256, t('urlField.maxLengthError')),
  });

  const createLinks = getApi(ApiEnum.CreateChannelLinks);
  const updateChannelLink = getApi(ApiEnum.UpdateChannelLink);
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
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<InputForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      title: linkDetails?.title,
      url: linkDetails?.url,
    },
  });

  const url = useDebounce(watch('url'), 800);

  const getPreviewLink = getApi(ApiEnum.GetLinkPreviewApi);
  useEffect(() => {
    if (!url) {
      return;
    }
    getPreviewLink(getUrlWithProtocol(url)).then((response: any) => {
      if (!getValues('title') && response?.title) {
        setValue('title', response.title);
      }
    });
  }, [url, setValue]);

  const onSubmit = (formData: InputForm) => {
    try {
      const { title, url } = formData;
      if (isCreateMode) {
        updateLinksMutation.mutate({ title, url: getUrlWithProtocol(url) });
        return;
      }
      if (isEditMode) {
        updateLinksMutation.mutate({
          channelId: channelId,
          linkId: linkDetails?.id,
          title,
          url: url?.startsWith('http') ? url : `https://${url}`,
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
      required: true,
      maxLength: 20,
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
