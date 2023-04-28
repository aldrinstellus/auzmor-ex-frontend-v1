import React, { useEffect, useMemo, useState } from 'react';
import { Logo } from 'components/Logo';
import { Success } from 'components/Logo';
import Layout, { FieldType } from 'components/Form';
import Button, { Size, Type } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from 'queries/account';

interface IForgotPasswordProps {}

interface IForm {
  email: string;
}

const schema = yup.object({
  email: yup.string().required().email('Please enter valid email address'),
});

const ForgotPassword: React.FC<IForgotPasswordProps> = () => {
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation((formData: any) =>
    forgotPassword(formData),
  );

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    forgotPasswordMutation.reset();
  }, [watch('email')]);

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
  ];

  const onSubmit = (formData: IForm) => {
    forgotPasswordMutation.mutate(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="bg-[url(images/welcomeToOffice.png)] w-1/2 h-full bg-no-repeat bg-cover" />
      <div className="w-1/2 h-full flex justify-center items-center relative bg-white">
        <div className="absolute top-8 right-8">
          <Logo />
        </div>
        <div className="w-full max-w-[440px]">
          {forgotPasswordMutation.isSuccess ? (
            <>
              <div className="text-center flex justify-center items-center flex-col space-y-9">
                <Success />
                <div>
                  Email has been sent to <b>{getValues().email}</b> with
                  instructions on resetting your password.
                </div>
              </div>
              <Button
                label={'Back to Sign In'}
                className="w-full mt-8"
                onClick={() => navigate('/login')}
                size={Size.Large}
              />
            </>
          ) : (
            <>
              <div className="font-extrabold text-neutral-900 text-4xl">
                Forgot Password
              </div>
              <form className="mt-16" onSubmit={handleSubmit(onSubmit)}>
                <Layout fields={fields} />
                <Button
                  type={Type.Submit}
                  label={'Reset Via Email'}
                  loading={forgotPasswordMutation.isLoading}
                  className="w-full mt-8"
                  size={Size.Large}
                  disabled={!isValid}
                />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
