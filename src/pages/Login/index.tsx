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
import { redirectWithToken } from 'utils/misc';
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
      className: 'w-full',
      placeholder: 'Enter your email address / username',
      name: 'email',
      label: 'Work Email / Username',
      error: loginMutation.isError || errors.email?.message,
      dataTestId: 'login-email',
      control,
    },
    {
      type: FieldType.Password,
      className: 'w-full mt-8',
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password',
      rightIcon: 'people',
      error: loginMutation.isError || errors.password?.message,
      dataTestId: 'login-password',
      control,
    },
  ];

  useEffect(() => {}, []);

  const onSubmit = (formData: IForm) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"></div>
      <div className="w-1/2 h-full flex justify-center items-center relative">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">Signin</div>
          <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
            {!!loginMutation.isError && (
              <div className="mb-8">
                <Banner
                  title="Email address or password is incorrect"
                  variant={BannerVariant.Error}
                />
              </div>
            )}

            <Layout fields={fields} />
            <div className="flex justify-end mt-4">
              <Link to="/forgot-password">
                <div className="font-bold text-sm">Forgot Password?</div>
              </Link>
            </div>
            <Button
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
            label={'Sign In via SSO'}
            variant={ButtonVariant.Secondary}
            size={Size.Large}
            className="w-full mt-8"
            loading={loginMutation.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
