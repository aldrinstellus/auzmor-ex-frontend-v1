import { useMutation } from '@tanstack/react-query';
import { login } from 'queries/account';
import React from 'react';
import { Variant as InputVariant } from '@auzmorui/component-library.components.input';
import { useForm } from 'react-hook-form';
import { Layout, FieldType } from '@auzmorui/component-library.components.form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Variant as ButtonVariant,
} from '@auzmorui/component-library.components.button';
import { Divider } from '@auzmorui/component-library.components.divider';
import Logo from 'components/Logo';

interface ILoginProps {}

interface IForm {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('Please enter valid email address'),
  password: yup.string().min(6, 'At leaset 6 digits'),
});

const Login: React.FC<ILoginProps> = () => {
  const loginMutation = useMutation((formData: any) => login(formData), {
    onError: () => {},
    onSuccess: (res: any) => {
      // logic to redirect: window.location.href = res.redirectUrl
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const fields = [
    {
      type: FieldType.Input,
      variant: InputVariant.Text,
      className: 'w-full',
      placeholder: 'Enter your email address / username',
      name: 'email',
      label: 'Work Email / Username',
      error: errors.email?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => {},
    },
  ];

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover"></div>
      <div className="w-1/2 h-full flex justify-center items-center relative">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          <div className="font-extrabold text-neutral-900 text-4xl">Signin</div>
          <form className="mt-16" onSubmit={handleSubmit(() => {})}>
            <Layout className="w-full" fields={fields} />
            <div className="flex flex-row-reverse mt-4">
              <div className="font-bold text-sm">Forgot Password?</div>
            </div>
            <Button label={'Sign In'} className="w-full mt-8" />
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
            className="w-full mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
