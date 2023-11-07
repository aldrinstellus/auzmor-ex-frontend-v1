import { useMutation } from '@tanstack/react-query';
import Button, { Size, Variant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { contactSales } from 'queries/users';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logout } from 'queries/account';
import useAuth from 'hooks/useAuth';
import { userChannel } from 'utils/misc';

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
  const { user, reset } = useAuth();
  const schema = yup.object({
    subject: yup.string().required(),
    body: yup.string().required(),
  });

  const logoutMutation = useMutation(logout, {
    onSuccess: async () => {
      reset();
      userChannel.postMessage({
        userId: user?.id,
        payload: {
          type: 'SIGN_OUT',
        },
      });
    },
  });

  const { handleSubmit, control, watch, getValues, setValue } = useForm<any>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const _body = watch('body');

  const postMutation = useMutation((formData: any) => contactSales(formData), {
    onError: () => {},
    onSuccess: () => {
      successToastConfig(
        'Your message has been successfully sent to sales team',
        '',
        'bottom',
      );
      setValue('subject', '');
      setValue('body', '');
    },
  });

  const onSubmit = () => {
    const { subject, body } = getValues();
    postMutation.mutate({ subject: subject || 'No Subject Provided', body });
  };

  const fields = [
    {
      name: 'subject',
      label: 'Subject',
      placeholder: 'Subject (Optional)',
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
      label: 'Message',
      placeholder:
        'Please feel free to send a message to our sales team for any assistance or inquiries',
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
          <span>Contact Sales</span>
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
            <div className="font-bold">Contact us at:</div>
            <div className="flex items-center space-x-4">
              <Icon name="email" size={18} />
              <a className="text-sm" href="mailto:support@auzmor.com">
                support@auzmor.com
              </a>
              <Icon
                name="copy"
                size={16}
                onClick={() => {
                  navigator.clipboard.writeText('support@auzmor.com');
                }}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Icon name="call" size={18} />
              <a className="text-sm" href="tel:515-974-6704">
                515-974-6704
              </a>
              <Icon
                name="copy"
                size={16}
                onClick={() => {
                  navigator.clipboard.writeText('515-974-6704');
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
                <div className="text-red-500 font-bold">Logout</div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              label="Cancel"
              variant={Variant.Secondary}
              size={Size.Small}
              disabled={postMutation.isLoading}
              onClick={(e) => {
                e.preventDefault();
                closeModal?.();
              }}
            />
            <Button
              label="Submit"
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
