import { yupResolver } from '@hookform/resolvers/yup';
import Layout, { FieldType } from 'components/Form';
import { useLoginViaSSO } from 'queries/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Variant as InputVariant } from 'components/Input';
import Button, { Type as ButtonType, Size } from 'components/Button';

export interface ILoginViaSSOProps {
  setViaSSO: (flag: boolean) => void;
}

interface IForm {
  email: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter valid email address')
    .required('Required field'),
});

const LoginViaSSO: React.FC<ILoginViaSSOProps> = ({ setViaSSO }) => {
  const {
    watch,
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const email = watch('email');

  const { refetch, isFetching, error } = useLoginViaSSO(
    { email },
    {
      enabled: false,
      onError: (error: any) => {
        if (error.response.data.errors.length) {
          setError('email', {
            type: 'custom',
            message: error.response.data.errors[0].message,
          });
        }
      },
      onSuccess: (data: any) => {
        if (data && data.redirectUrl) {
          window.location = data.redirectUrl;
        }
      },
    },
  );

  const onSubmit = (formData: IForm) => {
    refetch();
  };

  const getDataTestIdForValidationErrors = () => {
    if (!error || !!!(error as any)?.response) {
      return '';
    }
    const errorCode = (error as any).response.data.errors[0].code; //error.response.data.errors[0].message;
    if (errorCode === 'USER_IS_DEACTIVATED') {
      return 'sso-deleted-email-msg';
    } else if (errorCode === 'USER_EMAIL_NOT_FOUND') {
      return 'sso-invalid-email-msg';
    } else if (errorCode === 'USER_IS_NOT_ACTIVE') {
      return 'sso-inactive-email-msg';
    } else if (errorCode === 'SSO_DISABLED') {
      return 'sso-email-not-provisioned-msg';
    }
  };

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter your email address',
      name: 'email',
      label: 'Work Email / Username',
      error: errors.email?.message,
      dataTestId: 'sso-email',
      errorDataTestId: getDataTestIdForValidationErrors(),
      control,
    },
  ];
  return (
    <div className="w-full max-w-[440px] relative h-full">
      <div className="font-extrabold text-neutral-900 text-4xl mt-20">
        Sign In via SSO
      </div>
      <form
        className="mt-32"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="sso-signin-form"
      >
        <Layout fields={fields} />

        <Button
          dataTestId="sso-signin-btn"
          label={'Sign In'}
          className="w-full mt-16"
          disabled={!isValid || isFetching}
          size={Size.Large}
          type={ButtonType.Submit}
        />
      </form>
      <div className="absolute bottom-4 flex justify-center w-full">
        <div>
          <span
            className="text-primary-500 font-bold cursor-pointer"
            onClick={() => setViaSSO(false)}
            data-testid="sso-signin-cta"
          >
            Sign In
          </span>{' '}
          using Email and Password
        </div>
      </div>
    </div>
  );
};

export default LoginViaSSO;
