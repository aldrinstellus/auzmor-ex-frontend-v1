import { useMutation } from '@tanstack/react-query';
import Button, { Size, Variant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useAuth from 'hooks/useAuth';
import {
  deleteCookie,
  getCookieParam,
  getLearnUrl,
  userChannel,
} from 'utils/misc';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

type AppProps = {
  open: boolean;
  closeModal?: () => any;
  title?: string;
  variant?: string;
};

const ContactSales: React.FC<AppProps> = ({
  open,
  closeModal,
  title = '',
  variant = 'default',
}) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'contactSales',
  });
  const { user, reset } = useAuth();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();
  const schema = yup.object({
    subject: yup.string().required(),
    body: yup.string().required(),
  });

  const logoutMutation = useMutation(getApi(ApiEnum.Logout), {
    onSuccess: async () => {
      reset();
      userChannel.postMessage({
        userId: user?.id,
        payload: {
          type: 'SIGN_OUT',
        },
      });
      if (isLxp) {
        deleteCookie(getCookieParam('region_url'));
        deleteCookie(getCookieParam());
        window.location.replace(`${getLearnUrl()}`);
      }
    },
  });

  const { handleSubmit, control, watch, getValues, setValue } = useForm<any>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const _body = watch('body');

  const contactSales = getApi(ApiEnum.ContactSales);
  const postMutation = useMutation((formData: any) => contactSales(formData), {
    onError: () => {},
    onSuccess: () => {
      successToastConfig({
        content: 'Your message has been successfully sent to sales team',
        variant: 'bottom',
      });
      setValue('subject', '');
      setValue('body', '');
    },
  });

  const onSubmit = () => {
    const { subject, body } = getValues();
    const payload = {
      subject: subject || t('noSubject'),
      body,
      ...(isLxp && { from: user?.email }),
    };
    postMutation.mutate(payload);
  };

  const fields = [
    {
      name: 'subject',
      label: t('subjectLabel'),
      placeholder: t('subjectPlaceholder'),
      type: FieldType.TextArea,
      control,
      className: '',
      dataTestId: 'contact-sales-subject',
      showCounter: true,
      maxLength: 100,
      rows: 1,
      counterPosition: 'top',
      required: true,
    },
    {
      name: 'body',
      label: t('messageLabel'),
      placeholder: t('messagePlaceholder'),
      type: FieldType.TextArea,
      control,
      className: '',
      dataTestId: 'contact-sales-subject',
      showCounter: true,
      maxLength: 1000,
      rows: 4,
      counterPosition: 'top',
      required: true,
    },
  ];

  const defaultVariant = variant === 'default';
  return (
    <Modal open={open} className="max-w-2xl">
      <div className="flex justify-between items-center p-4">
        <div className="text-lg font-bold text-neutral-900 flex items-center space-x-4">
          {!defaultVariant && (
            <Icon
              name="arrowLeft"
              className="text-neutral-900"
              size={18}
              onClick={() => closeModal?.()}
            />
          )}
          <span>{t('title')}</span>
        </div>
        {defaultVariant && (
          <Icon name="close" onClick={() => closeModal?.()} size={18} />
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4 py-6">
          <div className="text-sm text-neutral-900 mb-6">{title}</div>
          <Layout fields={fields} className="space-y-6" />
          <div className="text-neutral-900 flex justify-between mt-6 px-10">
            <div className="font-bold">{t('contactUsAt')}</div>
            <div className="flex items-center space-x-4">
              <Icon name="email" size={18} />
              <a className="text-sm" href={`mailto:${t('salesSupportEmail')}`}>
                {t('salesSupportEmail')}
              </a>
              <Icon
                name="copy"
                size={16}
                onClick={() => {
                  navigator.clipboard.writeText(t('salesSupportEmail'));
                }}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Icon name="call" size={18} />
              <a className="text-sm" href={`tel:${t('salesSupportNumber')}`}>
                {t('salesSupportNumber')}
              </a>
              <Icon
                name="copy"
                size={16}
                onClick={() => {
                  navigator.clipboard.writeText(t('salesSupportNumber'));
                }}
              />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-blue-50 flex justify-between rounded-b-9xl">
          <div>
            {!defaultVariant && (
              <div
                className="mt-2 flex items-center space-x-1 cursor-pointer"
                onClick={() => logoutMutation.mutate()}
              >
                <Icon name="logoutOutline" size={20} color="text-red-500" />
                <div className="text-red-500 font-bold">{t('logout')}</div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              label={t('cancel')}
              variant={Variant.Secondary}
              size={Size.Small}
              disabled={postMutation.isLoading}
              onClick={(e) => {
                e.preventDefault();
                closeModal?.();
              }}
            />
            <Button
              label={t('submit')}
              size={Size.Small}
              onClick={() => onSubmit()}
              disabled={!_body}
              loading={postMutation.isLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ContactSales;
