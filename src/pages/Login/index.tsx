import { useMutation } from '@tanstack/react-query';
import { login } from 'queries/auth';
import React, { useEffect } from 'react';
import { Variant as InputVariant } from '@auzmorui/component-library.components.input';
import { useForm } from 'react-hook-form';
import { Layout, FieldType } from '@auzmorui/component-library.components.form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Variant as ButtonVariant,
  Type as ButtonType,
} from '@auzmorui/component-library.components.button';
import { Divider } from '@auzmorui/component-library.components.divider';
import { Logo } from 'components/Logo';

interface ILoginProps { }

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
  const loginMutation = useMutation((formData: any) => login(formData), {
    onSuccess: (data) => {
      if (process.env.NODE_ENV === 'development') {
        window.location.replace(
          `http://localhost:3000?accessToken=${data.result.data.uat}`,
        );
      } else {
        window.location.replace(
          `${data.result.data.redirectUrl}?accessToken=${data.result.data.uat}`,
        );
      }
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    defaultValues: { domain: '' },
    mode: 'onChange',
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
      onChange: (data: string, e: React.ChangeEvent) => { },
    },
    {
      type: FieldType.Input,
      variant: InputVariant.Password,
      className: 'w-full mt-8',
      placeholder: 'Enter password',
      name: 'password',
      label: 'Password',
      rightIcon: 'people',
      error: errors.password?.message,
      control,
      getValues,
      onChange: (data: string, e: React.ChangeEvent) => { },
    },
  ];

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
            <Layout fields={fields} />
            <div className="flex justify-end mt-4">
              <div className="font-bold text-sm">Forgot Password?</div>
            </div>
            <Button
              label={'Sign In'}
              className="w-full mt-8"
              disabled={!isValid}
              type={ButtonType.Submit}
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
            className="w-full mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
