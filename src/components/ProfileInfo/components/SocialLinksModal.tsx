import IconButton, { Variant } from 'components/IconButton';
import Modal from 'components/Modal';
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  WebIcon,
} from 'components/Icon/socialIcons';
import Layout, { FieldType } from 'components/Form';
import { useForm } from 'react-hook-form';
import Button, {
  Variant as ButtonVariant,
  Size,
  Type as ButtonType,
} from 'components/Button';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  socialLinks: Record<string, any>;
};

interface IForm {
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  web: string;
}

const SocialLinksModal: React.FC<AppProps> = ({
  open,
  closeModal,
  socialLinks,
}) => {
  const schema = yup.object({
    linkedin: yup.string().url(),
    instagram: yup.string().url(),
    facebook: yup.string().url(),
    twitter: yup.string().url(),
    web: yup.string().url(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: socialLinks,
  });

  const fields = [
    {
      type: FieldType.Input,
      name: 'linkedin',
      placeholder: 'www.linkedin.com',
      control,
      dataTestId: 'linkedin-url',
      error: errors.linkedin?.message,
      fieldIcon: (
        <div className="p-2 border rounded-full mr-2">
          <LinkedinIcon />
        </div>
      ),
    },
    {
      type: FieldType.Input,
      name: 'twitter',
      placeholder: 'www.twitter.com',
      control,
      dataTestId: 'twitter-url',
      error: errors.twitter?.message,
      fieldIcon: (
        <div className="p-2 border rounded-full mr-2">
          <TwitterIcon />
        </div>
      ),
    },
    {
      type: FieldType.Input,
      name: 'instagram',
      placeholder: 'www.instagram.com',
      control,
      dataTestId: 'instagram-url',
      error: errors.instagram?.message,
      fieldIcon: (
        <div className="p-2 border rounded-full mr-2">
          <InstagramIcon />
        </div>
      ),
    },
    {
      type: FieldType.Input,
      name: 'facebook',
      placeholder: 'www.facebook.com',
      control,
      dataTestId: 'facebook-url',
      error: errors.facebook?.message,
      fieldIcon: (
        <div className="p-2 border rounded-full mr-2">
          <FacebookIcon />
        </div>
      ),
    },
    {
      type: FieldType.Input,
      name: 'web',
      placeholder: 'www.abc.com',
      control,
      dataTestId: 'web-url',
      error: errors.web?.message,
      fieldIcon: (
        <div className="p-2 border rounded-full mr-2">
          <WebIcon />
        </div>
      ),
    },
  ];

  const onSubmit = (links: any) => {
    console.log('>>>>>>', links);
  };

  return (
    <Modal open={open} className="max-w-2xl" dataTestId="social-link">
      <div className="flex flex-wrap items-center p-4 space-x-3 border-neutral-100 border-b-1">
        <div className="text-lg text-neutral-900 font-extrabold flex-auto">
          Add your social accounts
        </div>
        <IconButton
          onClick={closeModal}
          icon={'close'}
          dataTestId="reactivate-user-close"
          className="!flex-[0] !text-right !bg-inherit !p-1"
          color="text-neutral-900"
          variant={Variant.Primary}
        />
      </div>
      <div className="px-6 py-4">
        <form>
          <Layout fields={fields} className="space-y-4" />
        </form>
      </div>
      <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50 rounded-b-9xl border-neutral-100 border-t-1">
        <Button
          variant={ButtonVariant.Secondary}
          size={Size.Small}
          label={'Cancel'}
          dataTestId="cancel-cta"
          onClick={closeModal}
        />
        <Button
          label={'Save'}
          className="bg-primary-500 !text-white flex"
          size={Size.Small}
          type={ButtonType.Submit}
          dataTestId="save-cta"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </Modal>
  );
};

export default SocialLinksModal;
