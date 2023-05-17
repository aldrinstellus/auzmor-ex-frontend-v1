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
import { Logo } from 'components/Logo';
import { readFirstAxiosError, redirectWithToken } from 'utils/misc';
import { Link } from 'react-router-dom';
import Banner, { Variant as BannerVariant } from 'components/Banner';

interface ILoginProps {}

interface IForm {
  email: string;
  password: string;
  domain?: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter valid email address')
    .required('Required field'),
  password: yup.string().required('Required field'),
  domain: yup.string(),
});

const Login: React.FC<ILoginProps> = () => {
  const loginMutation = useMutation((formData: IForm) => login(formData), {
    onSuccess: (data) =>
      redirectWithToken(data.result.data.redirectUrl, data.result.data.uat),
  });

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

  const onSubmit = (formData: IForm) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      <div
        className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"
        data-testid="signin-cover-image"
      ></div>
      <div className="w-1/2 h-full flex justify-center items-center relative bg-white">
        <div className="absolute top-8 right-8" data-testid="signin-logo-image">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">Signin</div>
          <form
            className="mt-16"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="signin-form"
          >
            {!!loginMutation.isError && (
              <div className="mb-8">
                <Banner
                  dataTestId="signin-incorrect-creds-msg"
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
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
