import { useMutation } from '@tanstack/react-query';
import { login } from 'queries/account';
import React, { useEffect } from 'react';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
  Size,
} from 'components/Button';
import Divider from 'components/Divider';
import {
  getSubDomain,
  readFirstAxiosError,
  redirectWithToken,
} from 'utils/misc';
import { Link } from 'react-router-dom';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import { useGetSSOFromDomain } from 'queries/organization';
import { useLoginViaSSO } from 'queries/auth';
import useAuth from 'hooks/useAuth';

export interface ILoginViaCredProps {
  setViaSSO: (flag: boolean) => void;
}

interface IForm {
  email: string;
  password: string;
  domain?: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email address. Please enter a valid email address.')
    .required('Required field'),
  password: yup.string().required('Required field'),
  domain: yup.string(),
});

const LoginViaCred: React.FC<ILoginViaCredProps> = ({ setViaSSO }) => {
  const { user } = useAuth();

  const loginMutation = useMutation((formData: IForm) => login(formData), {
    onSuccess: (data) =>
      redirectWithToken({
        redirectUrl: data.result.data.redirectUrl,
        token: data.result.data.uat,
      }),
  });

  const domain = getSubDomain(window.location.host);
  const { data, isLoading } = useGetSSOFromDomain(
    domain,
    domain !== '' ? true : false,
  );

  const { refetch } = useLoginViaSSO(
    { domain },
    {
      enabled: false,
      onSuccess: (data: any) => {
        if (data && data.redirectUrl) {
          window.location = data.redirectUrl;
        }
      },
    },
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: { domain: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    loginMutation.reset();
  }, [watch('email'), watch('password')]);

  const onSubmit = (formData: IForm) => {
    loginMutation.mutate(formData);
  };

  if (user) {
    redirectWithToken({});
    return null;
  }

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      placeholder: 'Enter your email address / username',
      name: 'email',
      label: 'Work Email / Username',
      error: loginMutation.isError || errors.email?.message,
      dataTestId: 'signin-email',
      control,
    },
    {
      type: FieldType.Password,
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password',
      rightIcon: 'people',
      error: loginMutation.isError || errors.password?.message,
      dataTestId: 'signin-password',
      control,
      showChecks: false,
    },
  ];

  return (
    <div className="w-full max-w-[440px] h-full">
      <div className="font-extrabold text-neutral-900 text-4xl mt-20">
        Signin
      </div>
      <div className="text-neutral-900 text-sm font-normal mt-4">
        Hello! Welcome back <span>👋</span>
      </div>
      <form
        className="mt-16"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="signin-form"
      >
        {!!loginMutation.isError && (
          <div className="mb-8">
            <Banner
              dataTestId="signin-error-message"
              title={
                readFirstAxiosError(loginMutation.error) ||
                'Email address or password is incorrect'
              }
              variant={BannerVariant.Error}
            />
          </div>
        )}

        <Layout fields={fields} />
        <div
          className="flex justify-end mt-4"
          data-testId="signin-forgot-password"
        >
          <Link to="/forgot-password">
            <div className="font-bold text-sm">Forgot Password?</div>
          </Link>
        </div>
        <Button
          dataTestId="signin-btn"
          label={'Sign In'}
          className="w-full mt-8"
          disabled={!isValid}
          size={Size.Large}
          type={ButtonType.Submit}
          loading={loginMutation.isLoading}
        />
      </form>
      {(data?.result?.data?.sso?.active || !!!domain) && (
        <>
          <div className="flex items-center mt-8">
            <Divider />
            <div className="rounded-full border text-sm mx-6 px-2.5 py-1.5">
              or
            </div>
            <Divider />
          </div>
          <Button
            dataTestId="signin-sso-cta"
            label={'Sign In via SSO'}
            variant={ButtonVariant.Secondary}
            size={Size.Large}
            className="w-full mt-8"
            disabled={loginMutation.isLoading}
            onClick={() => {
              if (domain) {
                refetch();
              } else {
                setViaSSO(true);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default LoginViaCred;
